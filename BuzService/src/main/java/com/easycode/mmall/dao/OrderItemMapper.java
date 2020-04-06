package com.easycode.mmall.dao;

import com.easycode.mmall.core.Mapper;
import com.easycode.mmall.model.OrderItem;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface OrderItemMapper extends Mapper<OrderItem> {
  void batchInsert(@Param("orderItemList") List<OrderItem> orderItemList);
}