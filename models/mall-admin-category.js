
const { sqlQuery } = require('../utils/sqlQuery')

const categoryModel = {

    /**
     * @description: 获取商品分类数据
     * @return {*}
     * @param {*} pageNumber 页码数
     * @param {*} pageSize 每页数量
     * @param {*} categoryLevel 分类层级
     * @param {*} parentId  父亲id
     */    
    async getCategoryList(pageNumber,pageSize,categoryLevel,parentId){
        let sql = `
            SELECT category_id as categoryId,
			 category_level as categoryLevel,
			 category_name as categoryName,
			 category_rank as categoryRank,
			 create_time as createTime,
			 create_user as createUser,
			 is_deleted as isDeleted,
			 parent_id as parentId,
			 update_time as updateTime,
			 update_user as updateUser
            FROM tb_newbee_mall_goods_category WHERE parent_id = ${parentId} and category_level=${categoryLevel} limit ${(pageNumber-1)*pageSize}, ${pageSize};
        `
       let dataList = await sqlQuery( sql );
       let totalSql = `
            SELECT COUNT(*) FROM tb_newbee_mall_goods_category WHERE parent_id = ${parentId} and category_level=${categoryLevel};
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
    }
}

module.exports = categoryModel;