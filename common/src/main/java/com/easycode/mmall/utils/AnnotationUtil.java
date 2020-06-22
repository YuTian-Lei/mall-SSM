package com.easycode.mmall.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;
import java.util.Map;

/**
 * @Description: //TODO
 * @Date: 2020/6/22 17:57
 * @Author: pengfei.L
 */

public class AnnotationUtil {
    public static void modifyAnnotationParams(Class<?> clazz, String field, Class annotationClazz, String param, String value)
        throws NoSuchFieldException, IllegalAccessException {
        Field octLeftField = clazz.getDeclaredField(field);
        Object proxy = octLeftField.getAnnotation(annotationClazz);
        // 获取代理处理器
        InvocationHandler invocationHandler = Proxy.getInvocationHandler(proxy);
        // 过去私有 memberValues 属性
        Field f = invocationHandler.getClass().getDeclaredField("memberValues");
        f.setAccessible(true);
        // 获取实例的属性map
        Map<String, Object> memberValues = (Map<String, Object>) f.get(invocationHandler);
        // 修改属性值
        memberValues.put(param, value);

    }
}
