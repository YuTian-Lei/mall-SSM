package com.easycode.mmall.service;
import com.easycode.mmall.model.Cart;
import com.easycode.mmall.core.Service;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.vo.CartVo;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
public interface CartService extends Service<Cart> {

  Result<CartVo> add(Integer userId,Integer productId,Integer count);
}
