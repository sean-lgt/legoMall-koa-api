
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const categoryModel = require('../models/mall-admin-category')

module.exports = {
    /**
     * @description: 获取商品分类
     * @return {*}
     * @param {*} ctx
     */
    async getCategories(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取用户参数
        const {pageNumber,pageSize,categoryLevel,parentId} =ctx.query;
        // 需要校验参数值是否正确 找参数校验框架 不然每次都得判断
        console.log({pageNumber,pageSize,categoryLevel,parentId})
        let data = await categoryModel.getCategoryList(pageNumber,pageSize,categoryLevel,parentId);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data
        next()
    },

}