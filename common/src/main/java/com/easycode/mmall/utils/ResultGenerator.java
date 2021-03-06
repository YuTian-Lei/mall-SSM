package com.easycode.mmall.utils;

import com.easycode.mmall.Enum.ResultCode;

/**
 * 响应结果生成工具
 * @author lpf
 */
public class ResultGenerator {
    private static final String DEFAULT_SUCCESS_MESSAGE = "SUCCESS";
    private static final String DEFAULT_FAIL_MESSAGE = "FAIL";

    public static Result genSuccessResult() {
        return new Result()
                .setCode(ResultCode.SUCCESS)
                .setMessage(DEFAULT_SUCCESS_MESSAGE);
    }

    public static Result genSuccessResult(String message) {
        return new Result()
            .setCode(ResultCode.SUCCESS)
            .setMessage(message);
    }

    public static <T> Result<T> genSuccessResult(T data) {
        return new Result()
                .setCode(ResultCode.SUCCESS)
                .setMessage(DEFAULT_SUCCESS_MESSAGE)
                .setData(data);
    }

    public static <T> Result<T> genSuccessResult(String message,T data) {
        return new Result()
            .setCode(ResultCode.SUCCESS)
            .setMessage(message)
            .setData(data);
    }


    public static Result genFailResult() {
        return new Result()
            .setCode(ResultCode.FAIL)
            .setMessage(DEFAULT_FAIL_MESSAGE);
    }

    public static Result genFailResult(String message) {
        return new Result()
                .setCode(ResultCode.FAIL)
                .setMessage(message);
    }

    public static Result genFailResult(String message,ResultCode code) {
        return new Result()
                .setCode(code)
                .setMessage(message);
    }
}
