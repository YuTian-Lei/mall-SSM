package com.easycode.mmall.web.manageController;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.OrderService;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.Result;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description: //TODO
 * @Date: 2020/4/6 20:41
 * @Author: pengfei.L
 */

@RestController
@RequestMapping("/manage/order")
public class OrderManageController {

  @Autowired
  private UserService userService;

  @Autowired
  private OrderService orderService;

  @GetMapping("list")
  public Result orderList(HttpServletRequest request,@RequestParam(value = "pageNum",defaultValue = "1") int pageNum, @RequestParam(value = "pageSize",defaultValue = "10")int pageSize){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //填充增加产品的业务逻辑
      return  orderService.manageList(pageNum,pageSize);

    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }


  @GetMapping("detail")
  public Result orderDetail(HttpServletRequest request,Long orderNo){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //填充增加产品的业务逻辑
      return  orderService.manageDetail(orderNo);

    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }

  @GetMapping("search")
  public Result ordersearch(HttpServletRequest request,Long orderNo,@RequestParam(value = "pageNum",defaultValue = "1") int pageNum, @RequestParam(value = "pageSize",defaultValue = "10")int pageSize){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //填充增加产品的业务逻辑
      return  orderService.manageSearch(orderNo,pageNum,pageSize);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }




  @GetMapping("send_goods")
  public Result<String> orderSendGoods(HttpServletRequest request,Long orderNo){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //填充增加产品的业务逻辑
      return  orderService.manageSendGoods(orderNo);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }
}
