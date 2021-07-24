

const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const indexInfoModel = require('../models/mall-app-index')

module.exports = {
    /**
     * @description: 获取首页展示信息
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getIndexInfos(ctx,next){
        // 直接获取数据
        const data = await indexInfoModel.getIndexInfo();
        ctx.result = data;
        next();
    },
    /**
     * @description: 获取商品分类信息
     * @return {*}
     * @param {*} ctx
     * @param {*} next
     */    
    async getCategories(ctx,next){
        const data = await indexInfoModel.getCategories();
        ctx.result = data;
        next();
    }
};