package com.easycode.mmall.vo;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

/**
 * @Description: //TODO
 * @Date: 2020/4/6 15:50
 * @Author: pengfei.L
 * @Version: 1.0
 */
@Data
public class OrderVo {
  private Long orderNo;

  private BigDecimal payment;

  private Integer paymentType;

  private  String paymentTypeDesc;

  private Integer postage;

  private Integer status;

  private String statusDesc;

  private String paymentTime;

  private String sendTime;

  private String endTime;

  private String closeTime;

  private String createTime;

  //订单明细
  private List<OrderItemVo> orderItemVoList;

  private String imageHost;
  private Integer shippingId;
  private String receieverName;

  private ShippingVo  shippingVo;
}
