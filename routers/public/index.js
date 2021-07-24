
const router = require('koa-router')();
const userController = require('../../controller/user')
const mallAdminUserController = require('../../controller/mall-admin-user')
const mallAppIndexController = require('../../controller/mall-app-index')
const mallAppUserController = require('../../controller/mall-app-user')

const mallGoodsController = require('../../controller/mall-app-goods')

const uploadFileController = require('../../controller/upload-file')
module.exports = (app) => {
    // console.log("进来了",app)
    router.get('/api/getUser', userController.getALLUser)
    router.post('/api/addUser', userController.insertUser)
    router.put('/api/updateUser',userController.updateUser)
    router.delete('/api/deleteUser/:id',userController.deleteUser)
    router.post('/api/login', userController.login)

    //商城后台管理模块
    router.post('/v1/api/admin/login',mallAdminUserController.login)

    //商城移动端项目模块
    router.get('/v1/api/app/index-infos',mallAppIndexController.getIndexInfos); //获取首页展示信息
    router.get('/v1/api/app/categories',mallAppIndexController.getCategories); //获取首页商品分类
     router.get('/v1/api/app/search',mallGoodsController.searchGoods); // 搜索商品信息
    router.post('/v1/api/app/user/register',mallAppUserController.register);//移动端用户注册
    router.post('/v1/api/app/user/login',mallAppUserController.login);//移动端用户登录
    //文件上传  图片
    router.post('/v1/api/admin/upload/img',uploadFileController.uploadImg);

    app.use(router.routes()).use(router.allowedMethods())
}