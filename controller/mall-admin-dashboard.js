
const moment = require('moment');
const { handleError,InvalidQueryError } = require("../utils/error")
const config = require('../config/config')
const jwt = require('jsonwebtoken')

module.exports = {
    /**
     * @description: 获取大盘数据
     * @return {*}
     * @param {*} ctx
     */
    async getDashboard(ctx,next){
        console.log("拿到token解密信息",ctx.jwtData)
        // let data = await user.login(name);
        const {admin_user_name,admin_user_id} = ctx.jwtData;
        //获取当前日期
        let xAxisData = []; //x轴数据，日期，7天
        const currentDateTime = moment().format("YYYY-MM-DD")
        for(let i = 1;i<7;i++){
            const lastTime =  moment().subtract(i, "days").format("YYYY-MM-DD");
            xAxisData.unshift(lastTime)
        }
        xAxisData.push(currentDateTime)
        const seriesData = {};
        seriesData.addRegistered = [120,132,101,134,90,230,210];
        seriesData.payUser = [220,182,191,234,290,330,310];
        seriesData.activeUser =[150,232,201,154,190,330,410];
        seriesData.ordersNum=[320,332,301,334,390,330,320];
        seriesData.incomeCount=[820,932,901,934,1290,1330,1320];
        const todayOrders = 1888; //今日订单
        const todayActive = 410; //今日活跃
        const conversionRate = '20%';//转化率
        const dataJson = {
            xAxisData,
            seriesData,
            todayOrders,
            todayActive,
            conversionRate
        }
        ctx.result =dataJson
        next()
    },

}