

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
         select * from my_user where user_name='${user_name}'
       `
       let dataList = await sqlQuery(sql)
       return dataList
   }


}

module.exports = user