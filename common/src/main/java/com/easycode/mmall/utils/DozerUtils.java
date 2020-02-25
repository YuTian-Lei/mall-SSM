package com.easycode.mmall.utils;

import com.github.dozermapper.core.DozerBeanMapperBuilder;
import com.github.dozermapper.core.Mapper;
import com.github.dozermapper.core.loader.api.BeanMappingBuilder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * @className: DozerUtils
 * @description: DTO/VO/DO等之间的转换
 */
public class DozerUtils {
  /**
   * 持有Dozer单例, 避免重复创建DozerMapper消耗资源.
   */
  private static Mapper dozer;

  static {
    if (dozer == null) {
      dozer = DozerBeanMapperBuilder.create().build();
    }
  }

  /**
   * @param source 源对象
   * @param destinationClass 目标对象
   * @title: map
   * @description: 单个对象相互转换
   * @date 2017年11月8日 下午6:08:54
   */
  public static <T> T map(BeanMappingBuilder configure, Object source, Class<T> destinationClass) {
    if (configure != null) {
      return DozerBeanMapperBuilder.create().withMappingBuilder(configure).build()
          .map(source, destinationClass);
    }
    return dozer.map(source, destinationClass);
  }

  /**
   * @title: mapList
   * @description: 集合对象相互转换
   * @date 2017年11月8日 下午6:09:41
   */
  @SuppressWarnings("rawtypes")
  public static <T> List<T> mapList(BeanMappingBuilder configure, Collection sourceList,
      Class<T> destinationClass) {
    Mapper innerDozer = null;
    if (configure != null) {
      innerDozer = DozerBeanMapperBuilder.create().withMappingBuilder(configure).build();
    }
    List<T> destinationList = new ArrayList<T>();
    for (Object sourceObject : sourceList) {
      T destinationObject = innerDozer != null ? innerDozer.map(sourceObject, destinationClass)
          : dozer.map(sourceObject, destinationClass);
      destinationList.add(destinationObject);
    }

    return destinationList;
  }
}
