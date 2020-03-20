package com.easycode.mmall.controller;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.CartService;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.CartVo;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CartController {

  @Autowired
  private CartService cartService;


  public Result<CartVo> add(HttpServletRequest request, Integer count,Integer productId){
     User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
     if(user == null){
       return ResultGenerator.genFailResult("请登录",ResultCode.NEED_LOGIN);
     }
     return  cartService.add(user.getId(),productId,count);
  }
}
