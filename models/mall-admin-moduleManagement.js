
const { sqlQuery } = require('../utils/sqlQuery')

const indexConfigModel = {

    
    /**
     * @description: 获取分类管理数据
     * @return {*}
     * @param {*} pageNumber 页码
     * @param {*} pageSize 每页数量
     * @param {*} parentId 父亲id
     * @param {*} categoryLevel 层级
     */
    async getCategoriesModule(pageNumber,pageSize,parentId,categoryLevel){
        let sql = `
          SELECT category_id as categoryId,
			 category_level as categoryLevel,
			 category_name as categoryName,
			 category_rank as categoryRank,
			 create_time as createTime,
			 create_user as createUser,
			 parent_id as parentId,
			 update_time as updateTime,
			 update_user as updateUser
           FROM tb_newbee_mall_goods_category WHERE parent_id = ${parentId} && category_level = ${categoryLevel} limit ${(pageNumber-1)*pageSize}, ${pageSize}; 
        `
       let dataList = await sqlQuery( sql );
       let totalSql = `
            SELECT COUNT(*) FROM tb_newbee_mall_goods_category WHERE parent_id = ${parentId} && category_level = ${categoryLevel};
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
     * @description: 获取商品详细信息
     * @return {*}
     * @param {*} admin_user_id
     * @param {*} categoryId
     */    
    async getCategoryDetail(admin_user_id,categoryId){
        let sql = `
         SELECT category_id as categoryId,
			 category_level as categoryLevel,
			 category_name as categoryName,
			 category_rank as categoryRank,
			 create_time as createTime,
			 create_user as createUser,
			 parent_id as parentId,
			 update_time as updateTime,
			 update_user as updateUser
           FROM tb_newbee_mall_goods_category WHERE  category_id = ${categoryId};   
        `;
        let dataList = await sqlQuery( sql );
        return dataList
    },
    /**
     * @description: 修改分类管理数据 (商品名称及排序值)
     * @return {*}
     * @param {*} categoryId 分类的id
     * @param {*} categoryName 分类的名称
     * @param {*} categoryRank 分类的排序值
     */    
    async updateCategoriesById(categoryId,categoryName,categoryRank){
        const sql = `
             UPDATE tb_newbee_mall_goods_category SET category_name = '${categoryName}',category_rank = ${categoryRank} WHERE category_id = ${categoryId};
        `;
        let dataList = await sqlQuery( sql );
        return dataList;
    },
    /**
     * @description: 新增商品分类
     * @return {*}
     * @param {*} parentId 父级id
     * @param {*} categoryLevel 商品分类的层级
     * @param {*} categoryRank 排序值
     * @param {*} categoryName 分类名称
     */    
    async addCategory(parentId,categoryLevel,categoryRank,categoryName){
        //得先判断是否已经存在
        const searchSql = `
            SELECT * from tb_newbee_mall_goods_category WHERE parent_id = ${parentId} && category_level = ${categoryLevel} && category_name = '${categoryName}';
        `;
        let isHavCategoryName = await sqlQuery(searchSql)
        if(isHavCategoryName.length != 0){
            //已经存在数据
            return 'alreadyExists';
        }
        const sql = `
            INSERT INTO tb_newbee_mall_goods_category(category_name,category_rank,parent_id,category_level) VALUES('${categoryName}',${categoryRank},${parentId},${categoryLevel})
        `;
       let dataList = await sqlQuery(sql)
       return dataList
    },

    /**
     * @description: 删除分类管理
     * @return {*}
     * @param {*} categoryId 分类ID
     */
    async deleteCategory(admin_user_id,ids,updateTime){
         const idList = ids.join(',')
        const sql = `
            update tb_newbee_mall_goods_category set is_deleted='1',update_user='${admin_user_id}',update_time='${updateTime}' where category_id in (${idList});
        `;
        let dataList = await sqlQuery( sql );
        return dataList;
    },
    /**
     * @description: 批量删除分类管理
     * @return {*}
     * @param {*} categoryIdList
     */    
    async batchDeleteCategory(categoryIdList){
        let errList = [];
        for(let i = 0;i<categoryIdList.length;i++){
             let sql = `
                  delete from tb_newbee_mall_goods_category where category_id = ${categoryId};
             `;
             let dataList = await sqlQuery( sql );
             if(dataList&&dataList.affectedRows !== 1){
                 //删除失败
                 errList.push(categoryIdList[i]);
             }
        }
        if(errList.length !== 0){
            return {
                sucess:false,
                errList:errList.join(',')
            }
        }else{
             return {
                sucess:true,
                errList:''
            }
        }
    },
    /**
     * @description: 获取商品列表
     * @return {*}
     * @param {*} pageNumber 页码
     * @param {*} pageSize 页数
     */    
    async getGoodsList(pageNumber,pageSize){
        let sql = `
         SELECT create_time as createTime,
			 create_user as createUser,
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
          FROM tb_newbee_mall_goods_info limit ${(pageNumber-1)*pageSize}, ${pageSize}; 
        `;
       let dataList = await sqlQuery( sql );
       let totalSql = `
            SELECT COUNT(*) FROM tb_newbee_mall_goods_info;
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
     * @description: 获取用户列表
     * @return {*}
     * @param {*} pageNumber 页码
     * @param {*} pageSize  页数
     */    
    async getUserList(pageNumber,pageSize){
        let sql = `
          SELECT create_time as createTime,
			 introduce_sign as introduceSign,
			 is_deleted as isDeleted,
			 locked_flag as lockedFlag,
			 login_name as loginName,
			 nick_name as nickName,
			 password_md5 as passwordMd5,
			 user_id as userId
          FROM tb_newbee_mall_user limit ${(pageNumber-1)*pageSize}, ${pageSize}; 
        `;
       let dataList = await sqlQuery( sql );
       let totalSql = `
            SELECT COUNT(*) FROM tb_newbee_mall_user;
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
     * @description: 更新用户禁用信息
     * @return {*}
     * @param {*} type Dismiss 解除禁用 Disable禁用
     * @param {*} ids 数组id
     */    
    async updateUser(type,ids){
        let errList = [];
        const flag = type == 'Dismiss' ? 1:0;
        // UPDATE my_user SET user_password = 'AAABBB' WHERE user_name IN ('sean003','张三三','aaa');  --批量修改 where in 
         const arrId = ids.join(',')
         let sql = `
                UPDATE tb_newbee_mall_user SET locked_flag = ${flag} WHERE user_id in (${arrId});
             `;
        let dataList = await sqlQuery( sql );
        
        return dataList
    },
    /**
     * @description: 获取订单列表数据
     * @return {*}
     * @param {*} pageNumber 页码
     * @param {*} pageSize 页数
     * @param {*} orderNo 订单编号
     * @param {*} orderStatus 订单状态
     */
    async getOrdersList(pageNumber,pageSize,orderNo,orderStatus){
        let sql = '';
        let totalSql='';
        if(orderNo == null && orderStatus == null){
            //无携带参数
            sql = `
                SELECT create_time as createTime,
                  extra_info as extraInfo,
			      is_deleted as isDeleted,
			      order_id as orderId,
			      order_no as orderNo,
			      order_status as orderStatus,
			      pay_status as payStatus,
			      pay_time as payTime,
			      pay_type as payType,
			      total_price as totalPrice,
			      update_time as updateTime,
			      user_id as userId
                FROM tb_newbee_mall_order limit ${(pageNumber-1)*pageSize}, ${pageSize};
            `;
            totalSql = `
                SELECT COUNT(*) FROM tb_newbee_mall_order;
            `;
        }else if(orderNo == null && orderStatus != null){
            sql = `
                SELECT create_time as createTime,
                  extra_info as extraInfo,
			      is_deleted as isDeleted,
			      order_id as orderId,
			      order_no as orderNo,
			      order_status as orderStatus,
			      pay_status as payStatus,
			      pay_time as payTime,
			      pay_type as payType,
			      total_price as totalPrice,
			      update_time as updateTime,
			      user_id as userId
                FROM tb_newbee_mall_order WHERE order_status = ${orderStatus} limit ${(pageNumber-1)*pageSize}, ${pageSize};
            `;
            totalSql = `
                SELECT COUNT(*) FROM tb_newbee_mall_order WHERE order_status = ${orderStatus};
            `;
        }else if(orderNo != null && orderStatus == null){
             sql = `
                SELECT create_time as createTime,
                  extra_info as extraInfo,
			      is_deleted as isDeleted,
			      order_id as orderId,
			      order_no as orderNo,
			      order_status as orderStatus,
			      pay_status as payStatus,
			      pay_time as payTime,
			      pay_type as payType,
			      total_price as totalPrice,
			      update_time as updateTime,
			      user_id as userId
                FROM tb_newbee_mall_order WHERE order_no = '${orderNo}' limit ${(pageNumber-1)*pageSize}, ${pageSize};
            `;
            totalSql = `
                SELECT COUNT(*) FROM tb_newbee_mall_order WHERE order_no = '${orderNo}';
            `;
        }else if(orderNo != null && orderStatus != null){
            sql = `
                SELECT create_time as createTime,
                  extra_info as extraInfo,
			      is_deleted as isDeleted,
			      order_id as orderId,
			      order_no as orderNo,
			      order_status as orderStatus,
			      pay_status as payStatus,
			      pay_time as payTime,
			      pay_type as payType,
			      total_price as totalPrice,
			      update_time as updateTime,
			      user_id as userId
                FROM tb_newbee_mall_order WHERE order_no = '${orderNo}' && order_status = ${orderStatus} limit ${(pageNumber-1)*pageSize}, ${pageSize};
            `;
            totalSql = `
                SELECT COUNT(*) FROM tb_newbee_mall_order WHERE order_no = '${orderNo}' && order_status = ${orderStatus};
            `;
        }
        let dataList = await sqlQuery( sql );
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
     * @description: 关闭订单信息
     * @return {*}
     * @param {*} ids
     */    
    async closeOrders(ids){
        const idList = ids.join(',')
        const sql = `
             UPDATE tb_newbee_mall_order set order_status = '-1' WHERE order_id in (${idList});
        `;
        const data = await sqlQuery( sql );
        if(data&&data.affectedRows == 0){
            return false;
        }
        return true;
    },
    /**
     * @description: 订单配货完成操作
     * @return {*}
     * @param {*} ids
     */      
    async checkDoneOrders(ids){
        const idList = ids.join(',')
        const sql = `
             UPDATE tb_newbee_mall_order set order_status = '2' WHERE order_id in (${idList});
        `;
        const data = await sqlQuery( sql );
        if(data && data.affectedRows == 0){
            return false;
        }
        return true;
    },
     /**
      * @description: 出货成功操作
      * @return {*}
      * @param {*} ids
      */    
     async checkOutOrders(ids){
        const idList = ids.join(',')
        const sql = `
             UPDATE tb_newbee_mall_order set order_status = '3' WHERE order_id in (${idList});
        `;
        const data = await sqlQuery( sql );
        if(data && data.affectedRows == 0){
            return false;
        }
        return true;
    },
    /**
     * @description: 查询订单详情
     * @return {*}
     * @param {*} orderId 订单ID
     */
    async getOrderDetail(orderId){
        const orderSql = `
             SELECT create_time as createTime,
                  extra_info as extraInfo,
			      is_deleted as isDeleted,
			      order_id as orderId,
			      order_no as orderNo,
			      order_status as orderStatus,
			      pay_status as payStatus,
			      pay_time as payTime,
			      pay_type as payType,
			      total_price as totalPrice,
			      update_time as updateTime,
			      user_id as userId
            FROM tb_newbee_mall_order WHERE order_id = ${orderId};
        `;
        const orderItem = `
            SELECT goods_count as goodsCount,
			    goods_cover_img as goodsCoverImg,
			    goods_id as goodsId,
			    goods_name as goodsName,
			    selling_price as sellingPrice
            FROM tb_newbee_mall_order_item WHERE order_id= ${orderId};
        `;
        const orderInfo = await sqlQuery( orderSql );
        const orderDetail = await sqlQuery( orderItem );
        let dataJson = orderInfo[0];
        dataJson.OrderItemVOS = orderDetail;
        return dataJson;
    }

}

module.exports = indexConfigModel;