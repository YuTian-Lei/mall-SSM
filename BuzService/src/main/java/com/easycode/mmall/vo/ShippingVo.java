package com.easycode.mmall.vo;

import javax.persistence.Column;
import lombok.Data;

/**
 * @Description: //TODO
 * @Date: 2020/4/6 15:56
 * @Author: pengfei.L
 */
@Data
public class ShippingVo {
  private String receiverName;

  private String receiverPhone;

  private String receiverMobile;

  private String receiverProvince;

  private String receiverCity;

  private String receiverDistrict;

  private String receiverAddress;

  private String receiverZip;
}
