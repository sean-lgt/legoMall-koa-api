
const { sqlQuery } = require('../utils/sqlQuery')

const addressModel = {
    /**
     * @description: 新增地址
     * @return {*}
     * @param {*} user_id 用户id
     * @param {*} userName 收货人名
     * @param {*} userPhone 用户手机号
     * @param {*} defaultFlag 是否默认地址 0 1
     * @param {*} provinceName 省
     * @param {*} cityName 市
     * @param {*} regionName 区
     * @param {*} detailAddress 详细地址
     * @param {*} createTime 创建时间
     * @param {*} updateTime 更新时间
     */    
    async addAddress(user_id,userName,userPhone,defaultFlag,provinceName,cityName,regionName,detailAddress,createTime,updateTime){
       let sql = `
        INSERT INTO tb_newbee_mall_user_address (user_id,user_name,user_phone,default_flag,province_name,city_name,region_name,detail_address,is_deleted,create_time,update_time) VALUES (${user_id},'${userName}','${userPhone}',${defaultFlag},'${provinceName}','${cityName}','${regionName}','${detailAddress}',0,'${createTime}','${updateTime}');
       `;
       let dataList = await sqlQuery( sql )
       return dataList
   },
   /**
    * @description: 获取地址列表
    * @return {*}
    * @param {*} user_id 用户id
    */   
   async getAddressList(user_id){
       const sql = `
           SELECT address_id as addressId,
		     city_name as cityName,
			 default_flag as defaultFlag,
			 detail_address as detailAddress,
			 province_name as provinceName,
			 region_name as regionName,
			 user_id as userId,
			 user_name as userName,
			 user_phone as userPhone
           FROM tb_newbee_mall_user_address WHERE user_id = ${user_id};
       `;
       let dataList = await sqlQuery( sql )
       return dataList
   },
   // 获取默认地址
   async getDefaultAddress(user_id){
        const sql = `
           SELECT address_id as addressId,
		     city_name as cityName,
			 default_flag as defaultFlag,
			 detail_address as detailAddress,
			 province_name as provinceName,
			 region_name as regionName,
			 user_id as userId,
			 user_name as userName,
			 user_phone as userPhone
           FROM tb_newbee_mall_user_address WHERE user_id = ${user_id} && default_flag = 1;
       `;
       let dataList = await sqlQuery( sql )

       if(dataList && dataList.length > 0){
           return dataList[0]
       }else{
           return null
       } 
   },
   /**
    * @description: 获取地址详情
    * @return {*}
    * @param {*} user_id
    * @param {*} addressId
    */   
   async getAddressDetail(user_id,addressId){
       const sql = `
           SELECT address_id as addressId,
		     city_name as cityName,
			 default_flag as defaultFlag,
			 detail_address as detailAddress,
			 province_name as provinceName,
			 region_name as regionName,
			 user_id as userId,
			 user_name as userName,
			 user_phone as userPhone
           FROM tb_newbee_mall_user_address WHERE user_id = ${user_id} && address_id = ${addressId};
       `;
       let dataList = await sqlQuery( sql )

       if(dataList && dataList.length > 0){
           return dataList[0]
       }else{
           return {}
       } 
   },
   //更改地址信息
   async updateAddress(addressId,userName,userPhone,defaultFlag,provinceName,cityName,regionName,detailAddress,updateTime){
       const sql = `
            update tb_newbee_mall_user_address set city_name='${cityName}', user_phone='${userPhone}',default_flag='${defaultFlag}',province_name='${provinceName}',city_name='${cityName}',region_name='${regionName}',detail_address='${detailAddress}',update_time='${updateTime}' where address_id=${addressId};
       `;
       let dataList = await sqlQuery(sql)
       return dataList;
   }

}

module.exports = addressModel;