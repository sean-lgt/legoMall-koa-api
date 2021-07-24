
const { sqlQuery } = require('../utils/sqlQuery')

const indexInfoModel = {

    /**
     * @description: 获取首页展示信息
     * @return {*}
     * @param {*} 
     */    
    async getIndexInfo(){
        const carouselsSql = `
            SELECT carousel_id as carouselId,
			 carousel_url as carouselUrl,
			 redirect_url as redirectUrl,
			 carousel_rank as carouselRank,
			 is_deleted as isDeleted,
			 create_time as createTime,
			 create_user as createUser,
			 update_time as updateTime,
			 update_user as update_user
            FROM tb_newbee_mall_carousel ORDER BY carousel_rank ASC LIMIT 3;
        `;
        const hotGoodsesSql = `
            SELECT goods_id as goodsId,
			 goods_name as goodsName,
			 goods_intro as goodsIntro,
			 goods_category_id as goodsCategoryId,
			 goods_cover_img as goodsCoverImg,
			 goods_carousel as goodsCarousel,
			 goods_detail_content as goodsDetailContent,
			 original_price as originalPrice,
			 selling_price as sellingPrice,
			 stock_num as stockNum,
			 tag as tag,
			 goods_sell_status as goodsSellStatus,
			 create_user as createUser,
			 create_time as createTime,
			 update_user as updateUser,
			 update_time as updateTime
            FROM tb_newbee_mall_goods_info ORDER BY RAND() LIMIT 4;
        `;
        const recommendGoodsSql = `
            SELECT goods_id as goodsId,
			 goods_name as goodsName,
			 goods_intro as goodsIntro,
			 goods_category_id as goodsCategoryId,
			 goods_cover_img as goodsCoverImg,
			 goods_carousel as goodsCarousel,
			 goods_detail_content as goodsDetailContent,
			 original_price as originalPrice,
			 selling_price as sellingPrice,
			 stock_num as stockNum,
			 tag as tag,
			 goods_sell_status as goodsSellStatus,
			 create_user as createUser,
			 create_time as createTime,
			 update_user as updateUser,
			 update_time as updateTime
            FROM tb_newbee_mall_goods_info ORDER BY RAND() LIMIT 10;
        `;
        const newGoodsSql = `
            SELECT goods_id as goodsId,
			 goods_name as goodsName,
			 goods_intro as goodsIntro,
			 goods_category_id as goodsCategoryId,
			 goods_cover_img as goodsCoverImg,
			 goods_carousel as goodsCarousel,
			 goods_detail_content as goodsDetailContent,
			 original_price as originalPrice,
			 selling_price as sellingPrice,
			 stock_num as stockNum,
			 tag as tag,
			 goods_sell_status as goodsSellStatus,
			 create_user as createUser,
			 create_time as createTime,
			 update_user as updateUser,
			 update_time as updateTime
            FROM tb_newbee_mall_goods_info ORDER BY create_time DESC LIMIT 4;
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
    async getCategoriesOld(){
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
        //    for(let j = 0;j<secondLevelCategoryVOS.length;j++){
        //        let threeSql = `
        //           SELECT category_id as categoryId,
		//        	     category_level as categoryLevel,
		//        	     category_name as categoryName,
		//        	     parent_id as parentId
        //           FROM tb_newbee_mall_goods_category WHERE parent_id = ${secondLevelCategoryVOS[j].categoryId};
        //        `;
        //       let thirdLevelCategoryVOS =  await sqlQuery(threeSql);
        //        dataJson[i].secondLevelCategoryVOS[j].secondLevelCategoryVOS=secondLevelCategoryVOS;
        //    }
       }
       return dataJson;
    },

    async getCategories(){
        const level1Sql = `
            SELECT category_id as categoryId,
			 category_level as categoryLevel,
             parent_id as parentId,
			 category_name as categoryName
            FROM tb_newbee_mall_goods_category WHERE category_level = 1;
        `;
         const leve21Sql = `
            SELECT category_id as categoryId,
			 category_level as categoryLevel,
             parent_id as parentId,
			 category_name as categoryName
            FROM tb_newbee_mall_goods_category WHERE category_level = 2;
        `;
         const leve31Sql = `
            SELECT category_id as categoryId,
			category_level as categoryLevel,
            parent_id as parentId,
			category_name as categoryName
            FROM tb_newbee_mall_goods_category WHERE category_level = 3;
        `;
       let dataJson =  await sqlQuery(level1Sql);
       let dataLevel2 =  await sqlQuery(leve21Sql);
       let dataLevel3 =  await sqlQuery(leve31Sql);

       dataLevel2.forEach((item2,index2)=>{
           item2.thirdLevelCategoryVOS=[];
           dataLevel3.forEach((item3,index3)=>{
               if(item3.parentId == item2.categoryId){
                   item2.thirdLevelCategoryVOS.push(item3)
               }
           })
       }) 

       dataJson.forEach((item,index)=>{
           item.secondLevelCategoryVOS=[];
           dataLevel2.forEach((item2,index2)=>{
               if(item2.parentId == item.categoryId){
                   item.secondLevelCategoryVOS.push(item2)
               }
           })
       })
      
      return dataJson;
        
    }

}

module.exports = indexInfoModel;