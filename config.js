const { Pool } = require('pg');
const client = {
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
  logging: true,
  synchronize: false,
};
const connectionString = `postgresql://${client.user}:${client.password}@${client.host}:${client.port}/${client.database}`;
const pool = new Pool({
  connectionString: connectionString,
});


module.exports = { pool};
