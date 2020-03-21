package com.easycode.mmall.dao;

import com.easycode.mmall.core.Mapper;
import com.easycode.mmall.model.Cart;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface CartMapper extends Mapper<Cart> {

  int deleteByUserIdProductIds(@Param("userId") Integer userId, @Param("productIdList") List<String> productIdList);

  int checkedOrUncheckedProduct(@Param("userId") Integer userId,@Param("productId") Integer productId,@Param("checked") Integer checked);

  int selectCartProductCount(Integer userId);
}