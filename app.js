
// 项目入口文件
const Koa = require('koa');
const path = require('path');
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const Moment = require("moment")
const cors = require('koa2-cors')
const router = require('koa-router')() //引入路由模块
const helmet = require("koa-helmet") //安全问题
const { loggerMiddleware,logger } = require('./middlewares/logger')
const { errorHandler, responseHandler } = require('./middlewares/response')
const publicRouter = require('./routers/public/index')
const privateRouter = require('./routers/private/index')

const koaBady = require('koa-body');

// // 使用日志中间件
// const logger = koaLogger((str) => {    
//  console.log(Moment().format('YYYY-MM-DD HH:MM:SS')+str);
// }); 
// 配置控制台日志中间件
// app.use(logger)
const app = new Koa(); 
app.use(static(path.join(__dirname,'public')));
app.use(koaBady({
    multipart:true, //支持文件上传
    strict:false,//设为false strict 参数:如果启用，则不解析GET，HEAD，DELETE请求，默认为true
    formidable:{
        maxFieldsSize:5*1024*1024, //最大为5
        multipart:true, 
        
    }
}))
app.use(loggerMiddleware)
app.use(errorHandler)
// app.use(bodyParser())
app.use(cors())
app.use(helmet())

publicRouter(app)
privateRouter(app)
// 中间件response
app.use(responseHandler)
//初始化路由组件
// 配置静态资源服务 需在router后面，否则会冲突
// 静态资源目录对于相对入口文件index.js的路径 
// const staticPath = './public';

// app.use(static(
//   path.join( __dirname,  staticPath)
// ))
app.listen(4002,() => {
  console.log('【node-server】 is listen in 4002');
});