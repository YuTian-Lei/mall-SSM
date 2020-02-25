package com.easycode.mmall.utils;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang3.builder.ToStringBuilder;

/**
 * @author lpf
 * @version 1.0
 * @ClassName: JsonResult
 * @Description: json返回结果处理类
 */
@XmlRootElement(name = "jsonResult")
public class JsonResult implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private static final int OK = 1;

    private static final int FAIL = 0;

    /**
     * 默认是成功的
     * resultCode : 0-失败,1-成功
     * data:传到前台的数据
     * url:需要跳转的URI
     * message:成功的消息,如果要显示的话
     * errormsg:失败的消息
     * errorCode:失败代码,用于restAPI
     * validateFlag:前台校验
     */
    private int resultCode = 1;
    private Map<String, Object> data;
    private String url;
    private String message;
    private String errormsg;
    private String errorCode;
    private boolean validateFlag;

    public JsonResult() {
    }

    public JsonResult(int resultCode) {
        this.resultCode = resultCode;
    }

    public JsonResult(int resultCode, String message) {
        this.resultCode = resultCode;
        this.message = message;
    }


    public JsonResult(int resultCode, String errorCode, String errormsg) {
        this.resultCode = resultCode;
        this.errormsg = errormsg;
        this.errorCode = errorCode;
    }

    /**
     * 创建失败返回结果
     */
    public static JsonResult buildFailureJsonResult() {
        return new JsonResult(FAIL);
    }

    /**
     * 创建失败返回结果
     */
    public static JsonResult buildFailureJsonResult(String message) {
        return new JsonResult(FAIL, message);
    }

    /**
     * 创建失败返回结果
     */
    public static JsonResult buildFailureJsonResult(int resultCode, String message) {
        return new JsonResult(resultCode, message);
    }

    /**
     * 创建成功返回结果
     */
    public static JsonResult buildSuccessJsonResult() {
        return new JsonResult(OK);
    }

    /**
     * 创建成功返回结果
     */
    public static JsonResult buildSuccessJsonResult(String message) {
        return new JsonResult(OK, message);
    }

    /**
     * 创建成功返回结果
     */
    public static JsonResult buildSuccessJsonResult(int resultCode, String message) {
        return new JsonResult(resultCode, message);
    }

    public int getResultCode() {
        return resultCode;
    }

    public void setResultCode(int resultCode) {
        this.resultCode = resultCode;
    }

    public Map<String, Object> getData() {
        return data;
    }

    /**
     * 设置时间处理
     */
    public void setData(String key, Object value) {
        if (null == this.data) {
            this.data = new HashMap<String, Object>();
        }
        this.data.put(key, value);
    }

    public void setData(Map map) {
        data = map;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrormsg() {
        return errormsg;
    }

    public void setErrormsg(String errormsg) {
        this.errormsg = errormsg;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isValidateFlag() {
        return validateFlag;
    }

    public void setValidateFlag(boolean validateFlag) {
        this.validateFlag = validateFlag;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * 转换成string类型
     */
    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}

