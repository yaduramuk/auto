var express = require('express');
var router = express.Router();
var fs = require('fs');
const makeDir = require('make-dir');
const { pool } = require('../config');
var path = require('path');
const { UpperPascalCase, LowerPascalCase, Lower_PascalCase,firstLowerCase } = require('../utils/props');

const nestGqlModuleFile = require('../files/nest-gql/gql-module');
const nestGqlEntityFile = require('../files/nest-gql/gql-entity');
const nestGqlInputFile = require('../files/nest-gql/gql-input');
const nestGqlFile = require('../files/nest-gql/gql');
const nestGqlModelFile = require('../files/nest-gql/gql-model');
const nestGqlResolverFile = require('../files/nest-gql/gql-resolver');
const nestGqlServiceFile = require('../files/nest-gql/gql-service');
// let query = `select column_name, data_type,udt_name from INFORMATION_SCHEMA.COLUMNS where table_name = '${OriginalName}'`;
router.get('/', async (req, res, next) => {
  try {
    res.render('index');
  } catch (error) {
    throw error;
  }
});

const manyToOne = async (str) => {
  try {
    var pos = str.indexOf('_fk_');
    if (pos !== -1) {
      var res = str.slice(pos + 4, str.length).split('_id')[0];
      var x = res
        .toLowerCase()
        .split('_')
        .map(function (word) {
          return word.replace(word[0], word[0].toUpperCase());
        })
        .join('');
      return x.charAt(0).toUpperCase() + x.slice(1);
    }
  } catch (error) {
    throw error;
  }
};

async function data_type_converter(x) {
  try {
    if (x.toLowerCase() == 'bool') {
      return 'boolean';
    } else if (x.toLowerCase() == 'timestamp' || x.toLowerCase() == 'date') {
      return 'Date';
    } else if (x.toLowerCase() == 'json') {
      return 'JSON';
    } else if (x.toLowerCase() == 'numeric') {
      return 'number';
    } else {
      return 'string';
    }
  } catch (error) {
    throw error;
  }
}

