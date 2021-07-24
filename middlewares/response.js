
// 基础的koa模板中，我们可以用 ctx.body进行返回前端，但是发现有些东西经常重复写，还不如提出来进行封装，而且还不用担心返回的格式会不一致

// 引入日志打印插件
const { logger } = require('./logger')

// 这个 这个middleware用于将ctx.result中的内容最终回传给客户端
const responseHandler = (ctx) =>{
    if(ctx.result !== undefined){
        ctx.type = 'json'
        ctx.body = {
            resultCode:200,
            errMessage:JSON.stringify(ctx.msg) || '',
            data:ctx.result
        }
    }
}

//这个middleware处理在其它middleware中出现的异常,我们在next()后面进行异常捕获，出现异常直接进入这个中间件进行处理

// throw 只要过程中有抛出错误，就能被这个中间件捕获
const errorHandler = (ctx,next)=>{
   return next().catch(err => {
    if (err.code == null) {
      logger.error(err.stack)
    }
    
    ctx.body = {
      resultCode: err.code || -1,
      data: null,
      errMessage: err.message
    }
    // 保证返回状态是 200
    ctx.status = 200 
    return Promise.resolve()
  })
}

module.exports = {
  responseHandler,
  errorHandler
}

// responseHandler正确响应，我们在业务中，只需要对ctx.result进行写入即可。这个中间件可以放在所有中间件的最后面，这样可以保证前面中间件都需要经过它，再返回前端。errorHandler错误响应，这个主要是用来进行出错或者异常的捕获，可以返回响应给前端，要不前端会出现一直padding的状态直到超时。