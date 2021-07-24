

const mysql = require('mysql');
const { dbConfig } = require('../config/dbConfig')
const { logger } = require('../middlewares/logger')

const pool = mysql.createPool({
  host     : dbConfig.host,   // 数据库地址
  user     : dbConfig.user,    // 数据库用户
  password : dbConfig.password,   // 数据库密码
  database : dbConfig.database  // 选中数据库
})
const sqlQuery = function (sql,values) {
    return new Promise((resolve,reject)=>{
        pool.getConnection(function (err,connection) {
            if(err){
                logger.info("[数据库连接失败]",err)
                reject( err )
            }else{
                connection.query(sql, values, ( err, rows) => {
                     if ( err ) {
                        logger.info("[数据库查询失败]",err)
                        reject( err )
                     } else {
                        resolve( rows )
                     }
                     connection.release()
                }) 
            }
        })
    })
}
module.exports = { sqlQuery }