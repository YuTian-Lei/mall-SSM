package com.easycode.mmall.controller;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.OrderService;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author lpf
 * @Description: //TODO(描述这个类的作用)
 * @date 2020/3/29 16:36
 */
@RestController
@RequestMapping("order")
public class OrderController {
    @Autowired
    private OrderService orderService;



   /**
    * @Description //TODO
    * @Param
    * @Return
    * @Date: 2020/3/29 17:36
    * @Author: pengfei.L
    */
    public Result pay(HttpServletRequest request,Long orderNo){
      User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
      if (user == null) {
        return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
      }
      String path = request.getSession().getServletContext().getRealPath("upload");
      return  orderService.pay(orderNo,user.getId(),path);
    }
}
