
//  获取用户信息 ctx.jwtData
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const user = require('../models/user')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
module.exports = {
    /**
     * @description: 获取测试jwt验证
     * @return {*}
     * @param {*} ctx
     */
    async test(ctx,next){
        console.log("拿到token解密信息",ctx.jwtData)
        // let data = await user.login(name);
        ctx.result =ctx.jwtData
        next()
    },

}