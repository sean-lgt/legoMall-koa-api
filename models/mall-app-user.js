
const { sqlQuery } = require('../utils/sqlQuery')

const user = {
    /**
     * @description: 移动端-用户注册
     * @return {*}
     * @param {*} loginName 登录名，为手机号
     * @param {*} psdMd5    密码 加密后的
     * @param {*} time      时间
     */    
    async register(loginName,psdMd5,time){
      //需要判断手机号是否已经被注册了
       const searchSql = `
            SELECT * FROM tb_newbee_mall_user WHERE login_name=${loginName};
        `;
        let isHavLoginName = await sqlQuery(searchSql)
        if(isHavLoginName.length != 0){
            //已经存在数据
            return 'alreadyExists';
        }
       let sql = `
        INSERT INTO tb_newbee_mall_user (nick_name,login_name,password_md5,introduce_sign,is_deleted,locked_flag,create_time) VALUES ('${loginName}','${loginName}','${psdMd5}','你的生活，我来负责',0,0,'${time}');
       `;
       let dataList = await sqlQuery( sql )
       return dataList
   },
   /**
    * @description: 移动端登录功能
    * @return {*}
    * @param {*} loginName
    */    
   async login(loginName){
      let sql = `
         SELECT * FROM tb_newbee_mall_user where login_name='${loginName}'
       `
       let dataList = await sqlQuery(sql)
       return dataList
   },

   // 将用户登录成功后的token放入数据库
   /**
    * @description: 将用户登录成功后的token放入数据库
    * @return {*}
    * @param {*} user_id 用户id
    * @param {*} token  用户此次登录的token
    * @param {*} update_time 更新时间
    * @param {*} expire_time 过期时间
    */  
   async addUserToken(user_id,token,update_time,expire_time){
       let queryInfo = `
        SELECT * from tb_newbee_mall_user_token WHERE user_id = ${user_id}
       `
       let queryList = await sqlQuery(queryInfo);
       let dataList = '';
       //新增 表中不存在
       if(queryList.length == 0){
           let sql = `
              INSERT INTO tb_newbee_mall_user_token ( user_id, token, update_time,expire_time ) VALUES ( ${user_id}, '${token}','${update_time}','${expire_time}');
            `
            dataList = await sqlQuery(sql)
       }else{
           //修改 表中已存在该用户
           let sql = `
               update tb_newbee_mall_user_token set token='${token}', update_time='${update_time}',expire_time='${expire_time}' where user_id=${user_id};
            `
            dataList = await sqlQuery(sql)
       }
       return dataList
   },

   /**
    * @description: 获取用户信息
    * @return {*}
    * @param {*} user_id 用户id
    */
   async getUserInfo(user_id){
       const sql = `
            SELECT introduce_sign as introduceSign,
		      login_name as loginName,
			  nick_name as nickName
            FROM tb_newbee_mall_user WHERE user_id = ${user_id};
       `;
       let dataList = await sqlQuery(sql)
       return dataList;
   },
   /**
    * @description: 更新用户信息
    * @return {*}
    * @param {*} user_id 用户id
    * @param {*} introduceSign 个性签名
    * @param {*} nickName   昵称
    * @param {*} passwordMd5   密码 非必改
    */    
   async updateUserInfo(user_id,introduceSign,nickName,passwordMd5){
       let sql = '';
       if(passwordMd5 !== ''){
           sql = `
                UPDATE tb_newbee_mall_user set nick_name = '${nickName}',introduce_sign = '${introduceSign}',password_md5 = '${passwordMd5}' WHERE user_id = ${user_id};
           `;
       }else{
           sql = `
                UPDATE tb_newbee_mall_user set nick_name = '${nickName}',introduce_sign = '${introduceSign}' WHERE user_id = ${user_id};
           `;
       }
       let dataList = await sqlQuery(sql)
       return dataList;
   },
   /**
    * @description: 用户退出操作
    * @return {*}
    * @param {*} user_id
    */   
   async userLogout(user_id,time){
       let sql = `
             update tb_newbee_mall_user_token set token='', update_time='${time}',expire_time='${time}' where user_id=${user_id};
       `;
        let dataList = await sqlQuery(sql)
       return dataList;
   },

   

}
module.exports = user;