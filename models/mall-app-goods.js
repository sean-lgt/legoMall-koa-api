
const { sqlQuery } = require('../utils/sqlQuery')

const goodsModel = {

    /**
     * @description: 
     * @return {*}
     * @param {*} goodsId
     */    
    async getGoodsDetail(goodsId){
        const sql = `
           SELECT goods_carousel as goodsCarousel,
			 goods_category_id as goodsCategoryId,
			 goods_cover_img as goodsCoverImg,
			 goods_detail_content as goodsDetailContent,
			 goods_id as goodsId,
			 goods_intro as goodsIntro,
			 goods_name as goodsName,
			 goods_sell_status as goodsSellStatus,
			 original_price as originalPrice,
			 selling_price as sellingPrice,
			 stock_num as stockNum,
			 tag as tag
           FROM tb_newbee_mall_goods_info WHERE goods_id = ${goodsId}; 
        `;
        let dataJson =  await sqlQuery(sql);
        return dataJson;
    },
    /**
     * @description: 
     * @return {*}
     * @param {*} pageNumber
     * @param {*} pageSize
     * @param {*} keyword
     * @param {*} orderBy
     */    
    async searchGoods(pageNumber,pageSize,keyword,orderBy){
        let queryCondition = ''
        if(orderBy =='new'){
            queryCondition = ` where goods_name like '%${keyword}%' ORDER BY create_time DESC`
        }else if(orderBy =='price'){
             queryCondition = ` where goods_name like '%${keyword}%' ORDER BY selling_price ASC`
        }else{
             queryCondition = ` where goods_name like '%${keyword}%'`
        }
         let sql = `
           SELECT goods_id as goodsId,
			 goods_cover_img as goodsCoverImg,
			 goods_intro as goodsIntro,
			 goods_name as goodsName,
			 selling_price as sellingPrice
           FROM tb_newbee_mall_goods_info ${queryCondition} limit ${(pageNumber-1)*pageSize}, ${pageSize};
           `
          let dataList = await sqlQuery( sql );
          let totalSql = `
               SELECT COUNT(*)  FROM tb_newbee_mall_goods_info ${queryCondition};
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
     * @description: 获取首页展示信息
     * @return {*}
     * @param {*} 
     */    
    async getIndexInfo(){
        const carouselsSql = `
            SELECT * FROM tb_newbee_mall_carousel ORDER BY carousel_rank ASC LIMIT 3;
        `;
        const hotGoodsesSql = `
            SELECT * FROM tb_newbee_mall_goods_info ORDER BY RAND() LIMIT 4;
        `;
        const recommendGoodsSql = `
            SELECT * FROM tb_newbee_mall_goods_info ORDER BY RAND() LIMIT 10;
        `;
        const newGoodsSql = `
            SELECT * FROM tb_newbee_mall_goods_info ORDER BY create_time DESC LIMIT 4;
        `;
        const carousels = await sqlQuery(carouselsSql);
        const hotGoodses = await sqlQuery(hotGoodsesSql);
        const newGoodses = await sqlQuery(newGoodsSql);
        const recommendGoodses = await sqlQuery(recommendGoodsSql);
        const dataJson ={
            carousels,
            hotGoodses,
            newGoodses,
            recommendGoodses
        }
        return dataJson
    },
    /**
     * @description: 获取商品分类信息
     * @return {*}
     */    
    async getCategories(){
        const parentSql = `
            SELECT category_id as categoryId,
			 category_level as categoryLevel,
			 category_name as categoryName
            FROM tb_newbee_mall_goods_category WHERE category_level = 1;
        `;
       let dataJson =  await sqlQuery(parentSql);
       for(let i= 0;i<dataJson.length;i++){
           let childSql = `
            SELECT category_id as categoryId,
			     category_level as categoryLevel,
			     category_name as categoryName,
			     parent_id as parentId
            FROM tb_newbee_mall_goods_category WHERE parent_id = ${dataJson[i].categoryId};
           `;
           let secondLevelCategoryVOS =  await sqlQuery(childSql);
           dataJson[i].secondLevelCategoryVOS=secondLevelCategoryVOS;
       }
       return dataJson;
    }
}

module.exports = goodsModel;