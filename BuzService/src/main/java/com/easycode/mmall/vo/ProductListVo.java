package com.easycode.mmall.vo;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ProductListVo {
  private Integer id;
  private Integer categoryId;
  private String name;
  private String subtitle;
  private String mainImage;
  private BigDecimal price;
  private Integer status;

  private String imageHost;
}
