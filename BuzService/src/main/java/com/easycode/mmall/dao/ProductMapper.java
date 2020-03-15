package com.easycode.mmall.dao;

import com.easycode.mmall.core.Mapper;
import com.easycode.mmall.model.Product;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ProductMapper extends Mapper<Product> {

  List<Product> selectByNameAndCategoryIds(@Param("productName") String productName, @Param("categoryList") List<Integer> categoryList);
}