
 const fs = require('fs')
 const path = require('path')
 const log4js = require('log4js')
 const config = require('../config/config');
 const moment = require('moment');
// 判断是否有 logs 目录，没有就新建，用于存放日志
//  const logPath =  path.resolve(__dirname, './logs/koa-template.log'),
//  也可以写在配置文件中
// const logsDir = path.parse(config.logPath).dir;
// if(!fs.existsSync(logsDir)){
//     fs.mkdirSync(logsDir)
// }
// console.log("根目录",config.logPath)
//配置log4.js
log4js.configure({
    appenders:{
        console:{type:'console'},
        // dateFile:{type:'dateFile',filename:config.logPath,pattern:'-YYYY-MM-DD HH:MM:SS'}
        dateFile:{
           type: 'dateFile',
           filename: config.logPath+'/serve',
           pattern: '-yyyy-MM-dd.log',
           alwaysIncludePattern: true,
           encoding: 'utf-8',
           maxLogSize: 10485760,//10MB
           numBackups: 1,
           path: config.logPath,
           layout: {
             type: 'basic'
           }
        }
    },
    categories:{
        default: {
          appenders: ['console', 'dateFile'],
          level: 'info'
        }
    }
})

const logger = log4js.getLogger('[Default]')
// logger 中间件
const loggerMiddleware = async (ctx,next)=>{
//   let nowMonthLog = moment().format('YYYY-MM-DD');
//   if(nowMonthLog != nowMonth){
//       //重新加载配置
//       console.log("需要重新加载配置")
//   }
    // 请求开始时间
  const start = new Date()
  await next()
  // 结束时间
  const ms = new Date() - start
    // 打印出请求相关参数
  const remoteAddress = ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
  let logText = `${ctx.method} ${ctx.status} ${ctx.url} 请求参数： ${JSON.stringify(ctx.request.body)} 响应参数： ${JSON.stringify(ctx.body)} - ${remoteAddress} - ${ms}ms`
  logger.info(logText)
}

module.exports = {
  logger,
  loggerMiddleware
}