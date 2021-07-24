
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const user = require('../models/mall-admin-user')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const md5 = require('js-md5'); // 密码加密
module.exports = {
    /**
     * @description: 新增用户信息
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */
    async insertUser(ctx,next){
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        console.log("时间",time)
        let { name, password } = ctx.request.body;
        let data = await user.insertUser(name,password,time);
        console.log("新增查询数据",data)
        if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'新增成功'
            }
        }else{
            throw new InvalidQueryError('新增用户信息失败',"9999eee")
        }
        
        next()
    },
    // 修改用户信息
    async updateUser(ctx,next){
        let {user_id,user_name,user_password} = ctx.request.body;
        let data = await user.updateUser(user_id,user_name,user_password);
        if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'修改成功'
            }
        }else{
            throw new InvalidQueryError('修改用户信息失败',"9999eee")
        }
        next();
    },

    //注销用户信息操作
    async deleteUser(ctx,next){
        let {id} = ctx.params;
        console.log("动态路由参数",ctx.params)
        let data = await user.deleteUser(id)
        if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'注销成功'
            }
        }else{
            throw new InvalidQueryError('注销用户信息失败',"9999eee")
        }
        next();
    },

    //用户登录操作
    async login(ctx,next){
        let { userName, passwordMd5 } = ctx.request.body;
        let data = await user.login(userName);
        //  console.log("password",md5(password))

        console.log("登录密码",passwordMd5)
        if(data.length != 0){
            //用户存在 校验密码 正确则生成token
            ctx.result={
                "user":data
            }
            // md5(password)
            if(data[0].login_password == passwordMd5){
                //验证成功,生成token 还需将token 存进数据库
                 const token = jwt.sign({
                      admin_user_name:data[0].login_user_name,
                      admin_user_id: data[0].admin_user_id
                 },  config.secret, { expiresIn: '2h' })
                //需要更新token到数据库
                const timeStamp=new Date().getTime();
                const currentTime = moment(timeStamp).format('YYYY-MM-DD HH:mm:ss')
                const lastTime = moment(timeStamp + 1000 * 60 * 60 * 2).format('YYYY-MM-DD HH:mm:ss');//2个小时
                let tokenData = await user.addUserToken(data[0].admin_user_id,token,currentTime,lastTime);
                // console.log("tokenData",tokenData)
                ctx.result = {
                    key:token
                }
            }else{
                throw new InvalidQueryError('用户名或密码错误',"1001e")
            }
        }else{
            //数据库查询不到数据
             throw new InvalidQueryError('用户名或密码错误',"1001e")
        }
        // console.log("用户登录信息",data)
        // console.log("用户的密码",password)
        //同时需要生成token返回
        next()
    },
    // 获取用户信息
    async getUserInfo(ctx,next){
        console.log("用户解密信息",ctx.jwtData)
        // ctx.result =ctx.jwtData
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        let data = await user.getUserInfo(admin_user_id);
        data[0].loginPassword="***********";
        ctx.result = data[0]
        next()
    },
    /**
     * @description: 用户退出操作
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async userLogout(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //拿到解密信息
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        let data = await user.userLogout(admin_user_id,time);
         if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'退出成功'
            }
        }else{
            throw new InvalidQueryError('退出失败',"9999eee")
        }
        next();
    },
    /**
     * @description: 修改用户昵称及用户名
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateName(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //拿到解密信息
        let { loginUserName, nickName } = ctx.request.body;
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        let data = await user.updateName(admin_user_id,loginUserName, nickName,time);
         if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'修改成功'
            }
        }else{
            throw new InvalidQueryError('修改失败',"995eee")
        }
        next();
    },
    /**
     * @description: 修改密码操作
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updatePassword(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //拿到解密信息
        let { newPassword, originalPassword } = ctx.request.body;
        //需要先判断原来密码是否正确
        let data = await user.getUserInfo(admin_user_id);
        if(data.length != 0){
            console.log("密码",data[0])
            if(data[0].loginPassword == originalPassword){
                let data = await user.updatePassword(admin_user_id,newPassword);
                console.log("data数据",data)
                if(data&&data.affectedRows){
                     ctx.result={
                          sucessMsg:'修改成功'
                     }
                }
            }else{
                throw new InvalidQueryError('原密码错误，请重试',"1001e")
            }
        }
        // ctx.result = data[0]
        next();
    }

    
}