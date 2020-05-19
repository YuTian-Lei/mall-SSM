package com.easycode.mmall.controller;

import com.easycode.mmall.vo.ProductDetailVo;
import com.easycode.mmall.service.ProductService;
import com.easycode.mmall.utils.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(value = "用户产品控制器",description = "用户产品")
@RestController
@RequestMapping("product")
public class ProductController {

  @Autowired
  private ProductService productService;

  @GetMapping("detail")
  @ApiOperation(value = "产品详情",notes = "产品详情")
  public Result<ProductDetailVo> detail(Integer productId) {
    return productService.getProductDetail(productId);
  }

  @GetMapping("list")
  @ApiOperation(value = "产品列表",notes = "产品列表")
  public Result list(@RequestParam(value = "keyword", required = false) String keyword,
      @RequestParam(value = "categoryId", required = false) Integer categoryId,
      @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
      @RequestParam(value = "orderBy", defaultValue = "") String orderBy) {
      return productService.getProductByKeywordCategory(keyword,categoryId,pageNum,pageSize,orderBy);
  }
}
