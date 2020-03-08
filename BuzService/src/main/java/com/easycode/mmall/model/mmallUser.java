package com.easycode.mmall.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.Date;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;

@Table(name = "mmall_user")
@ApiModel(description = "用户信息")
public class mmallUser extends BasePageEntity {
    /**
     * 用户表id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 用户名
     */
    /*@NotNull(message = "用户名不能为空")*/
    @ApiModelProperty(name = "username",value = "用户名")
    private String username;

    /**
     * 用户密码，MD5加密
     */
    /*@NotNull*/
    @ApiModelProperty(name = "password",value = "用户密码")
    private String password;

    /*@NotNull(message = "邮箱不能为空")*/
    @ApiModelProperty(name = "email",value = "邮箱",required = true,dataType = "String")
    private String email;

    /*@Null*/
    @ApiModelProperty(name = "salt",value = "盐值")
    private String salt;

    /*@NotNull(message = "手机号不能为空")*/
    @ApiModelProperty(name = "phone",value = "手机号",required = true,dataType = "String")
    private String phone;

    /**
     * 找回密码问题
     */
    /*@NotNull*/
    @ApiModelProperty(name = "question",value = "找回密码问题",required = true, dataType = "String")
    private String question;

    /**
     * 找回密码答案
     */
   /* @NotNull*/
    @ApiModelProperty(name = "answer",value = "answer",required = true, dataType = "String")
    private String answer;

    /**
     * 角色0-管理员,1-普通用户
     */
    /*@Null*/
    private Integer role;

    /**
     * 创建时间
     */
    /*@Null*/
    @Column(name = "create_time")
    private Date createTime;

    /**
     * 最后一次更新时间
     */
    /*@Null*/
    @Column(name = "update_time")
    private Date updateTime;

    /**
     * 获取用户表id
     *
     * @return id - 用户表id
     */
    public Integer getId() {
        return id;
    }

    /**
     * 设置用户表id
     *
     * @param id 用户表id
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * 获取用户名
     *
     * @return username - 用户名
     */
    public String getUsername() {
        return username;
    }

    /**
     * 设置用户名
     *
     * @param username 用户名
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * 获取用户密码，MD5加密
     *
     * @return password - 用户密码，MD5加密
     */
    public String getPassword() {
        return password;
    }

    /**
     * 设置用户密码，MD5加密
     *
     * @param password 用户密码，MD5加密
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return salt
     */
    public String getSalt() {
        return salt;
    }

    /**
     * @param salt
     */
    public void setSalt(String salt) {
        this.salt = salt;
    }

    /**
     * @return phone
     */
    public String getPhone() {
        return phone;
    }

    /**
     * @param phone
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * 获取找回密码问题
     *
     * @return question - 找回密码问题
     */
    public String getQuestion() {
        return question;
    }

    /**
     * 设置找回密码问题
     *
     * @param question 找回密码问题
     */
    public void setQuestion(String question) {
        this.question = question;
    }

    /**
     * 获取找回密码答案
     *
     * @return answer - 找回密码答案
     */
    public String getAnswer() {
        return answer;
    }

    /**
     * 设置找回密码答案
     *
     * @param answer 找回密码答案
     */
    public void setAnswer(String answer) {
        this.answer = answer;
    }

    /**
     * 获取角色0-管理员,1-普通用户
     *
     * @return role - 角色0-管理员,1-普通用户
     */
    public Integer getRole() {
        return role;
    }

    /**
     * 设置角色0-管理员,1-普通用户
     *
     * @param role 角色0-管理员,1-普通用户
     */
    public void setRole(Integer role) {
        this.role = role;
    }

    /**
     * 获取创建时间
     *
     * @return create_time - 创建时间
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * 设置创建时间
     *
     * @param createTime 创建时间
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * 获取最后一次更新时间
     *
     * @return update_time - 最后一次更新时间
     */
    public Date getUpdateTime() {
        return updateTime;
    }

    /**
     * 设置最后一次更新时间
     *
     * @param updateTime 最后一次更新时间
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}