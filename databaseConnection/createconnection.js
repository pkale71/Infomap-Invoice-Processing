const mysql = require('mysql');
let obj = 
{
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.MYSQL_DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  // connectTimeout: 2147483647,
  // connectionLimit: 500000,
  // acquireTimeout  : 2147483647,
  // timeout         : 2147483647,
} 
const pool = mysql.createPool(obj);
// pool.acquireConnection(50000000,(err,conn)=>{
//   console.log(err)
//   console.log(conn)
// })
//  console.log(pool)
// return 
module.exports = pool