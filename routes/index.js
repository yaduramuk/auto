var express = require('express');
var router = express.Router();
const { pool } = require('../config');
var fs = require('fs');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    res.redirect('/nest');
  } catch (error) {
    throw error;
  }
});

router.get('/rest', async function (req, res, next) {
  try {
    const path = 'D:/nest-test-project/test';
    let dirList = await fs.readdirSync(path);
    const query = `SELECT tablename
  FROM pg_catalog.pg_tables
  WHERE schemaname != 'pg_catalog' AND
      schemaname != 'information_schema';`;
    const result = await pool.query(query);
    res.render('file', { dirList, data: result.rows, path });
  } catch (error) {
    throw error;
  }
});

router.get('/nest', async function (req, res, next) {
  try {
    const path = 'D:/nest-test-project/test';
    let dirList = await fs.readdirSync(path);
    const query = `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' order by tablename;`;
    const result = await pool.query(query);
    return res.render('graphql', { dirList, data: result.rows, path });
  } catch (error) {
    throw error;
  }
});

router.post('/getSubDir', async (req, res, next) => {
  try {
    const path = 'D:/nest-test-project/test';
    let subList = await fs.readdirSync(path + '/' + req.body.subDir);
    res.send(subList);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
