package com.easycode.mmall.vo;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

/**
 * @Description: //TODO
 * @Date: 2020/4/6 17:43
 * @Author: pengfei.L
 */
@Data
public class OrderProductVo {
  private List<OrderItemVo> orderItemVoList;
  private BigDecimal productTotalPrice;
  private String imageHost;
}
