const mysql = require('mysql2')

const pool = mysql.createPool({
  host: '147.139.29.109',
  user: 'user1',
  password:'knowit24564',
  database: 'projectdb1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = pool