const queryLoader = async (tableName) => {
  try {
    let query = `select c.column_name, c.is_nullable, c.data_type, c.udt_name, te.constraint_name, te.constraint_type
                    from INFORMATION_SCHEMA.columns as c left join (select
                      kcu.constraint_name,
                      kcu.column_name,
                      tc.constraint_name as t_constraint_name,
                      tc.constraint_type
                    from
                      information_schema.key_column_usage kcu
                    inner join INFORMATION_SCHEMA.table_constraints tc on
                      kcu.constraint_name = tc.constraint_name
                    where
                      kcu.table_name = '${tableName}') as te on c.column_name = te.column_name
                    where table_name = '${tableName}'`;
    let result = await pool.query(query);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const generateEntityFunc = async (tableName) => {
  try {
    let tableArr = [];
    let result = await queryLoader(tableName);
    if (result) {
      for (let item of result.rows) {
        let firstLowerName = await Lower_PascalCase(item.column_name);
        let dataTypeConverter = await data_type_converter(item.udt_name);
        let entityGen = '';
        if (dataTypeConverter == 'JSON') {
          entityGen = `@Column({ name:"${item.column_name}", type: "json" })
  ${firstLowerName}:${dataTypeConverter}`;
        } else {
          if (item.constraint_type == 'PRIMARY KEY') {
            entityGen = `@PrimaryColumn({ name:"${item.column_name}" })
  ${firstLowerName}:${dataTypeConverter}`;
          } else if (item.constraint_type == 'FOREIGN KEY') { 
            let manyToOneName = await manyToOne(item.constraint_name); 
            let lowerManyToOneKey = await firstLowerCase(manyToOneName);  
            entityGen = `@JoinColumn({ name: "${item.column_name}" })
  @ManyToOne(type => ${manyToOneName})
  ${lowerManyToOneKey}: ${manyToOneName}`;
          } else {
            entityGen = `@Column({ name:"${item.column_name}" })
  ${firstLowerName}:${dataTypeConverter}`;
          }
        }
        tableArr.push(entityGen);
      }
    } else {
      tableArr.push('');
    }
    return tableArr.join('\n');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const generateInputFunc = async (tableName) => {
  try {
    let tableArr = [];
    let result = await queryLoader(tableName);
    if (result) {
      for (let item of result.rows) {
        let firstLowerName = await Lower_PascalCase(item.column_name);
        let dataTypeConverter = await data_type_converter(item.udt_name);
        let inputGQLGen = '';
        if (dataTypeConverter == 'JSON') {
          inputGQLGen = `\t@Field( (type)=> JSON,{ nullable: true })
  ${firstLowerName}:${dataTypeConverter}`;
        } else {
          if (item.constraint_type == 'FOREIGN KEY') {
            let ConstraintName = await manyToOne(item.constraint_name);
            let Lower_ConstraintName = await firstLowerCase(ConstraintName);
            inputGQLGen = `\t@Field((type) => ${ConstraintName}Input, { nullable: true })
  ${Lower_ConstraintName}: ${ConstraintName}Input`;
          } else {
            inputGQLGen = `\t@Field({ nullable: true })
  ${firstLowerName}:${dataTypeConverter}`;
          }
        }

        tableArr.push(inputGQLGen);
      }
    } else {
      tableArr.push('');
      console.log('No data');
    }
    return tableArr.join('\n');
  } catch (e) {
    console.log(error);
    throw e;
  }
};

const generateModelFunc = async (tableName) => {
  try {
    let tableArr = [];
    let result = await queryLoader(tableName);
    if (result) {
      for (let item of result.rows) {
        let firstLowerName = await Lower_PascalCase(item.column_name);
        let dataTypeConverter = await data_type_converter(item.udt_name);
        let inputModelGen = '';
        if (dataTypeConverter == 'JSON') {
          inputModelGen = `\t@Field( (type)=> JSON,{ nullable: true })
  ${firstLowerName}:${dataTypeConverter}`;
        } else {
          if (item.constraint_type == 'FOREIGN KEY') {
            let ConstraintName = await manyToOne(item.constraint_name);
            let Lower_ConstraintName = await firstLowerCase(ConstraintName);
            inputModelGen = `\t@Field((type) => ${ConstraintName}Model, { nullable: true })
  ${Lower_ConstraintName}: ${ConstraintName}Model`;
          } else {
            inputModelGen = `\t@Field({ nullable: true })
  ${firstLowerName}:${dataTypeConverter}`;
          }
        }

        tableArr.push(inputModelGen);
      }
    } else {
      tableArr.push('');
      console.log('No data');
    }
    return tableArr.join('\n');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const generateGqlFunc = async (tableName) => {
  try {
    let tableArr = [];
    let result = await queryLoader(tableName);
    if (result) {
      for (let item of result.rows) {
        let data = '';
        let columnArr = [];
        if (item.constraint_type == 'FOREIGN KEY') {
          let pos = item.constraint_name.indexOf('_fk_');
          if (pos !== -1) {
            let tableName = item.constraint_name.slice(pos + 4, item.constraint_name.length).split('_id')[0];
            let tableData = await queryLoader(tableName);
            for (let item of tableData.rows) {
              columnArr.push(await Lower_PascalCase(item.column_name));
            }
            tableName = await Lower_PascalCase(tableName) 
            data = `\t${tableName}\n\t{\n\t${columnArr.join('\n')} }`;
          }
        } else {
          data = await Lower_PascalCase(item.column_name);
        }
        tableArr.push(data+"\t");
      }
    } else {
      tableArr.push('');
    }
    return tableArr.join('\n');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

router.post('/generate', async (req, res, next) => {
  try {
    // await validate(req.body);
    let reqBodyArr = [];
    for (let i = 0; i < req.body.path.length; i++) {
      let reqObj = {
        path: req.body.path[i],
        subPath: req.body.subpath[i],
        tableName: req.body.tableName[i] ? req.body.tableName[i] : false,
        module: req.body.module[i] ? req.body.module[i] : false,
        resolver: req.body.resolver[i] ? req.body.resolver[i] : false,
        service: req.body.service[i] ? req.body.service[i] : false,
        entity: req.body.entity[i] ? req.body.entity[i] : false,
        input: req.body.input[i] ? req.body.input[i] : false,
        model: req.body.model[i] ? req.body.model[i] : false,
        gqlInput: req.body.gqlInput[i] ? req.body.gqlInput[i] : false,
      };
      reqBodyArr.push(reqObj);
    }
    for (let item of reqBodyArr) {
      // File Names
      let originalName = item.tableName;
      let fileName = originalName.replace(/[^a-zA-Z0-9]/g, '-');
      // Path
      const main_path = item.subPath
        ? item.path + '/' + item.subPath + '/' + fileName + '/'
        : item.path + '/' + fileName;
      const sub_path = main_path + '/' + fileName;
      // Module File
      if (item.module == 'true') {
        const mainFolderPath = await makeDir(main_path);
        const module = await fs.createWriteStream(mainFolderPath + '/' + fileName + '.module.ts');
        await module.write(await nestGqlModuleFile(fileName));
      }
      // resolver File
      if (item.resolver == 'true') {
        const folderPath = await makeDir(sub_path);
        const resolver = await fs.createWriteStream(folderPath + '/' + fileName + '.resolver.ts');
        await resolver.write(await nestGqlResolverFile(fileName));
      }
      // Service File
      if (item.service == 'true') {
        const folderPath = await makeDir(sub_path);
        const service = await fs.createWriteStream(folderPath + '/' + fileName + '.service.ts');
        await service.write(await nestGqlServiceFile(fileName));
      }
      // Entity File
      if (item.entity == 'true') {
        const folderPath = await makeDir(sub_path);
        const entity = await fs.createWriteStream(folderPath + '/' + fileName + '.entity.ts');
        const generateEntity = await generateEntityFunc(originalName);
        await entity.write(await nestGqlEntityFile(originalName, fileName, generateEntity));
      }
      // Input File
      if (item.input == 'true') {
        const folderPath = await makeDir(sub_path);
        const input = await fs.createWriteStream(folderPath + '/' + fileName + '.input.ts');
        const generatedInput = await generateInputFunc(originalName);
        await input.write(await nestGqlInputFile(fileName, generatedInput));
      }
      // Model File
      if (item.model == 'true') {
        const folderPath = await makeDir(sub_path);
        const model = await fs.createWriteStream(folderPath + '/' + fileName + '.model.ts');
        const generatedModel = await generateModelFunc(originalName);
        await model.write(await nestGqlModelFile(fileName, generatedModel));
      }
      // GQL File
      if (item.gqlInput == 'true') {
        const folderPath = await makeDir(sub_path);
        const gql = await fs.createWriteStream(folderPath + '/' + fileName + '.gql');
        const generateGql = await generateGqlFunc(originalName);
        await gql.write(await nestGqlFile(fileName, generateGql));
      }
    }
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error', { error: error.message });
  }
});

const validate = async (data, res) => {
  try {
    for (let i = 0; i < data.path.length; i++) {
      const dir = data.path[i];
      let fileName = data.tableName[i].toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
      let mainPath = await makeDir(dir);
      const files = fs.readdirSync(dir);
      console.log(files);
      if (files.includes(fileName)) {
        throw { message: 'table already exists' };
      }
    }
  } catch (error) {
    throw error;
  }
};
//D:\nest-test-project\test
module.exports = router;
