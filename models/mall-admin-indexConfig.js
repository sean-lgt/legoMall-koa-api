
const { sqlQuery } = require('../utils/sqlQuery')

const indexConfigModel = {

    /**
     * @description: 获取轮播图数据
     * @return {*}
     * @param {*} pageNumber 页码数
     * @param {*} pageSize 每页数量
     */    
    async getHotGoods(pageNumber,pageSize){
        let sql = `
           SELECT config_id as configId,
			 config_name as configName,
			 config_rank as configRank,
			 config_type as configType,
			 create_time as createTime,
			 create_user as createUser,
			 goods_id as goodsId,
			 is_deleted as isDeleted,
			 redirect_url as redirectUrl,
			 update_time as updateTime,
			 update_user as updateUser
            FROM tb_newbee_mall_index_config WHERE config_type=3 limit ${(pageNumber-1)*pageSize}, ${pageSize};
        `
       let dataList = await sqlQuery( sql );
       let totalSql = `
            SELECT COUNT(*) FROM tb_newbee_mall_index_config WHERE config_type=3;
       `;
       const totalCount = await sqlQuery( totalSql );
       const totalPage = Math.ceil(totalCount[0]['COUNT(*)']/pageSize);
       const dataJson = {
           list:dataList,
           currPage:pageNumber,
           pageSize,
           totalCount:totalCount[0]['COUNT(*)'],
           totalPage
       }  
       return dataJson
    },
    /**
     * @description: 新增首页热销商品配置
     * @return {*}
     * @param {*} admin_user_id
     * @param {*} configName
     * @param {*} configRank
     * @param {*} configType
     * @param {*} goodsId
     * @param {*} redirectUrl
     * @param {*} createTime
     */    
    async addHotConfig(admin_user_id,configName, configRank,configType,goodsId,redirectUrl,createTime){
        let sql = `
            INSERT INTO tb_newbee_mall_index_config (config_name,config_rank,config_type,goods_id,redirect_url,is_deleted,create_time,create_user,update_user,update_time) VALUES('${configName}','${configRank}','${configType}','${goodsId}','${redirectUrl}',0,'${createTime}',${admin_user_id},${admin_user_id},'${createTime}')
        `;
       let dataList = await sqlQuery( sql )
       return dataList
    },
    /**
     * @description: 修改热销配置信息
     * @return {*}
     * @param {*} admin_user_id
     * @param {*} configId
     * @param {*} configName
     * @param {*} configRank
     * @param {*} configType
     * @param {*} goodsId
     * @param {*} redirectUrl
     * @param {*} updateTime
     */    
    async updateHotConfig(admin_user_id,configId,configName,configRank,configType,goodsId,redirectUrl,updateTime){
         let sql = `
           UPDATE tb_newbee_mall_index_config SET config_name='${configName}',config_rank='${configRank}',config_type='${configType}',goods_id='${goodsId}',redirect_url='${redirectUrl}',update_time='${updateTime}',update_user='${admin_user_id}' WHERE config_id = ${configId}; 
        `;
        let dataList = await sqlQuery( sql );
        return dataList
    },
    /**
     * @description: 删除轮播图  数组
     * @return {*}
     * @param {*} admin_user_id
     * @param {*} ids 轮播图数组
     * @param {*} updateTime
     */    
    async deleteHotConfig(admin_user_id,ids,updateTime){
        const idList = ids.join(',')
        let sql = `
           update tb_newbee_mall_index_config set is_deleted='1',update_user='${admin_user_id}',update_time='${updateTime}' where config_id in (${idList}); 
        `;
        let dataList = await sqlQuery( sql );
        return dataList
    },
    /**
     * @description: 获取首页热销配置详情
     * @return {*}
     * @param {*} admin_user_id
     * @param {*} configId 配置id
     */    
    async getHotConfigDetail(admin_user_id,configId){
        let sql = `
          SELECT config_id as configId,
	   		 config_name as configName,
	   		 config_rank as configRank,
	   		 config_type as configType,
	   		 create_time as createTime,
	   		 create_user as createUser,
	   		 goods_id as goodsId,
	   		 is_deleted as isDeleted,
	   		 redirect_url as redirectUrl,
	   		 update_time as updateTime,
	   		 update_user as updateUser
           FROM tb_newbee_mall_index_config WHERE  config_id = ${configId};   
        `;
        let dataList = await sqlQuery( sql );
        return dataList
    },

    /**
     * @description: 获取新品上线配置
     * @return {*}
     * @param {*} pageNumber
     * @param {*} pageSize
     */   
    async getNewGoodsOnlineConfig(pageNumber,pageSize){
           let sql = `
              SELECT config_id as configId,
	   		 config_name as configName,
	   		 config_rank as configRank,
	   		 config_type as configType,
	   		 create_time as createTime,
	   		 create_user as createUser,
	   		 goods_id as goodsId,
	   		 is_deleted as isDeleted,
	   		 redirect_url as redirectUrl,
	   		 update_time as updateTime,
	   		 update_user as updateUser
               FROM tb_newbee_mall_index_config WHERE config_type=4 limit ${(pageNumber-1)*pageSize}, ${pageSize};
           `
          let dataList = await sqlQuery( sql );
          let totalSql = `
               SELECT COUNT(*) FROM tb_newbee_mall_index_config WHERE config_type=4;
          `;
          const totalCount = await sqlQuery( totalSql );
          const totalPage = Math.ceil(totalCount[0]['COUNT(*)']/pageSize);
          const dataJson = {
              list:dataList,
              currPage:pageNumber,
              pageSize,
              totalCount:totalCount[0]['COUNT(*)'],
              totalPage
          }  
          return dataJson
    },
    /**
     * @description: 为你推荐配置
     * @return {*}
     * @param {*} pageNumber
     * @param {*} pageSize
     */    
    async recommendedForYou(pageNumber,pageSize){
           let sql = `
              SELECT config_id as configId,
	   		 config_name as configName,
	   		 config_rank as configRank,
	   		 config_type as configType,
	   		 create_time as createTime,
	   		 create_user as createUser,
	   		 goods_id as goodsId,
	   		 is_deleted as isDeleted,
	   		 redirect_url as redirectUrl,
	   		 update_time as updateTime,
	   		 update_user as updateUser
               FROM tb_newbee_mall_index_config WHERE config_type=5 limit ${(pageNumber-1)*pageSize}, ${pageSize};
           `
          let dataList = await sqlQuery( sql );
          let totalSql = `
               SELECT COUNT(*) FROM tb_newbee_mall_index_config WHERE config_type=5;
          `;
          const totalCount = await sqlQuery( totalSql );
          const totalPage = Math.ceil(totalCount[0]['COUNT(*)']/pageSize);
          const dataJson = {
              list:dataList,
              currPage:pageNumber,
              pageSize,
              totalCount:totalCount[0]['COUNT(*)'],
              totalPage
          }  
          return dataJson
    },
    
}

module.exports = indexConfigModel;