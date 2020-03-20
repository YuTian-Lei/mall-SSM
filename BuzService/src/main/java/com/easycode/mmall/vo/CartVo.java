package com.easycode.mmall.vo;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class CartVo {

  private List<CartProductVo> cartProductVoList;
  private BigDecimal cartTotalPrice;
  private Boolean allChecked;//是否全部勾选
  private String imageHost;
}
