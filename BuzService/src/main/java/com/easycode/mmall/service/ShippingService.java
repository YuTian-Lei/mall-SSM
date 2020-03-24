package com.easycode.mmall.service;
import com.easycode.mmall.model.Shipping;
import com.easycode.mmall.core.Service;
import com.easycode.mmall.utils.Result;
import com.github.pagehelper.PageInfo;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
public interface ShippingService extends Service<Shipping> {
  Result add(Integer userId,Shipping shipping);
  Result del(Integer userId,Integer shippingId);
  Result update(Integer userId,Shipping shipping);
  Result<Shipping> select(Integer userId,Integer shippingId);
  Result<PageInfo> list(Integer userId,int pageNum,int pageSize);
}
