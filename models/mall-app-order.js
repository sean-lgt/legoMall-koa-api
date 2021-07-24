
const { sqlQuery } = require('../utils/sqlQuery')

// pay_status 支付状态:0.未支付,1.支付成功,-1:支付失败
// pay_type  支付类型:0.无 1.支付宝支付 2.微信支付
// order_status 订单状态:0.待支付 1.已支付 2.配货完成 3:出库成功 4.交易成功 -1.手动关闭 -2.超时关闭 -3.商家关闭


const orderModel = {
    /**
     * @description: 生成订单号
     * @return {*}  
     * @param {*} user_id 用户id
     * @param {*} orderCode 订单编号
     */    
    async createOrder(user_id,orderCode,cartItemIds,createTime,addressId){
        // 需要先判断 生成的订单编号是否存在，如果存在则重新请求生成订单编号
        const searchSql = `
           SELECT * FROM tb_newbee_mall_order WHERE order_no='${orderCode}' && user_id = ${user_id};
        `;
        let isHavOrderCode = await sqlQuery(searchSql)
        if(isHavOrderCode.length != 0){
            //已经存在数据
            return 'alreadyExists';
        }
        //联表查询 计算总价格
        const totalSql = `
             SELECT SUM(a.goods_count * b.selling_price) as totalMoney
             FROM tb_newbee_mall_shopping_cart_item a INNER JOIN tb_newbee_mall_goods_info b ON a.goods_id = b.goods_id WHERE a.user_id = ${user_id} && cart_item_id IN (${cartItemIds});
        `;
        const total = await sqlQuery( totalSql );
        const totalMoney = total[0]['totalMoney']
        let sql = `
           INSERT INTO tb_newbee_mall_order (order_no,user_id,total_price,pay_status,pay_type,order_status,extra_info,is_deleted,create_time,update_time) VALUES ('${orderCode}',${user_id},${totalMoney},0,0,0,'',0,'${createTime}','${createTime}');
        `;
        let dataList = await sqlQuery( sql );
        const currentInsertId = dataList.insertId;
        // todo  获取到订单id后，需要将商品信息传递存储，便于后期查询 遍历 dataList.insertId
        let inserOrderItemSql = `
           SELECT a.goods_id,b.goods_name,b.goods_cover_img,b.selling_price,a.goods_count
           FROM tb_newbee_mall_shopping_cart_item a INNER JOIN tb_newbee_mall_goods_info b ON a.goods_id = b.goods_id WHERE a.user_id = ${user_id} && cart_item_id IN (${cartItemIds});
        `;

        let orderItemData =  await sqlQuery( inserOrderItemSql );
        for(let i=0;i< orderItemData.length;i++){
            let itemSql = `
                INSERT INTO tb_newbee_mall_order_item (order_id,goods_id,goods_name,goods_cover_img,selling_price,goods_count,create_time)
               VALUES(${currentInsertId},${orderItemData[i].goods_id},'${orderItemData[i].goods_name}','${orderItemData[i].goods_cover_img}','${orderItemData[i].selling_price}','${orderItemData[i].goods_count}','${createTime}')
            `;
            let inserData = await sqlQuery( itemSql )
        }
        
        let addressSql = `
            SELECT * FROM tb_newbee_mall_user_address WHERE address_id = ${addressId};
        `;
        let addressData = await sqlQuery( addressSql )
        // 需要做判断
        if(addressData.length != 0){
            let insertAddressSql = `
               INSERT INTO tb_newbee_mall_order_address (order_id,user_name,user_phone,province_name,city_name,region_name,detail_address)
                VALUES(${currentInsertId},'${addressData[0].user_name}','${addressData[0].user_phone}','${addressData[0].province_name}','${addressData[0].city_name}','${addressData[0].region_name}','${addressData[0].detail_address}')
            `;
            let insertData = await sqlQuery( insertAddressSql )
        }

        // 需要将 tb_newbee_mall_shopping_cart_item 中的购物车信息删除
        let updateShopcartSql = `
            update tb_newbee_mall_shopping_cart_item set is_deleted = 1 where cart_item_id IN (${cartItemIds});
        `
        let updateShopCart =  await sqlQuery( updateShopcartSql )


        return dataList;
    },
    /**
     * @description: 支付订单
     * @return {*}
     * @param {*} orderNo 订单编号
     * @param {*} payType 支付类型 1.支付宝支付 2.微信支付
     */    
    async payForOrder(orderNo,payType,payTime){
        let sql = `
           update tb_newbee_mall_order set pay_type=${payType}, pay_time='${payTime}',order_status= 1,update_time='${payTime}' where order_no='${orderNo}' && pay_type=0; 
        `;
        let dataList = await sqlQuery( sql );
        return dataList
    },
    /**
     * @description: 取消订单  关闭订单
     * @return {*}
     * @param {*} orderNo
     */    
    async closeOrder(orderNo,updateTime){
        let sql = `
           update tb_newbee_mall_order set order_status='-1', update_time='${updateTime}' where order_no='${orderNo}'; 
        `;
        let dataList = await sqlQuery( sql );
        return dataList
    },
    /**
     * @description: 订单列表信息
     * @return {*}
     * @param {*} user_id
     * @param {*} pageNumber
     * @param {*} pageSize
     * @param {*} orderStatus  0.待支付 1.已支付 2.配货完成 3:出库成功 4.交易成功 -1.手动关闭 -2.超时关闭 -3.商家关闭
     */    
    async getOrderList(user_id,pageNumber,pageSize,orderStatus){
        let queryCondition = ''
        if(orderStatus != null){
            queryCondition = `WHERE user_id=${user_id} && order_status=${orderStatus}`
        }else{
            queryCondition = `WHERE user_id=${user_id}`
        }
        let sql = `
            SELECT create_time as createTime,
			 order_id as orderId,
			 order_no as orderNo,
			 order_status as order_status,
			 pay_type as payType,
			 total_price as totalPrice
            FROM tb_newbee_mall_order ${queryCondition} order by create_time desc limit ${(pageNumber-1)*pageSize}, ${pageSize};
        `
       let dataList = await sqlQuery( sql );
       
       for(let i = 0;i< dataList.length;i++){
           let orderItemSql = `
                SELECT goods_count as goodsCount,
			        goods_cover_img as goodsCoverImg,
			        goods_id as goodsId,
			        selling_price as sellingPrice,
			        goods_name as goodsName
                FROM tb_newbee_mall_order_item WHERE order_id = ${dataList[i].orderId};
           `;
           let newBeeMallOrderItemVOS = await sqlQuery( orderItemSql );
           dataList[i].newBeeMallOrderItemVOS=newBeeMallOrderItemVOS;
       }

       let totalSql = `
           SELECT count(*) FROM tb_newbee_mall_order ${queryCondition};
       `;
       const totalCount = await sqlQuery( totalSql );
       let aaa = totalCount[0]['count(*)']
       console.log("总数",totalCount[0]['count(*)'])
       const totalPage = Math.ceil(totalCount[0]['count(*)']/pageSize);
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
     * @description: 获取订单详情
     * @return {*}
     * @param {*} user_id
     * @param {*} orderId
     */    
    async getOrderDetail(user_id,orderNo){
        let sql = `
            SELECT order_id as orderId,
			 order_no as orderNo,
			 total_price as totalPrice,
			 pay_status as payStatus,
			 pay_type as payType,
			 pay_time as payTime,
			 order_status as orderStatus,
			 extra_info as extraInfo,
			 create_time as createTime
           from tb_newbee_mall_order WHERE order_no=${orderNo};
        `;
        let dataList = await sqlQuery( sql );
        if(dataList.length != 0){
            let orderItemSql = `
                SELECT goods_count as goodsCount,
			        goods_cover_img as goodsCoverImg,
			        goods_id as goodsId,
			        selling_price as sellingPrice,
			        goods_name as goodsName
                FROM tb_newbee_mall_order_item WHERE order_id = ${dataList[0].orderId};
           `;
           let newBeeMallOrderItemVOS = await sqlQuery( orderItemSql );
           dataList[0].newBeeMallOrderItemVOS=newBeeMallOrderItemVOS;
        }
        return dataList
    }
}

module.exports = orderModel;