
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const moduleManagement = require('../models/mall-admin-moduleManagement')

module.exports = {
    /**
     * @description: 获取分类管理内容列表
     * @return {*}
     * @param {*} ctx
     */
    async getCategoriesModule(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取用户参数
        const {pageNumber,pageSize,parentId,categoryLevel} =ctx.query;
        let data = await moduleManagement.getCategoriesModule(pageNumber,pageSize,parentId,categoryLevel);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data
        next()
    },
    /**
     * @description: 获取分类详细信息
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getCategoryDetail(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const {categoryId } = ctx.params;
        const data = await moduleManagement.getCategoryDetail(admin_user_id,categoryId);
        ctx.result = data[0];
        next();
    },
    /**
     * @description: 修改分类管理数据
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateCategoriesById(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const {id} = ctx.params;
        let { categoryName, categoryRank } = ctx.request.body;
        console.log("put数据",{categoryName,categoryRank})
        const data = await moduleManagement.updateCategoriesById(id,categoryName,categoryRank);
        if(data&&data.affectedRows !== 1){
            //失败
            throw new InvalidQueryError('更新失败',"995e")
        }else{
             ctx.result={
                sucessMsg:'更新成功'
            }
        }
        // ctx.result = data
        next();
    },
    /**
     * @description: 新增商品分类
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async addCategory(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const { parentId,categoryLevel,categoryRank,categoryName } = ctx.request.body;
         const data = await moduleManagement.addCategory(parentId,categoryLevel,categoryRank,categoryName);
         if(data == 'alreadyExists'){
             throw new InvalidQueryError('新增失败,该分类名称已经存在',"996e")
         }else if(data&&data.affectedRows !== 1){
            //失败
            throw new InvalidQueryError('新增失败',"995e")
        }else{
             ctx.result={
                sucessMsg:'新增成功'
            }
        }
        // ctx.result = data
        next();
    },
    /**
     * @description: 删除分类管理
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async deleteCategory(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let { ids } = ctx.request.body;
        console.log("删除数组",ids)
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await moduleManagement.deleteCategory(admin_user_id,ids,updateTime)
        console.log("删除数据",data)
        if(data&&data.affectedRows){
              ctx.result={
                  sucessMsg:'删除成功'
              }
          }else{
              throw new InvalidQueryError('删除失败，请稍后重试',"994a")
        }
        next();
    },
    /**
     * @description: 批量删除分类管理
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async batchDeleteCategory(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const { categoryIdList } = ctx.request.body;
        const data = await moduleManagement.batchDeleteCategory(categoryIdList);
        if(!data.sucess){
            //删除失败的内容
            throw new InvalidQueryError(data.errList+'删除失败',"995e")
        }else{
            // 删除成功
            ctx.result={
                sucessMsg:'删除成功'
            }
        }
        next();
    },
    /**
     * @description: 获取商品列表
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getGoodsList(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取用户参数
        const {pageNumber,pageSize} =ctx.query;
        let data = await moduleManagement.getGoodsList(pageNumber,pageSize);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data
        next()
    },
    /**
     * @description: 获取用户列表数据
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getUserList(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取用户参数
        const {pageNumber,pageSize} =ctx.query;
        let data = await moduleManagement.getUserList(pageNumber,pageSize);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data
        next()
    },
    /**
     * @description: 修改用户信息
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateUser(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const {type} = ctx.params;
        let { ids } = ctx.request.body;
        let data = ''
        if(type == 1){
            //解除禁用
             data = await moduleManagement.updateUser('Dismiss',ids);
        }else{
            // 禁用
            data = await moduleManagement.updateUser('Disable',ids);
        }

        console.log("解除原因",data)

        if(!data || !data.affectedRows){
            msg = type == 1?'禁用失败':'解除失败'
            throw new InvalidQueryError(msg,"995e")
        }
       
            // 删除成功
        ctx.result={
                sucessMsg: type == 1?'禁用成功':'解除成功'
        }
        next();
    },

    /**
     * @description: 获取订单信息列表 
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getOrdersList(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const pageNumber = ctx.query.pageNumber;
        const pageSize = ctx.query.pageSize;
        const orderNo = ctx.query.orderNo || null;
        const orderStatus = ctx.query.orderStatus || null;
        console.log("查询参数",{pageNumber,pageSize,orderNo,orderStatus})
        let data = await moduleManagement.getOrdersList(pageNumber,pageSize,orderNo,orderStatus);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data;
        next();
    },
    /**
     * @description: 关闭订单内容
     * @return {*}
     * @param {*} ctx 
     * @param {*} next
     */    
    async closeOrders(ctx,next){
         const {admin_user_name,admin_user_id} = ctx.jwtData;
         const { ids } = ctx.request.body;
         let data = await moduleManagement.closeOrders(ids);
        if(!data){
            //删除失败的内容
            throw new InvalidQueryError('关闭失败',"995e")
        }else{
            // 删除成功
            ctx.result={
                sucessMsg:'关闭成功'
            }
        }
        next();
    },
     /**
      * @description: 配合完成
      * @return {*}
      * @param {*} ctx
      * @param {*} next
      */    
     async checkDoneOrders(ctx,next){
         const {admin_user_name,admin_user_id} = ctx.jwtData;
         const { ids } = ctx.request.body;
         let data = await moduleManagement.checkDoneOrders(ids);
        if(!data){
            throw new InvalidQueryError('配货失败',"995e")
        }else{
            // 删除成功
            ctx.result={
                sucessMsg:'配货完成'
            }
        }
        next();
    },
    /**
     * @description: 出货完成
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async checkOutOrders(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const { ids } = ctx.request.body;
        let data = await moduleManagement.checkOutOrders(ids);
        if(!data){
            throw new InvalidQueryError('出库失败',"995e")
        }else{
            // 删除成功
            ctx.result={
                sucessMsg:'出库完成'
            }
        }
        next();
    },
    /**
     * @description: 获取订单详细信心
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getOrderDetail(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const { orderId } = ctx.params;
        const  data = await moduleManagement.getOrderDetail(orderId);
        data&&data.createTime?data.createTime=moment(data.createTime).format('YYYY-MM-DD HH:mm:ss'):'';
        data&&data.updateTime?data.updateTime=moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss'):'';
        ctx.result = data;
        next();
    },

    
    
    
}