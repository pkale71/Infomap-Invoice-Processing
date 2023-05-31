const mysql = require('mysql');
let obj = 
{
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.MYSQL_DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
} 
const pool = mysql.createPool(obj);
module.exports = pool