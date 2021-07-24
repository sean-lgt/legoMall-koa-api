
const router = require('koa-router')();
const userController = require('../../controller/test')
const jwtMiddleware = require('../../middlewares/jwt')
const mallAdminUserController = require('../../controller/mall-admin-user')
const mallDashBoard = require("../../controller/mall-admin-dashboard")
const categoryController = require('../../controller/mall-admin-category')
const carouselsController = require('../../controller/mall-admin-carousel')
const configController = require('../../controller/mall-admin-indexConfig')
const moduleController = require('../../controller/mall-admin-moduleManagement')
const goodsController = require('../../controller/mall-admin-goods');
const appUserController = require('../../controller/mall-app-user')
const appAddressController = require('../../controller/mall-app-address')
const addGoodsController = require('../../controller/mall-app-goods')
const shopCartController = require('../../controller/mall-app-cart')
const appOrderController = require('../../controller/mall-app-order')
const uploadFileController = require('../../controller/upload-file')
// const mallAdminUserController

module.exports = (app) => {
    router.use(jwtMiddleware)
    // console.log("进来了",app)
    router.get('/api/jwttest', userController.test);

    //商城后台管理系统
    // router.get('',)
    router.get('/v1/api/admin/adminUser/info',mallAdminUserController.getUserInfo); //获取用户数据
    router.post('/v1/api/admin/adminUser/logout',mallAdminUserController.userLogout);//用户退出操作
    router.put('/v1/api/admin/adminUser/updatename',mallAdminUserController.updateName);//用户修改昵称及登录名
    router.post('/v1/api/admin/adminUser/updatepassword',mallAdminUserController.updatePassword);//用户修改密码操作

    router.get('/v1/api/admin/getDashboardList',mallDashBoard.getDashboard); //获取大盘数据
    router.get('/v1/api/admin/categories',categoryController.getCategories);//获取商品分类列表
    router.get('/v1/api/admin/carousels',carouselsController.getCategories);//获取轮播图分类列表
    router.get('/v1/api/admin/carousels/:carouselId',carouselsController.getCarouselDetail);//获取轮播图详细信息
    router.post('/v1/api/admin/carousels/add',carouselsController.addCarousel);//新增轮播图
    router.put('/v1/api/admin/carousels/update',carouselsController.updateCarousel);//修改轮播图信息
    router.delete('/v1/api/admin/carousels/delete',carouselsController.deleteCarousel);//删除轮播图信息
    
    router.get('/v1/api/admin/getHotConfig',configController.getHotConfig);//获取首页热销商品配置 getNewGoodsOnlineConfig
    router.get('/v1/api/admin/getHotConfig/:configId',configController.getHotConfigDetail);//获取首页热销配置
    router.post('/v1/api/admin/getHotConfig/add',configController.addHotConfig);//新增首页热销配置
    router.put('/v1/api/admin/getHotConfig/update',configController.updateHotConfig);//修改首页热销配置
    router.post('/v1/api/admin/getHotConfig/delete',configController.deleteHotConfig);//删除首页热销配置


    router.get('/v1/api/admin/getNewGoodsOnlineConfig',configController.getNewGoodsOnlineConfig);//获取新品上线配置
    router.get('/v1/api/admin/recommendedForYou',configController.recommendedForYou);//获取为你推荐部分 
    // router.get('/v1/api/admin/getNewGoodsOnlineConfig/:configId',configController.getNewGoodsOnlineDetail);//获取新品上线详情
    // router.post('/v1/api/admin/getNewGoodsOnlineConfig/add',configController.addNewGoodsOnline);//新增新品上线
    // router.put('/v1/api/admin/getNewGoodsOnlineConfig/update',configController.updateNewGoodsOnline);//修改新品上线
    // router.post('/v1/api/admin/getNewGoodsOnlineConfig/delete',configController.deleteNewGoodsOnline);//删除新品上线

    
    router.get('/v1/api/admin/categoriesModule',moduleController.getCategoriesModule);//模块管理中的分类管理
    router.put('/v1/api/admin/categoriesModule/update/:id',moduleController.updateCategoriesById);//修改分类管理数据
    router.delete('/v1/api/admin/categoriesModule/delete',moduleController.deleteCategory);//删除分类管理数据
    // router.delete('/v1/api/admin/categoriesModule/delete/batch',moduleController.deleteCategory);//删除分类管理数据
    router.post('/v1/api/admin/categoriesModule/add',moduleController.addCategory);//新增分类管理数据
    router.get('/v1/api/admin/categoriesModule/:categoryId',moduleController.getCategoryDetail);//获取分类管理信息


    router.post('/v1/api/admin/goods/add',goodsController.addGoodsInfo),//新增商品信息
    router.put('/v1/api/admin/goods/add',goodsController.updateGoodsInfo),//修改商品信息
    
    router.get('/v1/api/admin/goodsList',moduleController.getGoodsList),//获取商品列表数据
    router.get('/v1/api/admin/goods/:goodId',goodsController.getGoodsDetail),//获取商品详细信息

    router.get('/v1/api/admin/userList',moduleController.getUserList),//获取用户列表数据
    router.put('/v1/api/admin/userList/update/:type',moduleController.updateUser),//用户修改
   

    router.get('/v1/api/admin/ordersList',moduleController.getOrdersList);//模块管理中的订单列表信息
    router.post('/v1/api/admin/orders/close',moduleController.closeOrders);//订单关闭
    router.post('/v1/api/admin/orders/checkDone',moduleController.checkDoneOrders);//订单配货完成
    router.post('/v1/api/admin/orders/checkOut',moduleController.checkOutOrders);//订单出货完成
    
    
    router.get('/v1/api/admin/orders/detail/:orderId',moduleController.getOrderDetail);//模块管理中的订单详细信息




    //移动端 API 
    router.get('/v1/api/app/user/info',appUserController.getUserInfo);//移动端-获取用户信息
    router.post('/v1/api/app/user/update',appUserController.updateUserInfo);//移动端-修改用户信息
    router.post('/v1/api/app/user/logout',appUserController.userLogout);//移动端-用户退出操作
    router.post('/v1/api/app/address/add',appAddressController.addAddress); //移动端-新增地址
    // router.get('/v1/api/app/address/list',appAddressController.getAddressList);// 移动端-地址列表数据
    router.put('/v1/api/app/address/update',appAddressController.updateAddress);// 移动端-地址信息修改
    router.get('/v1/api/app/address/detail/:addressId',appAddressController.getAddressDetail);// 移动端-地址信息修改
    router.get('/v1/api/app/address/list',appAddressController.getAddressList);// 移动端-地址列表数据
    router.get('/v1/api/app/address/default',appAddressController.getDefaultAddress);// 移动端-获取默认地址
    
    router.get('/v1/api/app/goods/details/:goodsId',addGoodsController.getGoodsDetail);// 移动端-地址列表数据

    router.post('/v1/api/app/shop-cart/add',shopCartController.addShopCart);// 移动端-添加商品到购物车

    router.get('/v1/api/app/shop-cart/list',shopCartController.getShopCartList);// 移动端-购物车列表
    router.post('/v1/api/app/shop-cart/update',shopCartController.updateCart);// 移动端-购物车修改
    router.post('/v1/api/app/shop-cart/delete/:cartItemId',shopCartController.deleteCart);// 移动端-购物车删除
    
    router.get('/v1/api/app/shop-cart/settle',shopCartController.preOrderSelectCartItem);// 移动端-选中购物车商品，准备预结算

    //  移动端 订单管理模块
    router.post('/v1/api/app/order/create',appOrderController.createOrder);// 移动端-生成订单号
    router.post('/v1/api/app/order/payFor',appOrderController.payForOrder);// 移动端-支付订单
    router.post('/v1/api/app/order/close',appOrderController.closeOrder);// 移动端-取消订单
    router.get('/v1/api/app/order/list',appOrderController.getOrderList);// 移动端-订单列表
    router.get('/v1/api/app/order/detail/:orderNo',appOrderController.getOrderDetail);// 移动端-订单详情
    
    //文件上传  图片
    router.post('/v1/api/admin/upload/img',uploadFileController.uploadImg);


    app.use(router.routes()).use(router.allowedMethods())
}