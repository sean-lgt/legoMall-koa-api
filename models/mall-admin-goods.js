
const { sqlQuery } = require('../utils/sqlQuery')

const adminGoodsModel = {
    /**
     * @description: 添加商品
     * @return {*}
     * @param {*} user_id
     * @param {*} goodsCategoryId
     * @param {*} goodsCoverImg
     * @param {*} goodsDetailContent
     * @param {*} goodsIntro
     * @param {*} goodsName
     * @param {*} goodsSellStatus
     * @param {*} originalPrice
     * @param {*} sellingPrice
     * @param {*} stockNum
     * @param {*} tag
     * @param {*} createTime
     */    
    async addGoodsInfo(admin_user_id,goodsCategoryId,goodsCoverImg,goodsDetailContent, goodsIntro,goodsName,goodsSellStatus,originalPrice,sellingPrice,stockNum,tag,createTime){
        let sql = `
            INSERT INTO tb_newbee_mall_goods_info (goods_name,goods_intro,goods_category_id,goods_cover_img,goods_carousel,goods_detail_content,original_price,selling_price,stock_num,tag,goods_sell_status,create_user,create_time,update_user,update_time) VALUES ('${goodsName}','${goodsIntro}','${goodsCategoryId}','${goodsCoverImg}','${goodsCoverImg}','${goodsDetailContent}','${originalPrice}','${sellingPrice}','${stockNum}','${tag}','${goodsSellStatus}','${admin_user_id}','${createTime}','${admin_user_id}','${createTime}');
        `;
       let dataList = await sqlQuery( sql )
       return dataList
    },
    async updateGoodsInfo(admin_user_id,goodsCategoryId,goodsCoverImg,goodsDetailContent, goodsIntro,goodsName,goodsSellStatus,originalPrice,sellingPrice,stockNum,tag,goodsId,createTime){
        let sql = `
            update tb_newbee_mall_goods_info set goods_name='${goodsName}',goods_intro = '${goodsIntro}',goods_category_id ='${goodsCategoryId}',goods_cover_img = '${goodsCoverImg}',goods_carousel ='${goodsCoverImg}',goods_detail_content = '${goodsDetailContent}',original_price = '${originalPrice}',selling_price = '${sellingPrice}',stock_num = '${stockNum}',tag = '${tag}',goods_sell_status ='${goodsSellStatus}',update_user ='${admin_user_id}',update_time = '${createTime}' where goods_id = ${goodsId};
        `;
       let dataList = await sqlQuery( sql )
       return dataList
    },
    /**
     * @description: 
     * @return {*}
     */    
    async getGoodsDetail(admin_user_id,goodId){
         let sql = `
         select create_user as createUser,
			 goods_carousel as goodsCarousel,
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
			 tag as tag,
			 update_time as updateTime,
			 update_user as updateUser
          FROM tb_newbee_mall_goods_info WHERE  goods_id = ${goodId};   
        `;
        let dataList = await sqlQuery( sql );
        
        // return dataList;
        const goodsCategoryId =dataList[0].goodsCategoryId;
        let firstCategory={};
        let secondCategory={};
        let thirdCategory={};
        //查询分类信息
        let queryFirstSql = `
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
            FROM tb_newbee_mall_goods_category where category_id = ${goodsCategoryId};
        `;
        let dataFirst = await sqlQuery( queryFirstSql );
        
        //判断当前层级
        let secondCategoryId ='';
        let thirdCategoryId = ''
        if(dataFirst[0].categoryLevel = 3){
            thirdCategory = dataFirst[0];
            secondCategoryId = dataFirst[0].parentId;
            let querySecondSql = `
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
                FROM tb_newbee_mall_goods_category where category_id = ${secondCategoryId};
             `;
              let dataSecond = await sqlQuery( querySecondSql );
              secondCategory = dataSecond[0];
              threeCategoryId = dataSecond[0].parentId;
              let queryThreeSql = `
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
                FROM tb_newbee_mall_goods_category where category_id = ${threeCategoryId};
             `;
             let dataThree = await sqlQuery( queryThreeSql );
             firstCategory = dataThree[0];
        }else if(dataFirst[0].categoryLevel = 2){
              secondCategory = dataFirst[0];
              threeCategoryId = dataFirst[0].parentId;
              let queryThreeSql = `
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
                FROM tb_newbee_mall_goods_category where category_id = ${threeCategoryId};
             `;
             let dataThree = await sqlQuery( queryThreeSql );
             firstCategory = dataThree[0];
        }else{
            firstCategory = dataFirst[0];
        }

        let dataJson = {
            firstCategory,
            secondCategory,
            thirdCategory,
            goods:dataList[0]
        }

        return dataJson
    }
}
module.exports = adminGoodsModel;