
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const indexConfigModel = require('../models/mall-admin-indexConfig')

module.exports = {
    /**
     * @description: 获取商品分类
     * @return {*}
     * @param {*} ctx
     */
    async getHotConfig(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取用户参数
        const {pageNumber,pageSize} =ctx.query;
        let data = await indexConfigModel.getHotGoods(pageNumber,pageSize);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data
        next()
    },
    /**
     * @description: 新增热销商品
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async addHotConfig(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let {configName, configRank,configType,goodsId,redirectUrl} = ctx.request.body;
         const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await indexConfigModel.addHotConfig(admin_user_id,configName, configRank,configType,goodsId,redirectUrl,createTime)
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
     * @description: 修改热销商品配置
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateHotConfig(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let {configId,configName,configRank,configType,goodsId,redirectUrl} = ctx.request.body;
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await indexConfigModel.updateHotConfig(admin_user_id,configId,configName,configRank,configType,goodsId,redirectUrl,updateTime)
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
     * @description: 删除热销商品  数组
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async deleteHotConfig(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let { ids } = ctx.request.body;
        console.log("删除数组",ids)
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await indexConfigModel.deleteHotConfig(admin_user_id,ids,updateTime)
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
     * @description: 获取热销商品详情
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */
    async getHotConfigDetail(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const {configId} = ctx.params;
        const data = await indexConfigModel.getHotConfigDetail(admin_user_id,configId);
        ctx.result = data[0];
        next();
    },

    /**
     * @description: 获取新品上线配置
     * @return {*}
     * @param {*} ctx 上下文
     * @param {*} next
     */    
    async getNewGoodsOnlineConfig(ctx,next){
         const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取用户参数
        const {pageNumber,pageSize} =ctx.query;
        let data = await indexConfigModel.getNewGoodsOnlineConfig(pageNumber,pageSize);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data
        next()
    },
    async addHotConfig(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let {configName, configRank,configType,goodsId,redirectUrl} = ctx.request.body;
         const createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        // const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await indexConfigModel.addHotConfig(admin_user_id,configName, configRank,configType,goodsId,redirectUrl,createTime)
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
     * @description: 修改热销商品配置
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async updateHotConfig(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let {configId,configName,configRank,configType,goodsId,redirectUrl} = ctx.request.body;
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await indexConfigModel.updateHotConfig(admin_user_id,configId,configName,configRank,configType,goodsId,redirectUrl,updateTime)
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
     * @description: 删除热销商品  数组
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async deleteHotConfig(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData; //验证解密信息
        let { ids } = ctx.request.body;
        console.log("删除数组",ids)
        const updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let data = await indexConfigModel.deleteHotConfig(admin_user_id,ids,updateTime)
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
     * @description: 获取热销商品详情
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */
    async getHotConfigDetail(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const {configId} = ctx.params;
        const data = await indexConfigModel.getHotConfigDetail(admin_user_id,configId);
        ctx.result = data[0];
        next();
    },


     /**
      * @description: 为你推荐部分
      * @return {*}
      * @param {*} ctx
      * @param {*} next
      */
     async recommendedForYou(ctx,next){
         const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取用户参数
        const {pageNumber,pageSize} =ctx.query;
        let data = await indexConfigModel.recommendedForYou(pageNumber,pageSize);
        data.list.forEach((item,index)=>{
            item.createTime=moment(item.createTime).format('YYYY-MM-DD HH:mm:ss');
            item.updateTime=moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
        })
        ctx.result = data
        next()
    },
    async addRecommended(ctx,next){
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
    async updateRecommended(ctx,next){
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
    async deleteRecommended(ctx,next){
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
    async getRecommendedDetail(ctx,next){
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        const {carouselId} = ctx.params;
        const data = await carouselModel.getCarouselDetail(admin_user_id,carouselId);
        ctx.result = data[0]
        next()
    },
    

}