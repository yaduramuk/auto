var express = require('express');
var router = express.Router();
const { dev, qa, pre } = require('../config');

router.get('/', async (req, res, next) => {
  try {
    let query = `SELECT tablename
        FROM pg_catalog.pg_tables
        WHERE schemaname != 'pg_catalog' AND
        schemaname != 'information_schema' order by tablename `;
    let result = await dev.query(query);
    res.render('database_table', {
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/tables', async (req, res, next) => {
  try {
    console.log(req.body);
    let id = req.body.value;
    let data1 = await queryLoader(dev, id);
    let data2 = await queryLoader(qa, id);
    let data3 = await queryLoader(pre, id);

    var uniqueResultOne = await data2?.rows.filter(function (obj) {
      let finalData = !data1.rows.some(function (obj2) {
        if (
          obj.column_name == obj2.column_name &&
          obj.character_maximum_length == obj2.character_maximum_length &&
          obj.constraint_name == obj2.constraint_name
        ) {
          return obj2;
        }
      });
      return finalData;
    });
    var uniqueResultTwo = await data3?.rows.filter(function (obj) {
      return !data2.rows.some(function (obj2) {
        if (
          obj.column_name == obj2.column_name &&
          obj.character_maximum_length == obj2.character_maximum_length &&
          obj.constraint_name == obj2.constraint_name
        ) {
          return obj2;
        }
      });
    });
    res.send({
      result1: data1.rows,
      result2: uniqueResultOne ? uniqueResultOne : [],
      result3: uniqueResultTwo ? uniqueResultTwo : [],
    });
  } catch (error) {
    console.log(error);
  }
});

const queryLoader = async (tb, tableName) => {
  try {
    let query = `select c.column_name, c.is_nullable, c.data_type, c.udt_name,c.character_maximum_length, te.constraint_name, te.constraint_type
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
    let result = await tb.query(query);
    return result ? result : [];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = router;
