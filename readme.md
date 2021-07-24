#  KOA-MySql 项目

##  结构目录

```
│  app.js  项目入口文件
├─config     项目配置目录
│      config.js     公共配置-运行端口号-静态资源目录-加密key-日志目录
│      dbConfig.js   数据库相关配置
│      
├─controller  业务逻辑层
│      mall-admin-carousel.js   管理端-轮播图配置
│      mall-admin-category.js   管理端-商品分类配置
│      mall-admin-dashboard.js  管理端-数据面板
│      mall-admin-goods.js      管理端-商品数据配置
│      mall-admin-indexConfig.js 管理端-首页配置
│      mall-admin-moduleManagement.js  管理端-模块管理
│      mall-admin-user.js    管理端-用户管理
│      mall-app-address.js   移动端-地址管理
│      mall-app-cart.js      移动端-购物车
│      mall-app-goods.js     移动端-商品
│      mall-app-index.js     移动端-首页数据
│      mall-app-order.js     移动端-订单管理
│      mall-app-user.js      移动端-用户管理
│      test.js               测试jwt
│      upload-file.js        项目上传文件逻辑
│      user.js               测试curd
│      
├─init 存放项目基础数据库内容  
├─logs  日志存放目录 （默认存放30个）
│      serve.-2021-06-16.log
│      
├─middlewares  中间件（koa的洋葱模型）
│      jwt.js  jwt鉴权，生成token、验证token
│      logger.js 日志相关配置及生成
│      response.js 响应中间件，配置全局响应参数
│      
├─models  数据模型  处理增删查改返回给 业务逻辑层 controller
│      mall-admin-carousel.js
│      mall-admin-category.js
│      mall-admin-goods.js
│      mall-admin-indexConfig.js
│      mall-admin-moduleManagement.js
│      mall-admin-user.js
│      mall-app-address.js
│      mall-app-cart.js
│      mall-app-goods.js
│      mall-app-index.js
│      mall-app-order.js
│      mall-app-user.js
│      user.js
│      
├─public  共同静态资源目录
│  ├─css 
│  ├─html
│  ├─images  
│  ├─js
│  └─uploadImg  项目上传文件目录 暂时存放img 以时间戳为区分
│          1625988897480.jpg    
├─routers  路由管理模块
│  ├─private   私有路由 -需要用jwt校验token
│  │      index.js
│  └─public    公开路由  无需携带token请求
│          index.js
├─utils    工具函数库
│      common.js 常用工具函数封装
│      error.js  错误响应参数封装
│      mallSqlQuery.js 配置商城数据库 使用 Promise封装请求
│      sqlQuery.js  
└─views  视图渲染模块
├─.vscode  配置vscod的端点调试
│      launch.json
├─typings  配置vscode智能提示node  

```

##  项目技术栈

- 主要技术：使用 koa 框架 及 koa-router 和 node常用库 + Mysql 数据库搭建商城服务端API项目。
- 使用 `koa-jwt` + `jsonwebtoken` 库生成token，进行权限校验。
- 使用 `Promise` 封装 Mysql 数据连接及请求。
- 使用 MVC 思想 对项目结构进行拆分，解耦。
- 项目中使用到的库：
  - `path`：node 自带的文件路径模块
  - `fs`：node 自带的文件操作模块
  - `koa-jwt`：提供路由权限控制的功能
  - `jsonwebtoken`：JWT鉴权、生成token
  - `koa-static`：koa配置静态资源
  - `koa-bodyparser`：将post请求的参数转为json返回
  - `koa2-cors`：支持跨域请求
  - `koa-helmet`：提高网站的安全性
  - `log4js`：生成日志
  - `moment`：时间处理库
  - `js-md5`：密码加密工具

##  项目总结

通过项目实战，能够更好的理解koa框架及洋葱模型思想，同时使用 mysql 对数据进行增删查改，能够了解服务端的一些知识及数据库操作技巧。

















