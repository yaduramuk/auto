var express = require('express');
var router = express.Router();
var fs = require('fs');
const makeDir = require('make-dir');
const { pool } = require('../config');
var path = require('path');

const nestModuleFile = require('../files/nest-rest/nest-module');
const nestControllerFile = require('../files/nest-rest/nest-controller');
const nestServiceFile = require('../files/nest-rest/nest-service');
const nestEntityFile = require('../files/nest-rest/nest-entity');
const nestInputFile = require('../files/nest-rest/nest-input');

/* GET home page. */
router.get('/', function (req, res, next) {
  try {
    const dir = 'D:/nest-test-project/test';
    const files = fs.readdirSync(dir);
    for (const file of files) {
      console.log(file);
    }
    res.send({ message: 'ok' });
  } catch (error) {
    throw error;
  }
});
async function PascalCase(str) {
  try {
    if (str.indexOf(' ') >= 0) {
      return UpperPascalCase(str, ' ');
    } else if (str.indexOf('_') >= 0) {
      return UpperPascalCase(str, '_');
    } else {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  } catch (error) {
    throw error;
  }
}
async function UpperPascalCase(str) {
  try {
    let x = str
      .toLowerCase()
      .split('_')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('');
    return x.charAt(0).toUpperCase() + x.slice(1);
  } catch (error) {
    throw error;
  }
}
async function LowerPascalCase(str) {
  try {
    let x = str
      .toLowerCase()
      .split('_')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('');
    return x.charAt(0).toLowerCase() + x.slice(1);
  } catch (error) {
    throw error;
  }
}
async function manyToOne(str) {
  try {
    console.log(str);
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
}
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
async function generateEntityFunc(OriginalName) {
  try {
    let tableArr = [];
    // let query = `select column_name, data_type,udt_name from INFORMATION_SCHEMA.COLUMNS where table_name = '${OriginalName}'`;
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
                      kcu.table_name = '${OriginalName}') as te on c.column_name = te.column_name
                    where table_name = '${OriginalName}'`;
    let result = await pool.query(query);
    if (result) {
      for (let item of result.rows) {
        let firstLowerName = await LowerPascalCase(item.column_name);
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
            let lowerManyToOneKey = await LowerPascalCase(manyToOneName);
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
    throw error;
  }
}
async function generateInputFunc(OriginalName) {
  try {
    let tableArr = [];
    // let query = `select column_name, data_type,udt_name from INFORMATION_SCHEMA.COLUMNS where table_name = '${OriginalName}'`;
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
      kcu.table_name = '${OriginalName}') as te on c.column_name = te.column_name
    where table_name = '${OriginalName}'`;

    let result = await pool.query(query);
    if (result) {
      for (let item of result.rows) {
        let firstLowerName = await LowerPascalCase(item.column_name);
        let dataTypeConverter = await data_type_converter(item.udt_name);
        let inputSwaggerGen = '';
        if (item.constraint_type == 'FOREIGN KEY') {
          let PascalCaseName = await manyToOne(item.constraint_name);
          let lowerManyToOneKey = await LowerPascalCase(PascalCaseName);
          inputSwaggerGen = `@ApiProperty({ type: ${PascalCaseName}Input })
    ${lowerManyToOneKey}: ${PascalCaseName}Input`;
        } else {
          inputSwaggerGen = `@ApiProperty({ required: false })
  ${firstLowerName}:${dataTypeConverter}`;
        }

        tableArr.push(inputSwaggerGen);
      }
    } else {
      tableArr.push('');
      console.log('No data');
    }
    return tableArr.join('\n');
  } catch (e) {
    throw e;
  }
}

router.post('/generate', async (req, res, next) => {
  try {
    await validate(req.body);
    let reqBodyArr = [];
    for (let i = 0; i < req.body.path.length; i++) {
      let reqObj = {
        path: req.body.path[i],
        tableName: req.body.tableName[i],
        module: req.body.module[i],
        controller: req.body.controller[i],
        service: req.body.service[i],
        entity: req.body.entity[i],
        inputFile: req.body.inputFile[i],
      };
      reqBodyArr.push(reqObj);
    }
    for (let item of reqBodyArr) {
      // File Names
      let OriginalName = item.tableName;
      let fileName = OriginalName.replace(/[^a-zA-Z0-9]/g, '-');
      var camelCaseName = await PascalCase(OriginalName);
      // Path
      const main_path = item.path + '/' + fileName + '/';
      const sub_path = main_path + '' + fileName;
      // Module File
      if (item.module == 'true') {
        const mainFolderPath = await makeDir(main_path);
        const module = await fs.createWriteStream(mainFolderPath + '/' + fileName + '.module.ts');
        await module.write(await nestModuleFile(fileName, camelCaseName));
      }
      // Controller File
      if (item.controller == 'true') {
        const folderPath = await makeDir(sub_path);
        const controller = await fs.createWriteStream(folderPath + '/' + fileName + '.controller.ts');
        await controller.write(await nestControllerFile(fileName, camelCaseName));
      }
      // Service File
      if (item.service == 'true') {
        const folderPath = await makeDir(sub_path);
        const service = await fs.createWriteStream(folderPath + '/' + fileName + '.service.ts');
        await service.write(await nestServiceFile(fileName, camelCaseName));
      }
      // Entity File
      if (item.entity == 'true') {
        const folderPath = await makeDir(sub_path);
        const entity = await fs.createWriteStream(folderPath + '/' + fileName + '.entity.ts');
        const generateEntity = await generateEntityFunc(OriginalName);
        await entity.write(await nestEntityFile(OriginalName, generateEntity, camelCaseName));
      }
      // Input File
      if (item.inputFile == 'true') {
        const folderPath = await makeDir(sub_path);
        const input = await fs.createWriteStream(folderPath + '/' + fileName + '.input.ts');
        const generateInput = await generateInputFunc(OriginalName);
        await input.write(await nestInputFile(generateInput, camelCaseName));
      }
    }
    res.redirect('/');
  } catch (error) {
    res.render('error', { error: 'Table folder already existed' });
  }
});
async function validate(data) {
  for (let i = 0; i < data.path.length; i++) {
    const dir = data.path[i];
    let fileName = data.tableName[i].toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    let mainPath = await makeDir(dir);
    const files = fs.readdirSync(dir);
    if (files.includes(fileName)) {
      throw error;
    }
  }
}
module.exports = router;
