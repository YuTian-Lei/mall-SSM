package com.easycode.mmall.service;
import com.easycode.mmall.core.Service;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.vo.CartVo;
import com.easycode.mmall.model.Cart;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
public interface CartService extends Service<Cart> {

  Result<CartVo> add(Integer userId,Integer productId,Integer count);
  Result<CartVo> update(Integer userId,Integer productId,Integer count);
  Result<CartVo> deleteProduct(Integer userId,String productIds);
  Result<CartVo> list (Integer userId);
  Result<CartVo> selectOrUnSelect(Integer userId,Integer productId,Integer checked);
  Result<Integer> getCartProductCount(Integer userId);
}
