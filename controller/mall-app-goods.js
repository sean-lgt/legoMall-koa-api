

const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const goodsModel = require('../models/mall-app-goods')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const md5 = require('js-md5'); // 密码加密

module.exports = {
    /**
     * @description: 获取商品详细信息
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getGoodsDetail(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        const { goodsId } = ctx.params;
        let data = await goodsModel.getGoodsDetail(goodsId); 
        if(data&&data.length == 1){
             ctx.result=data[0];
         }else{
             throw new InvalidQueryError('获取商品信息失败',"9999eee")
         }
         next();
    },
    /**
     * @description: 搜索商品
     * @return {*}
     * @param {*} ctx 
     * @param {*} next
     */    
    async searchGoods(ctx,next){
        // const {login_name,user_id} = ctx.jwtData; //拿到解密信息
        const {pageNumber,pageSize,keyword} =ctx.query;
        const orderBy = ctx.query.orderBy || '';
        let data = await goodsModel.searchGoods(pageNumber,pageSize,keyword,orderBy);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            // item&item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data;
        next();
    }

}

