const mysql = require('mysql2/promise');

async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PWD,
    database: process.env.DB_DEV_NAME,
});
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}

// we have changed all the other fiel from db.query to this fucking query which didn't work
