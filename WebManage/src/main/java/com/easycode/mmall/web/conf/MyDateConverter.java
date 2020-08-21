package com.easycode.mmall.web.conf;

import cn.hutool.core.date.DateUtil;
import java.util.Date;
import org.springframework.core.convert.converter.Converter;

/**
 * @Description: //TODO
 * @Date: 2020/8/21 10:29
 * @Author: pengfei.L
 */

public class MyDateConverter implements Converter<String,Date> {
    @Override
    public Date convert(String source) {
        try {
            return DateUtil.parse(source);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}