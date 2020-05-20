package com.easycode.mmall.web.controller;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.model.Shipping;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.ShippingService;
import com.easycode.mmall.utils.Result;
import com.github.pagehelper.PageInfo;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author lpf
 * @Description: //TODO(描述这个类的作用)
 * @date 2020/3/24 14:12
 */
@RestController
@RequestMapping("shipping")
public class ShippingController {
  @Autowired
  private ShippingService shippingService;

  @PostMapping("add")
  public Result add(HttpServletRequest request, Shipping shipping){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return shippingService.add(user.getId(),shipping);
  }

  @PostMapping("del")
  public Result del(HttpServletRequest request, Integer shippingId){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return shippingService.del(user.getId(),shippingId);
  }


  @PostMapping("update")
  public Result update(HttpServletRequest request, Shipping shipping){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return shippingService.update(user.getId(),shipping);
  }

  @GetMapping("select")
  public Result<Shipping> select(HttpServletRequest request, Integer shippingId){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return shippingService.select(user.getId(),shippingId);
  }

  @GetMapping("list")
  public Result<PageInfo> list(@RequestParam(value = "pageNum",defaultValue = "1") int pageNum,
      @RequestParam(value = "pageSize",defaultValue = "10")int pageSize,HttpServletRequest request){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return shippingService.list(user.getId(),pageNum,pageSize);
  }
}
