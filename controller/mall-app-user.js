

const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const userModel = require('../models/mall-app-user')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const md5 = require('js-md5'); // 密码加密
module.exports = {
    /**
     * @description: 用户注册功能
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */
    async register(ctx,next){
        const time = moment().format('YYYY-MM-DD HH:mm:ss');
        let { loginName, password } = ctx.request.body;
        //判断loginName是否是手机号 
        const phoneReg=/^1[3|4|5|7|8][0-9]\d{8}$/;
        if(!phoneReg.test(loginName)) {
            throw new InvalidQueryError('请填写正确的手机号',"9999eea")
            return;
        }
        const psdMd5 = md5(password)
        let data = await userModel.register(loginName,psdMd5,time);
        if(data == 'alreadyExists'){
            throw new InvalidQueryError('该手机号码已被注册过',"9999eee")
        }
        if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'注册成功'
            }
        }else{
            throw new InvalidQueryError('注册失败，请稍后重试',"9999eee")
        }
        next();
    },
    /**
     * @description: 用户登录功能
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async login(ctx,next){
        let { loginName, passwordMd5 } = ctx.request.body;
        let data = await userModel.login(loginName);
        //  console.log("password",md5(password))
        if(data.length != 0){
            //用户存在 校验密码 正确则生成token
            if(data[0].password_md5 === passwordMd5){
                //验证成功,生成token 还需将token 存进数据库
                 const token = jwt.sign({
                      login_name:data[0].login_name,
                      user_id: data[0].user_id
                 },  config.secret, { expiresIn: '2h' })
                //需要更新token到数据库
                const timeStamp=new Date().getTime();
                const currentTime = moment(timeStamp).format('YYYY-MM-DD HH:mm:ss')
                const lastTime = moment(timeStamp + 1000 * 60 * 60 * 2).format('YYYY-MM-DD HH:mm:ss');//2个小时
                let tokenData = await userModel.addUserToken(data[0].user_id,token,currentTime,lastTime);
                ctx.result = {
                    key:token
                }
            }else{
                throw new InvalidQueryError('用户名或密码错误',"994e")
            }
        }else{
            //数据库查询不到数据
             throw new InvalidQueryError('用户名或密码错误',"994e")
        }
        next()
    },

     // 获取用户信息
    async getUserInfo(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        console.log("用户解密信息",ctx.jwtData)
        let data = await userModel.getUserInfo(user_id)
        ctx.result=data[0];
        next()
    },
    /**
     * @description: 修改用户信息 昵称、个性签名、修改密码
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateUserInfo(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        let {introduceSign,nickName} = ctx.request.body;
        const password = ctx.request.body.password || '';
        const passwordMd5 = password !== ''?md5(password):'';
        let data = await userModel.updateUserInfo(user_id,introduceSign,nickName,passwordMd5);
        if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'修改成功'
            }
        }else{
            throw new InvalidQueryError('修改信息失败',"9999eee")
        }
        next();
    },
    /**
     * @description: 用户登录操作
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */
    async userLogout(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        let data = await userModel.userLogout(user_id,time);
         if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'退出成功'
            }
        }else{
            throw new InvalidQueryError('退出失败',"9999eee")
        }
        next();
    }

    
}