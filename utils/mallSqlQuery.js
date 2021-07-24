
const mysql = require('mysql');
const { mallDBConfig } = require('../config/dbConfig')
const { logger } = require('../middlewares/logger')

const pool = mysql.createPool({
  host     : mallDBConfig.host,   // 数据库地址
  user     : mallDBConfig.user,    // 数据库用户
  password : mallDBConfig.password,   // 数据库密码
  database : mallDBConfig.database  // 选中数据库
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
