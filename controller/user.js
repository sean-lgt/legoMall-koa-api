
//  const { InvalidQueryError } = require('../lib/error')
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const user = require('../models/user')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
module.exports = {
    /**
     * @description: 获取所有用户数据操作
     * @return {*}
     * @param {*} ctx
     */
    async getALLUser(ctx,next){
        // console.log("请求参数",ctx)
        let userList = await user.getAllUser()
        if(userList.length !== 0){
           let list = userList.map((item,index)=>{
               item.create_date =moment(item.create_date).format('YYYY-MM-DD HH:mm:ss');
               return item
           })
           ctx.result=list;
        }else{
            throw new InvalidQueryError('获取用户数据失败',"9999eee")
        }
        next()
        // return result
    },
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
        let { name, password } = ctx.request.body;
        let data = await user.login(name);
        if(data.length != 0){
            //用户存在 校验密码 正确则生成token
            if(data[0].user_password === password){
                //验证成功
                 const token = jwt.sign({
                      user_name:data[0].user_name,
                      user_id: data[0].user_id
                 },  config.secret, { expiresIn: '2h' })

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
        console.log("用户登录信息",data)
        console.log("用户的密码",password)
        //同时需要生成token返回
        
        next()
    }

    
}