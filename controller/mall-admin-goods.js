
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const adminGoodsModel = require('../models/mall-admin-goods')

module.exports = {
    /**
     * @description: 添加商品
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async addGoodsInfo(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;//拿到解密信息
        let {goodsCategoryId,goodsCoverImg,goodsDetailContent, goodsIntro,goodsName,goodsSellStatus,originalPrice,sellingPrice,stockNum,tag} = ctx.request.body;
        const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await adminGoodsModel.addGoodsInfo(admin_user_id,goodsCategoryId,goodsCoverImg,goodsDetailContent, goodsIntro,goodsName,goodsSellStatus,originalPrice,sellingPrice,stockNum,tag,createTime)
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
     * @description: 更新商品数据信息
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateGoodsInfo(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;//拿到解密信息
        let {goodsCategoryId,goodsCoverImg,goodsDetailContent, goodsIntro,goodsName,goodsSellStatus,originalPrice,sellingPrice,stockNum,tag,goodsId} = ctx.request.body;
        const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await adminGoodsModel.updateGoodsInfo(admin_user_id,goodsCategoryId,goodsCoverImg,goodsDetailContent, goodsIntro,goodsName,goodsSellStatus,originalPrice,sellingPrice,stockNum,tag,goodsId,createTime)
        if(data&&data.affectedRows){
            ctx.result={
                sucessMsg:'修改成功'
            }
        }else{
            throw new InvalidQueryError('修改失败',"9999eee")
        }
        next();
    },
    /**
     * @description: 
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getGoodsDetail(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const {goodId} = ctx.params;
        const data = await adminGoodsModel.getGoodsDetail(admin_user_id,goodId);
        ctx.result = data;
        next();
    }
}