

const { sqlQuery } = require('../utils/sqlQuery')

const user = {
   /**
    * @description: 获取所有的用户信息内容
    * @return {object} mysql执行结果
    */
   async getAllUser( ) {
     let sql = 'SELECT * FROM my_user'
     let dataList = await sqlQuery( sql )
     return dataList
   },
   /**
    * @description: 新增用户
    * @return {*}
    * @param {*} name 用户名
    * @param {*} password 密码
    * @param {*} time 创建时间
    */    
   async insertUser(name,password,time){

       let sql = `
        INSERT INTO my_user ( user_name, user_password, create_date ) VALUES ( '${name}', '${password}','${time}' );
       `
       let dataList = await sqlQuery( sql )
       return dataList
   },
   /**
    * @description: 修改用户信息
    * @return {*}
    * @param {*} userId
    */
   async updateUser(user_id,user_name,user_password){
      //    let {user_name,user_password} = newUserInfo
       let sql = `
       update my_user set user_name='${user_name}', user_password='${user_password}' where user_id=${user_id};
       `
       let dataList = await sqlQuery( sql )
       return dataList
   }, 
   /**
    * @description: 注销用户信息
    * @return {*}
    * @param {*} user_id
    */    
   async deleteUser(user_id){
       let sql = `
            delete from my_user where user_id=${user_id};
       `
       let dataList = await sqlQuery(sql)
       return dataList
   },
   /**
    * @description: 用户登录操作
    * @return {*}
    * @param {*} user_name 用户名
    */   
   async login(user_name){
       let sql = `
         select * from tb_newbee_mall_admin_user where login_user_name='${user_name}'
       `
       let dataList = await sqlQuery(sql)
       return dataList
   },
   /**
    * @description: 
    * @return {*}
    * @param {*} admin_user_id 登录id
    * @param {*} token token 时间
    * @param {*} update_time 更新时间
    * @param {*} expire_time 过期时间
    */
   async addUserToken(admin_user_id,token,update_time,expire_time){
       let queryInfo = `
        SELECT * from tb_newbee_mall_admin_user_token WHERE admin_user_id = ${admin_user_id}
       `
       let queryList = await sqlQuery(queryInfo);
       let dataList = '';
       //新增 表中不存在
       if(queryList.length == 0){
           let sql = `
              INSERT INTO tb_newbee_mall_admin_user_token ( admin_user_id, token, update_time,expire_time ) VALUES ( ${admin_user_id}, '${token}','${update_time}','${expire_time}');
            `
            dataList = await sqlQuery(sql)
       }else{
           //修改 表中已存在该用户
           let sql = `
               update tb_newbee_mall_admin_user_token set token='${token}', update_time='${update_time}',expire_time='${expire_time}' where admin_user_id=${admin_user_id};
            `
            dataList = await sqlQuery(sql)
       }
       return dataList
   },
   /**
    * @description: 获取用户信息--管理端
    * @return {*}
    * @param {*} admin_user_id
    */
   async getUserInfo(admin_user_id){
       let sql = `
            SELECT admin_user_id as adminUserId,
			 nick_name as nickName,
			 locked as locked,
			 login_user_name as loginUserName,
             login_password as loginPassword
           FROM tb_newbee_mall_admin_user WHERE admin_user_id = ${admin_user_id};
       `;
        let dataList = await sqlQuery(sql);
        return dataList;

   },
   /**
    * @description: 用户退出操作
    * @return {*}
    * @param {*} admin_user_id
    * @param {*} time
    */   
   async userLogout(admin_user_id,time){
        let sql = `
             update tb_newbee_mall_admin_user_token set token='', update_time='${time}',expire_time='${time}' where admin_user_id=${admin_user_id};
       `;
        let dataList = await sqlQuery(sql)
       return dataList;
   },
   /**
    * @description: 修改登录名及昵称
    * @return {*}
    * @param {*} admin_user_id
    * @param {*} loginUserName
    * @param {*} nickName
    * @param {*} time
    */   
   async updateName(admin_user_id,loginUserName, nickName,time){
        let sql = `
             UPDATE tb_newbee_mall_admin_user SET login_user_name='${loginUserName}',nick_name='${nickName}' WHERE admin_user_id=${admin_user_id};
       `;
        let dataList = await sqlQuery(sql)
       return dataList;
   },
   /**
    * @description: 修改密码操作
    * @return {*}
    * @param {*} admin_user_id
    * @param {*} newPassword
    */   
   async updatePassword(admin_user_id,newPassword){
        let sql = `
             UPDATE tb_newbee_mall_admin_user SET login_password='${newPassword}' WHERE admin_user_id=${admin_user_id};
       `;
        let dataList = await sqlQuery(sql)
       return dataList;
   }


}

module.exports = user