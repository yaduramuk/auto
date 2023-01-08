var express = require('express');
var router = express.Router();
const { dev, qa, pre } = require('../config');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let tquery = `SELECT tablename
        FROM pg_catalog.pg_tables
        WHERE schemaname != 'pg_catalog' AND
        schemaname != 'information_schema' order by tablename `;
    let result1 = await dev.query(tquery);
    let result2 = await qa.query(tquery);
    let result3 = await pre.query(tquery);

    const results1 = await result1.rows.filter(
      ({ tablename: id1 }) => !result2.rows.some(({ tablename: id2 }) => id2 === id1),
    );
    const results2 = await result2.rows.filter(
      ({ tablename: id1 }) => !result3.rows.some(({ tablename: id2 }) => id2 === id1),
    );
    res.render('database', {
      result1: result1,
      result2: results1,
      result3: results2,
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
