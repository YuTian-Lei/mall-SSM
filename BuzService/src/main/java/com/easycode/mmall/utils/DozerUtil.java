package com.easycode.mmall.utils;

import com.google.common.collect.Lists;
import java.util.Collection;
import java.util.List;
import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DozerUtil {

  @Autowired
  private static DozerBeanMapper dozerBeanMapper;

  /**
   * 基于Dozer转换对象的类型.
   */
  public static <T> T map(Object source, Class<T> destinationClass) {
    return dozerBeanMapper.map(source, destinationClass);
  }


  /**
   * 基于Dozer转换Collection中对象的类型.
   */
  public static <T> List<T> mapList(Collection<?> sourceList, Class<T> destinationClass) {
    List<T> destinationList = Lists.newArrayList();
    for (Object sourceObject : sourceList) {
      T destinationObject = dozerBeanMapper.map(sourceObject, destinationClass);
      destinationList.add(destinationObject);
    }
    return destinationList;
  }


  /**
   * 基于Dozer将对象A的值拷贝到对象B中.
   */
  public static void copy(Object source, Object destinationObject) {
    dozerBeanMapper.map(source, destinationObject);
  }
}
