package com.easycode.mmall.controller;

import com.alipay.api.AlipayApiException;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.demo.trade.config.Configs;
import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.OrderService;
import com.easycode.mmall.utils.Result;
import com.google.common.collect.Maps;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author lpf
 * @Description: //TODO(描述这个类的作用)
 * @date 2020/3/29 16:36
 */
@Slf4j
@RestController
@RequestMapping("order")
public class OrderController {
    @Autowired
    private OrderService orderService;


  @PostMapping("create")
  @ApiOperation(value = "创建订单", notes = "创建订单")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "shippingId", value = "收获地址", required = true, paramType = "int")
  })
  public Result create(HttpServletRequest request,Integer shippingId){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return  orderService.createOrder(user.getId(),shippingId);
  }


  @PostMapping("cancel")
  @ApiOperation(value = "取消订单", notes = "取消订单")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "orderNo", value = "订单号", required = true, paramType = "long")
  })
  public Result cancel(HttpServletRequest request,Long orderNo){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return  orderService.cancel(user.getId(),orderNo);
  }



  @PostMapping("get_order_cart_product")
  @ApiOperation(value = "获取购物车选中商品", notes = "获取购物车选中商品")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "orderNo", value = "订单号", required = true, paramType = "long")
  })
  public Result getOrderCartProduct(HttpServletRequest request,Long orderNo){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return  orderService.getOrderCartProduct(user.getId());
  }


  @PostMapping("detail")
  @ApiOperation(value = "订单详情", notes = "订单详情")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "orderNo", value = "订单号", required = true, paramType = "long")
  })
  public Result detail(HttpServletRequest request,Long orderNo){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return  orderService.getOrderDetail(user.getId(),orderNo);
  }


  @PostMapping("list")
  @ApiOperation(value = "订单列表", notes = "订单列表")
  public Result list(HttpServletRequest request,@RequestParam(value = "pageNum",defaultValue = "1") int pageNum, @RequestParam(value = "pageSize",defaultValue = "10")int pageSize){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return  orderService.getOrderList(user.getId(),pageNum,pageSize);
  }




   /**
    * @Description //TODO
    * @Param
    * @Return
    * @Date: 2020/3/29 17:36
    * @Author: pengfei.L
    */
   @RequestMapping("pay")
   @ApiOperation(value = "支付接口", notes = "支付接口")
   @ApiImplicitParams({
       @ApiImplicitParam(name = "orderNo", value = "订单号", required = true, paramType = "long")
   })
    public Result pay(HttpServletRequest request,Long orderNo){
      User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
      if (user == null) {
        return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
      }
      String path = request.getSession().getServletContext().getRealPath("upload");
      return  orderService.pay(orderNo,user.getId(),path);
    }

    @RequestMapping("alipay_callback")
    public Object alipayCallback(HttpServletRequest request){
        Map<String,String> params = Maps.newHashMap();
        Map requestParams = request.getParameterMap();
        requestParams.forEach((k,v)->{
            String[] values = (String[])v;
            String valueStr = "";
            for(int i = 0; i < values.length; i++){
              valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
            }
            params.put((String)k,valueStr);
        });
        log.info("支付宝回调,sign:{},trade_status:{},参数:{}",params.get("sign"),params.get("trade_status"),params.toString());

        //验证签名,避免重复通知
      params.remove("sign_type");
      try {
        boolean alipayRSACheckedV2 = AlipaySignature.rsaCheckV2(params, Configs.getAlipayPublicKey(),"utf-8", Configs.getSignType());
        if(!alipayRSACheckedV2){
          return ResultGenerator.genFailResult("非法请求，验证不通过");
        }


      } catch (AlipayApiException e) {
        log.error("支付宝验证回调异常",e);
      }

      //todo 验证各种数据

      Result result = orderService.aliCallback(params);
      if(result.getCode() == ResultCode.SUCCESS.getCode()){
        return CONST.AlipayCallBack.RESPONSE_SUCCESS;
      }
      return CONST.AlipayCallBack.RESPONSE_FAILED;
    }

  @RequestMapping("query_order_pay_status")
  @ApiOperation(value = "查询订单状态", notes = "查询订单状态")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "orderNo", value = "订单号", required = true, paramType = "long")
  })
  public Result<Boolean> queryOrderPayStatus(HttpServletRequest request,Long orderNo){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    Result result = orderService.queryOrderPayStatus(user.getId(),orderNo);
    if(result.getCode() == ResultCode.SUCCESS.getCode()){
      return  ResultGenerator.genSuccessResult(true);
    }
    return ResultGenerator.genSuccessResult(false);
  }
}
