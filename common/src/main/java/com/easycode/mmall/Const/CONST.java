package com.easycode.mmall.Const;

import com.google.common.collect.Sets;
import java.util.Set;

public class CONST {
  public static final String CURRENT_USER = "currentUser";
  public static final String EMAIL = "email";
  public static final String USERNAME = "username";

  public interface ROLE {
    int ROLE_CUSTOMER = 0;//普通用戶
    int ROLE_ADMIN = 1;//管理員
  }


  public enum ProductStatusEnum {
    /**
     *  商品在售
     * */
    ON_SALE(1, "在线");

    private String value;
    private int code;

    ProductStatusEnum(int code, String value) {
      this.value = value;
      this.code = code;
    }

    public String getValue() {
      return value;
    }

    public int getCode() {
      return code;
    }
  }

  public interface  ProductListOrderBy{
    Set<String> PRICE_ASC_DESC = Sets.newHashSet("price_desc","price_asc");
  }

}
