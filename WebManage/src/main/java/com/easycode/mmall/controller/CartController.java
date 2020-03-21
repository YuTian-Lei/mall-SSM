package com.easycode.mmall.controller;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.CartService;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.CartVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api("购物车")
@RestController
@RequestMapping("cart")
public class CartController {

  @Autowired
  private CartService cartService;

  @PostMapping("add")
  @ApiOperation("购物车添加商品")
  public Result<CartVo> add(HttpServletRequest request, Integer count, Integer productId) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return cartService.add(user.getId(), productId, count);
  }

  @PostMapping("update")
  @ApiOperation("更新购物车某个产品数量")
  public Result<CartVo> update(HttpServletRequest request, Integer count, Integer productId) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return cartService.update(user.getId(), productId, count);
  }

  @DeleteMapping("delete_product")
  @ApiOperation("移除购物车某个商品")
  public Result deleteProduct(HttpServletRequest request, String productIds) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return cartService.deleteProduct(user.getId(), productIds);
  }

  @PostMapping("list")
  @ApiOperation("购物车商品列表")
  public Result<CartVo> list(HttpServletRequest request) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return cartService.list(user.getId());
  }

  @PostMapping("select_all")
  @ApiOperation("购物车全选")
  public Result<CartVo> selectAll(HttpServletRequest request) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return cartService.selectOrUnSelect(user.getId(), null, CONST.Cart.CHECKED);
  }

  @PostMapping("un_select_all")
  @ApiOperation("购物车取消全选")
  public Result<CartVo> unSelectAll(HttpServletRequest request) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return cartService.selectOrUnSelect(user.getId(), null, CONST.Cart.UN_CHECKED);
  }

  @PostMapping("select")
  @ApiOperation("购物车选中某个商品")
  public Result<CartVo> select(HttpServletRequest request, Integer productId) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return cartService.selectOrUnSelect(user.getId(), productId, CONST.Cart.CHECKED);
  }

  @PostMapping("un_select")
  @ApiOperation("购物车取消选中某个商品")
  public Result<CartVo> unSelectA(HttpServletRequest request, Integer productId) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("请登录", ResultCode.NEED_LOGIN);
    }
    return cartService.selectOrUnSelect(user.getId(), productId, CONST.Cart.UN_CHECKED);
  }

  @PostMapping("get_cart_product_count")
  @ApiOperation("查询在购物车里的产品数量")
  public Result<Integer> getCartProductCount(HttpServletRequest request) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genSuccessResult(0);
    }
    return cartService.getCartProductCount(user.getId());
  }
}
