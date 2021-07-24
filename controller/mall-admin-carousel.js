
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const carouselModel = require('../models/mall-admin-carousel')

module.exports = {
    /**
     * @description: 获取商品分类
     * @return {*}
     * @param {*} ctx
     */
    async getCategories(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取用户参数
        const {pageNumber,pageSize} =ctx.query;
        let data = await carouselModel.getCarouselList(pageNumber,pageSize);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data
        next()
    },

    /**
     * @description: 
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async addCarousel(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let {carouselUrl, redirectUrl,carouselRank} = ctx.request.body;
         const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await carouselModel.addCarousel(admin_user_id,carouselUrl, redirectUrl,carouselRank,createTime)
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
     * @description: 修改轮播图数据
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateCarousel(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let {carouselId,carouselUrl, redirectUrl,carouselRank} = ctx.request.body;
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await carouselModel.updateCarousel(admin_user_id,carouselId,carouselUrl, redirectUrl,carouselRank,updateTime)
        if(data&&data.affectedRows){
              ctx.result={
                  sucessMsg:'修改成功'
              }
          }else{
              throw new InvalidQueryError('修改失败，请稍后重试',"994a")
        }
        next();
    },

    /**
     * @description: 删除轮播图  数组
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async deleteCarousel(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let { ids } = ctx.request.body;
        console.log("删除数组",ids)
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await carouselModel.deleteCarousel(admin_user_id,ids,updateTime)
        if(data&&data.affectedRows){
              ctx.result={
                  sucessMsg:'修改成功'
              }
          }else{
              throw new InvalidQueryError('修改失败，请稍后重试',"994a")
        }
        next();
    },
    /**
     * @description: 
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */
    async getCarouselDetail(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const {carouselId} = ctx.params;
        const data = await carouselModel.getCarouselDetail(admin_user_id,carouselId);
        ctx.result = data[0]
        next()
    }

    

}