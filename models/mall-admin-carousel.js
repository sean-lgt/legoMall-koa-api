
const { sqlQuery } = require('../utils/sqlQuery')

const carouselModel = {

    /**
     * @description: 获取轮播图数据
     * @return {*}
     * @param {*} pageNumber 页码数
     * @param {*} pageSize 每页数量
     * @param {*} categoryLevel 分类层级
     * @param {*} parentId  父亲id
     */    
    async getCarouselList(pageNumber,pageSize){
        let sql = `
            SELECT carousel_id as carouselId,
			 carousel_rank as carouselRank,
			 carousel_url as carouselUrl,
			 create_time as createTime,
			 create_user as createUser,
			 is_deleted as isDeleted,
			 redirect_url as redirectUrl,
			 update_time as updateTime,
			 update_user as updateUser
            FROM tb_newbee_mall_carousel limit ${(pageNumber-1)*pageSize}, ${pageSize};
        `
       let dataList = await sqlQuery( sql );
       let totalSql = `
            SELECT COUNT(*) FROM tb_newbee_mall_carousel;
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
     * @description: 新增轮播图
     * @return {*}
     * @param {*} admin_user_id
     * @param {*} carouselUrl
     * @param {*} redirectUrl
     * @param {*} carouselRank
     * @param {*} createTime
     */    
    async addCarousel(admin_user_id,carouselUrl, redirectUrl,carouselRank,createTime){
        let sql = `
            INSERT INTO tb_newbee_mall_carousel (carousel_url,redirect_url,carousel_rank,is_deleted,create_time,create_user,update_user,update_time) VALUES('${carouselUrl}','${redirectUrl}','${carouselRank}',0,'${createTime}',${admin_user_id},${admin_user_id},'${createTime}')
        `;
       let dataList = await sqlQuery( sql )
       return dataList
    },
    /**
     * @description: 修改轮播图信息
     * @return {*}
     * @param {*} admin_user_id
     * @param {*} carouselId
     * @param {*} carouselUrl
     * @param {*} redirectUrl
     * @param {*} carouselRank
     * @param {*} updateTime
     */    
    async updateCarousel(admin_user_id,carouselId,carouselUrl, redirectUrl,carouselRank,updateTime){
         let sql = `
           update tb_newbee_mall_carousel set carousel_url='${carouselUrl}', redirect_url='${redirectUrl}',carousel_rank= '${carouselRank}',update_user='${admin_user_id}',update_time='${updateTime}' where carousel_id = ${carouselId}; 
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
    async deleteCarousel(admin_user_id,ids,updateTime){
        const idList = ids.join(',')
        let sql = `
           update tb_newbee_mall_carousel set is_deleted='1',update_user='${admin_user_id}',update_time='${updateTime}' where carousel_id in (${idList}); 
        `;
        let dataList = await sqlQuery( sql );
        return dataList
    },
    /**
     * @description: 获取轮播图详情
     * @return {*}
     * @param {*} admin_user_id
     * @param {*} carouselId
     */    
    async getCarouselDetail(admin_user_id,carouselId){
        let sql = `
         SELECT carousel_id as carouselId,
			 carousel_rank as carouselRank,
			 carousel_url as carouselUrl,
			 create_time as createTime,
			 create_user as createUser,
			 is_deleted as isDeleted,
			 redirect_url as redirectUrl,
			 update_time as updateTime,
			 update_user as updateUser
          FROM tb_newbee_mall_carousel WHERE carousel_id = ${carouselId};
        `;
        let dataList = await sqlQuery( sql );
        return dataList
    }
}

module.exports = carouselModel;