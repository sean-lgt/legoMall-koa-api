
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const appOrderModel = require('../models/mall-app-order')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const md5 = require('js-md5'); // 密码加密

module.exports = {
    /**
     * @description: 创建订单 - 根据内容生成订单编号
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */   
    async createOrder(ctx,next){
         const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
         const {cartItemIds,addressId}=ctx.request.body;
         let orderCode='';
         for (var i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
         {
           orderCode += Math.floor(Math.random() * 10);
         }
         orderCode = new Date().getTime() + orderCode;  //时间戳，用来生成订单号。
         //创建订单
         const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
         let data = await appOrderModel.createOrder(user_id,orderCode,cartItemIds,createTime,addressId);
         if(data == 'alreadyExists'){
             // 已经存在相同的订单号 重新请求-重新生成订单号
            //  this.createOrder(); //无法递归调用
            throw new InvalidQueryError('生成订单号失败,请重试',"9999eee")
         }
        if(data&&data.affectedRows){
            ctx.result=orderCode;
        }else{
            throw new InvalidQueryError('生成订单号失败',"9999eee")
        }
        next();
    },
    /**
     * @description: 订单支付
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async payForOrder(ctx,next){
         const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
         // 订单编号与支付类型
         let { orderNo,payType} = ctx.request.body;
         const payTime = moment().format('YYYY-MM-DD HH:mm:ss');
         let data = await appOrderModel.payForOrder(orderNo,payType,payTime)
         if(data&&data.affectedRows){
              ctx.result={
                  sucessMsg:'支付成功'
              }
          }else{
              throw new InvalidQueryError('支付失败，请稍后重试',"9999eee")
          }
          next();
    },
    /**
     * @description: 取消订单 关闭订单
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async closeOrder(ctx,next){
        // orderNo,updateTime
         const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
         // 订单编号与支付类型
         let { orderNo } = ctx.request.body;
         const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
         let data = await appOrderModel.closeOrder(orderNo,updateTime)
         if(data&&data.affectedRows){
              ctx.result={
                  sucessMsg:'取消成功'
              }
          }else{
              throw new InvalidQueryError('取消失败，请稍后重试',"9999eee")
          }
          next();
    },
    /**
     * @description: 获取订单列表
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getOrderList(ctx,next){
        // order_status 订单状态:0.待支付 1.已支付 2.配货完成 3:出库成功 4.交易成功 -1.手动关闭 -2.超时关闭 -3.商家关闭
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        const {pageNumber,pageSize} =ctx.query;
        let orderStatus = null
        if(ctx.query && ctx.query.status !== '' && ctx.query.status == 0){
            orderStatus = 0
        }else if(ctx.query && ctx.query.status){
            orderStatus = ctx.query.status
        }
        let data = await appOrderModel.getOrderList(user_id,pageNumber,pageSize,orderStatus);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            // item&item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data;
        next();
    },
    /**
     * @description: 获取订单详情
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getOrderDetail(ctx,next){
         const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
         const { orderNo } = ctx.params;
         let data = await appOrderModel.getOrderDetail(user_id,orderNo); 
        if(data&&data.length == 1){
            data[0].createTime=moment(data[0].createTime).format('YYYY-MM-DD HH:mm:ss');
             ctx.result=data[0];
         }else{
             throw new InvalidQueryError('获取商品信息失败',"9999eee")
         }
         next();
    }


}

