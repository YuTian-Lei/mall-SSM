package com.easycode.mmall.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Data;

/**
 * @author lpf
 */
@Data
@ApiModel(description = "注册信息")
public class RegisterVO {
  @NotEmpty
  @ApiModelProperty(value = "用户名")
  private String username;

  @NotEmpty
  @Size(min = 6,max = 20,message = "密码长度须在6-20之间")
  @ApiModelProperty(value = "密码")
  private String password;

  @NotEmpty(message = "phone不能为空")
  @ApiModelProperty(value = "手机号")
  private String phone;

  @NotEmpty(message = "email不能为空")
  @ApiModelProperty(value = "邮箱")
  private String email;

  @NotEmpty(message = "问题不能为空")
  @ApiModelProperty(value = "问题")
  private String question;

  @NotEmpty(message = "答案不能为空")
  @ApiModelProperty(value = "答案")
  private String answer;
}
