
 const config = require('../config/config')
 const { logger } = require('./logger')
 const koaJwt = require('koa-jwt')
 const jwt = require('jsonwebtoken')
 const jwtMiddleware = koaJwt({secret:config.secret})

 module.exports =async function (ctx,next){
     //将 token 中的数据解密后存到 ctx 中
     try{
        //  console.log("前端校验")
         if(typeof ctx.request.headers.authorization === 'string'){

             const token = ctx.request.headers.authorization.slice(7)
             console.log("前端校验token",token)
            //token 前有bear Bearer 
            ctx.jwtData = jwt.verify(token,config.secret)
         }else{
             throw {code:401,message:'非法操作'}
         }
     }catch(err){
         throw {code: 401, message: "登录失效"}
     }
     await next();
 }
