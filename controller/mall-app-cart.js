
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const shopCartModel = require('../models/mall-app-cart')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const md5 = require('js-md5'); // 密码加密

module.exports = {
    /**
     * @description: 添加到购物车
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async addShopCart(ctx,next){
         const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
         const { goodsCount,goodsId } = ctx.request.body; //拿到post参数
         const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        //  const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
         let data = await shopCartModel.addShopCart(user_id,goodsCount,goodsId,createTime);
         if(data == 'alreadyExists'){
            throw new InvalidQueryError('已经添加过该商品到购物车了',"9999eee")
         }
         if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'添加成功'
            }
        }else{
            throw new InvalidQueryError('添加失败',"9999eee")
        }
        next();
    },
    /**
     * @description: 更改购物车数量
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateCart(ctx,next){
         const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
         const { goodsCount,cartItemId } = ctx.request.body; //拿到post参数
         const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
         let data = await shopCartModel.updateCart(user_id,goodsCount,cartItemId,updateTime);
          if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'更改成功'
            }
        }else{
            throw new InvalidQueryError('更改失败',"9999eee")
        }
        next();
    },
    /**
     * @description: 删除购物车
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async deleteCart(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
         const { cartItemId } = ctx.params; //拿到params参数
         const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
         let data = await shopCartModel.deleteCart(user_id,cartItemId,updateTime);
          if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'更改成功'
            }
        }else{
            throw new InvalidQueryError('更改失败',"9999eee")
        }
        next();
    },

    /**
     * @description: 获取用户购物车列表，分页显示
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getShopCartList(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        //获取分页参数
        const {pageNumber,pageSize} =ctx.query; 
        let data = await shopCartModel.getShopCartList(user_id,pageNumber,pageSize);
        // data.list.forEach((item,index)=>{
        //     item&item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        //     item&item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        // })
        ctx.result = data;
        next();
    },

    async preOrderSelectCartItem(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        const { cartItemIds } = ctx.query;
        let data = await shopCartModel.preOrderSelectCartItem(user_id,cartItemIds);
        ctx.result = data;
        next();
    }
}