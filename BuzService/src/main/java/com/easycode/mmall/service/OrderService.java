package com.easycode.mmall.service;
import com.easycode.mmall.model.Order;
import com.easycode.mmall.core.Service;
import com.easycode.mmall.utils.Result;
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
}
