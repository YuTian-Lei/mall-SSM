package com.easycode.mmall.vo;

import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

/**
 * @Description: //TODO
 * @Date: 2020/4/6 15:53
 * @Author: pengfei.L
 * @Version: 1.0
 */
@Data
public class OrderItemVo {

  private Long orderNo;

  private Integer productId;

  private String productName;

  private String productImage;

  private BigDecimal currentUnitPrice;

  private Integer quantity;

  private BigDecimal totalPrice;

  private String createTime;
}
