package com.easycode.mmall.vo;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class CartProductVo {

  private Integer id;
  private Integer userId;
  private Integer productId;
  private Integer quantity;//购物车中此商品的数量
  private String productName;
  private String productSubtitle;
  private String productMainImage;
  private BigDecimal productPrice;
  private Integer productStatus;
  private BigDecimal productTotalPrive;
  private Integer productStock;
  private Integer productChecked;//此商品是否勾选

  private String limitQuantity;//限制数量的一个返回结果
}
