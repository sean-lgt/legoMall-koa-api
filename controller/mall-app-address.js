
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const addressModel = require('../models/mall-app-address')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const md5 = require('js-md5'); // 密码加密

module.exports = {
    /**
     * @description: 新增收货地址
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async addAddress(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        let { userName,userPhone,defaultFlag,provinceName,cityName,regionName,detailAddress} = ctx.request.body;
        const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await addressModel.addAddress(user_id,userName,userPhone,defaultFlag,provinceName,cityName,regionName,detailAddress,createTime,updateTime)
        if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'新增成功'
            }
        }else{
            throw new InvalidQueryError('新增失败',"9999eee")
        }
        next();
    },
    /**
     * @description: 获取地址列表数据
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getAddressList(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        let data = await addressModel.getAddressList(user_id);
        ctx.result = data;
        next();
    },
    async getDefaultAddress(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        let data = await addressModel.getDefaultAddress(user_id);
        ctx.result = data;
        next();
    },
     /**
      * @description: 获取地址详情
      * @return {*}
      * @param {*} ctx
      * @param {*} next
      */    
     async getAddressDetail(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        const { addressId } = ctx.params;
        let data = await addressModel.getAddressDetail(user_id,addressId);
        ctx.result = data;
        next();
    },
    /**
     * @description: 修改地址信息
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateAddress(ctx,next){
        const {login_name,user_id} = ctx.jwtData;; //拿到解密信息
        // const { addressId } = ctx.params;
        let { addressId,userName,userPhone,defaultFlag,provinceName,cityName,regionName,detailAddress} = ctx.request.body;
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await addressModel.updateAddress(addressId,userName,userPhone,defaultFlag,provinceName,cityName,regionName,detailAddress,updateTime)
       if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'修改成功'
            }
        }else{
            throw new InvalidQueryError('修改地址信息失败',"9999eee")
        }
        next();
    }

}