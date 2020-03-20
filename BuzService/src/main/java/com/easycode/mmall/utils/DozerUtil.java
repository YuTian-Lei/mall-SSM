package com.easycode.mmall.utils;

import com.google.common.collect.Lists;
import java.util.Collection;
import java.util.List;
import org.dozer.Mapper;

public class DozerUtil {


  /**
   * 基于Dozer转换对象的类型.
   */
  public static  <T> T map(Mapper mapper,Object source, Class<T> destinationClass) {
    return mapper.map(source, destinationClass);
  }


  /**
   * 基于Dozer转换Collection中对象的类型.
   */
  public static  <T> List<T> mapList(Mapper mapper,Collection<?> sourceList, Class<T> destinationClass) {
    List<T> destinationList = Lists.newArrayList();
    for (Object sourceObject : sourceList) {
      T destinationObject = mapper.map(sourceObject, destinationClass);
      destinationList.add(destinationObject);
    }
    return destinationList;
  }


  /**
   * 基于Dozer将对象A的值拷贝到对象B中.
   */
  public static void copy(Mapper mapper,Object source, Object destinationObject) {
    mapper.map(source, destinationObject);
  }
}
