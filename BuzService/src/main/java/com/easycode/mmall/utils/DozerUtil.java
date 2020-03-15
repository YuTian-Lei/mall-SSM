package com.easycode.mmall.utils;

import com.google.common.collect.Lists;
import java.util.Collection;
import java.util.List;
import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DozerUtil {

  @Autowired
  private  Mapper mapper;

  /**
   * 基于Dozer转换对象的类型.
   */
  public  <T> T map(Object source, Class<T> destinationClass) {
    return mapper.map(source, destinationClass);
  }


  /**
   * 基于Dozer转换Collection中对象的类型.
   */
  public  <T> List<T> mapList(Collection<?> sourceList, Class<T> destinationClass) {
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
  public  void copy(Object source, Object destinationObject) {
    mapper.map(source, destinationObject);
  }
}
