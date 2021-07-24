
const { sqlQuery } = require('../utils/sqlQuery')

const shopCartModel = {
   /**
    * @description: 添加商品到购物车
    * @return {*}
    * @param {*} user_id 用户id
    * @param {*} goodsCount 添加的商品数量
    * @param {*} goodsId 商品id
    * @param {*} createTime 添加的时间
    */    
   async addShopCart(user_id,goodsCount,goodsId,createTime){
       // 需要先判断 该商品是否已经被添加了
        const searchSql = `
            SELECT * FROM tb_newbee_mall_shopping_cart_item WHERE user_id=${user_id} && goods_id = ${goodsId};
        `;
        let isHavShopCart = await sqlQuery(searchSql)
        if(isHavShopCart.length != 0){
            //已经存在数据
            return 'alreadyExists';
        }
       let sql = `
        INSERT INTO tb_newbee_mall_shopping_cart_item (user_id,goods_id,goods_count,is_deleted,create_time,update_time) VALUES(${user_id},${goodsId},${goodsCount},'0','${createTime}','${createTime}');
       `;
       let dataList = await sqlQuery( sql );
       return dataList
   },
   /**
    * @description: 更改购物车数据
    * @return {*}
    * @param {*} user_id
    * @param {*} goodsCount
    * @param {*} goodsId
    * @param {*} updateTime
    */   
   async updateCart(user_id,goodsCount,cartItemId,updateTime){
       let sql = `
         update tb_newbee_mall_shopping_cart_item set goods_count = '${goodsCount}',update_time = '${updateTime}' where user_id=${user_id} && cart_item_id = ${cartItemId} && is_deleted = 0;
       `;
       let dataList = await sqlQuery( sql );
       return dataList
   },
   /**
    * @description: 删除购物车
    * @return {*}
    * @param {*} user_id
    * @param {*} cartItemId
    * @param {*} updateTime
    */   
   async deleteCart(user_id,cartItemId,updateTime){
        let sql = `
         update tb_newbee_mall_shopping_cart_item set is_deleted = 1 ,update_time = '${updateTime}' where user_id=${user_id} && cart_item_id = ${cartItemId};
       `;
       let dataList = await sqlQuery( sql );
       return dataList
   },
   /**
    * @description: 获取购物车列表数据
    * @return {*}
    * @param {*} user_id 用户id 
    * @param {*} pageNumber 分页数
    * @param {*} pageSize 每页条数
    */   
   async getShopCartList(user_id,pageNumber,pageSize){
        // 需要运用到联表查询
        let sql = `
          SELECT a.cart_item_id as cartItemId,
             a.goods_count as goodsCount,
			 a.goods_id as goodsId,
			 b.goods_cover_img as goodsCoverImg,
			 b.goods_name as goodsName,
			 b.selling_price as sellingPrice
          FROM tb_newbee_mall_shopping_cart_item a INNER JOIN tb_newbee_mall_goods_info b ON a.goods_id = b.goods_id WHERE a.user_id = ${user_id} && a.is_deleted = 0;
        `
        // limit ${(pageNumber-1)*pageSize}, ${pageSize}
       let dataList = await sqlQuery( sql );
       let totalSql = `
           SELECT count(*) FROM tb_newbee_mall_shopping_cart_item a INNER JOIN tb_newbee_mall_goods_info b ON a.goods_id = b.goods_id WHERE a.user_id = ${user_id};
       `;
       const totalCount = await sqlQuery( totalSql );
       let aaa = totalCount[0]['count(*)']
       console.log("总数",totalCount[0]['count(*)'])
       const totalPage = null;
       const dataJson = {
           list:dataList,
           currPage:pageNumber,
           pageSize,
           totalCount:totalCount[0]['count(*)'],
           totalPage
       }  
       return dataJson
   },
   
   /**
    * @description: 选中购物车商品，准备预结算
    * @return {*}
    * @param {*} user_id 用户id
    * @param {*} cartItemIds 购物车商品ID
    */
   async preOrderSelectCartItem(user_id,cartItemIds){
        // 需要运用到联表查询
        let sql = `
          SELECT a.cart_item_id as cartItemId,
             a.goods_count as goodsCount,
			 a.goods_id as goodsId,
			 b.goods_cover_img as goodsCoverImg,
			 b.goods_name as goodsName,
			 b.selling_price as sellingPrice
          FROM tb_newbee_mall_shopping_cart_item a INNER JOIN tb_newbee_mall_goods_info b ON a.goods_id = b.goods_id WHERE a.user_id = ${user_id}  && cart_item_id IN (${cartItemIds});
        `
       let dataList = await sqlQuery( sql );
       return dataList
   }
   
}

module.exports = shopCartModel;
