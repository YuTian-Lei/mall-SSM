package com.easycode.mmall.service;
import com.easycode.mmall.model.Order;
import com.easycode.mmall.core.Service;
import com.easycode.mmall.utils.Result;
import com.github.pagehelper.PageInfo;
import java.util.Map;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
public interface OrderService extends Service<Order> {

  Result pay(Long orderNo,Integer userId,String path);

  Result aliCallback(Map<String,String> params);

  Result queryOrderPayStatus(Integer userId,Long orderNo);

  Result createOrder(Integer userId,Integer shippingId);

  Result cancel(Integer userId,Long orderNo);

  Result getOrderCartProduct(Integer userId);

  Result getOrderDetail(Integer userId,Long orderNo);

  Result<PageInfo> getOrderList(Integer userId, int pageNum, int pageSize);

  Result manageList(int pageNum,int pageSize);

  Result manageDetail(Long orderNo);

  Result<PageInfo> manageSearch(Long orderNo,int pageNum,int pageSize);

  Result<String> manageSendGoods(Long orderNo);
}
