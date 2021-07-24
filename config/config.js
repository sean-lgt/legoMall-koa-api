
const path = require('path');
const moment = require('moment');

// 获取当前日期
//  const nowMonth = moment().format('YYYY-MM');
//  const nowTime = moment().format('YYYY-MM-DD');
// const nowTime = moment().format('YYYY-MM-DD');
// // `../logs/${nowMonth}/serve-${nowTime}.log`
module.exports = {
  port: '3001',
  secret: 'secret',//jwt加密secret
  publicDir: path.resolve(__dirname, '../public'),
  logPath:  path.resolve(__dirname, `../logs`)
}