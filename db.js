const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'mybike',
  password: 'abhicompmit',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})


module.exports = pool