package com.easycode.mmall.web.utils;

import org.apache.commons.lang3.StringUtils;
import org.springframework.ui.ModelMap;

public class ReturnUtils {

    public static ModelMap Success(String msg, Object obj, String referer) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "操作成功" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 1);
        mp.put("state", "success");
        mp.put("msg", msg);
        mp.put("referer", referer);
        mp.put("result", obj);
        return mp;
    }


    public static ModelMap Success(String msg, Object obj) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "操作成功" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 1);
        mp.put("state", "success");
        mp.put("msg", msg);
        mp.put("referer", null);
        mp.put("result", obj);
        return mp;
    }
    public static ModelMap Success(String msg) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "操作成功" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 1);
        mp.put("state", "success");
        mp.put("msg", msg);
        mp.put("referer", null);
        mp.put("result", null);
        return mp;
    }
    public static ModelMap empty(String msg, Object obj, String referer) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "暂无数据" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 2);
        mp.put("state", "empty");
        mp.put("msg", msg);
        mp.put("referer", referer);
        mp.put("result", obj);
        return mp;
    }

    public static ModelMap empty(String msg, Object obj) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "暂无数据" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 2);
        mp.put("state", "empty");
        mp.put("msg", msg);
        mp.put("referer", null);
        mp.put("result", obj);
        return mp;
    }
    public static ModelMap empty(String msg) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "暂无数据" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 2);
        mp.put("state", "empty");
        mp.put("msg", msg);
        mp.put("referer", null);
        mp.put("result", null);
        return mp;
    }

    public static ModelMap Error(String msg, Object obj, String referer) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "操作失败" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 0);
        mp.put("state", "error");
        mp.put("msg", msg);
        mp.put("referer", referer);
        mp.put("result", obj);
        return mp;
    }

    public static ModelMap Error(String msg, Object obj) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "操作失败" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 0);
        mp.put("state", "error");
        mp.put("msg", msg);
        mp.put("referer", null);
        mp.put("result", obj);
        return mp;
    }

    public static ModelMap Error(String msg) {
        msg = StringUtils.isEmpty(msg) || StringUtils.isBlank(msg) ? "操作失败" : msg;
        ModelMap mp = new ModelMap();
        mp.put("status", 0);
        mp.put("state", "error");
        mp.put("msg", msg);
        mp.put("referer", null);
        mp.put("result", null);
        return mp;
    }
}