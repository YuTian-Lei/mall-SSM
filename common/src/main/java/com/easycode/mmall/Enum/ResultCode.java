package com.easycode.mmall.Enum;

/**
 * 响应码枚举，参考HTTP状态码的语义
 *
 * @author lpf
 */
public enum ResultCode {
  /**
   * 成功
   */
  SUCCESS(200),
  /**
   * 失败
   */
  FAIL(400),
  /**
   * 未认证（签名错误）
   */
  UNAUTHORIZED(401),

  TOKENEXPIRED(402),

  NOTOKEN(405),

  INVALID(403),

  CODE_EXPIRED(406),

  CODE_INVALID(407),
  /**
   * 接口不存在
   */
  NOT_FOUND(404),
  /**
   * 服务器内部错误
   */
  INTERNAL_SERVER_ERROR(500),

  UNAUTHEN(4401),

  UNAUTHZ(4403),

  SHIRO_ERR(4444),

  /**
   * 未注册
   */
  UNREGISTER(4405),
  NEED_LOGIN(4406),
  ILLEGAL_ARGUMENT(4407);

  private final int code;

  ResultCode(int code) {
    this.code = code;
  }

  public int getCode() {
    return code;
  }

  public static ResultCode getValue(int code) {
    for (ResultCode resultCode : values()) {
      if (resultCode.code == code) {
        return resultCode;
      }
    }
    return null;
  }
}
