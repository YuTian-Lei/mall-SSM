package com.easycode.mmall.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.dao.CategoryMapper;
import com.easycode.mmall.dao.ProductMapper;
import com.easycode.mmall.model.Category;
import com.easycode.mmall.model.Product;
import com.easycode.mmall.service.CategoryService;
import com.easycode.mmall.service.ProductService;
import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.utils.DozerUtil;
import com.easycode.mmall.utils.PropertiesUtil;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.ProductDetailVo;
import com.easycode.mmall.vo.ProductListVo;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import io.swagger.models.auth.In;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.dozer.Mapper;
import org.joda.time.DateTimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import tk.mybatis.mapper.entity.Example;

/**
 * @author CodeGenerator
 * @date 2020/03/13
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ProductServiceImpl extends AbstractService<Product> implements ProductService {
  @Resource
  private ProductMapper productMapper;

  @Autowired
  private CategoryMapper categoryMapper;

  @Autowired
  private CategoryService categoryService;

  @Autowired
  private  Mapper mapper;

  @Override
  public Result saveOrUpdateProduct(Product product) {
    if (product != null) {
      if (StringUtils.isNotBlank(product.getSubImages())) {
        String[] subImageArray = product.getSubImages().split(",");
        if (subImageArray.length > 0) {
          product.setMainImage(subImageArray[0]);
        }
      }
      if (product.getId() != null) {
        int rowCount = productMapper.updateByPrimaryKeySelective(product);
        if (rowCount > 0) {
          return ResultGenerator.genSuccessResult("更新产品成功");
        } else {
          return ResultGenerator.genFailResult("更新产品失败");
        }
      } else {
        int rowCount = productMapper.insert(product);
        if (rowCount > 0) {
          return ResultGenerator.genSuccessResult("新增产品成功");
        } else {
          return ResultGenerator.genFailResult("新增产品失败");
        }
      }
    }

    return ResultGenerator.genFailResult("新增或更新产品参数不正确");
  }

  @Override
  public Result<String> setSaleStatus(Integer productId, Integer status) {
    if (productId == null || status == null) {
      return ResultGenerator.genFailResult("参数不合法");
    }
    Product product = new Product();
    product.setId(productId);
    product.setStatus(status);
    int rowCount = productMapper.updateByPrimaryKeySelective(product);
    if (rowCount > 0) {
      return ResultGenerator.genSuccessResult("修改产品销售状态成功");
    }
    return ResultGenerator.genFailResult("修改产品销售状态失败");
  }

  @Override
  public Result<ProductDetailVo> manageProductDetail(Integer productId) {
    if (productId == null) {
      return ResultGenerator.genFailResult("参数不合法");
    }
    Product product = productMapper.selectByPrimaryKey(productId);
    if (product == null) {
      return ResultGenerator.genFailResult("产品已下架或者删除");
    }
    ProductDetailVo productDetailVo = assembleProductDetailVo(product);
    return ResultGenerator.genSuccessResult(productDetailVo);
  }

  @Override
  public Result<PageInfo> getProductList(int pageNum, int pageSize) {
    PageHelper.startPage(pageNum, pageSize);
    Example example = new Example(Product.class);
    example.orderBy("id").asc();
    List<Product> productList = productMapper.selectByExample(example);
    List<ProductListVo> productListVoList = productList.stream().map(product -> {
      ProductListVo productListVo = assembleProductListVo(product);
      return productListVo;
    }).collect(Collectors.toList());
    PageInfo pageResult = new PageInfo(productList);
    pageResult.setList(productListVoList);
    return ResultGenerator.genSuccessResult(pageResult);
  }

  @Override
  public Result<PageInfo> searchProduct(String productName, Integer productId, int pageNum,
      int pageSize) {
    PageHelper.startPage(pageNum, pageSize);
    if (StringUtils.isNotBlank(productName)) {
      productName = new StringBuilder().append("%").append(productName).append("%").toString();
    } else {
      productName = null;
    }
    Example example = new Example(Product.class);
    Example.Criteria criteria = example.createCriteria();
    criteria.andEqualTo("id", productId);
    criteria.andLike("name", productName);
    List<Product> productList = productMapper.selectByExample(example);
    List<ProductListVo> productListVoList = productList.stream().map(product -> {
      ProductListVo productListVo = assembleProductListVo(product);
      return productListVo;
    }).collect(Collectors.toList());
    PageInfo pageResult = new PageInfo(productList);
    pageResult.setList(productListVoList);
    return ResultGenerator.genSuccessResult(pageResult);
  }

  @Override
  public Result<ProductDetailVo> getProductDetail(Integer productId){
    if (productId == null) {
      return ResultGenerator.genFailResult("参数不合法");
    }
    Product product = productMapper.selectByPrimaryKey(productId);
    if (product == null) {
      return ResultGenerator.genFailResult("产品已下架或者删除");
    }
    if(product.getStatus() != CONST.ProductStatusEnum.ON_SALE.getCode()){
      return ResultGenerator.genFailResult("产品已下架或者删除");
    }
    ProductDetailVo productDetailVo = assembleProductDetailVo(product);
    return ResultGenerator.genSuccessResult(productDetailVo);
  }

  @Override
  public Result<PageInfo> getProductByKeywordCategory(String keyword,Integer categoryId,int pageNum,int pageSize,String orderBy){
    if(StringUtils.isBlank(keyword) && categoryId == null){
      return  ResultGenerator.genFailResult("参数不合法", ResultCode.ILLEGAL_ARGUMENT);
    }
    List<Integer> categoryIdList = Lists.newArrayList();

    if(categoryId != null){
      Category category = categoryMapper.selectByPrimaryKey(categoryId);
      if(category == null && StringUtils.isBlank(keyword)){
         PageHelper.startPage(pageNum,pageSize);
         List<ProductDetailVo> productDetailVos = Lists.newArrayList();
         PageInfo pageInfo = new PageInfo(productDetailVos);
         return  ResultGenerator.genSuccessResult(pageInfo);
      }else if(category == null){
        PageHelper.startPage(pageNum,pageSize);
        List<ProductDetailVo> productDetailVos = Lists.newArrayList();
        PageInfo pageInfo = new PageInfo(productDetailVos);
        return  ResultGenerator.genSuccessResult(pageInfo);
      }
      categoryIdList = categoryService.selectCategoryAndChildrenById(category.getId()).getData();
    }
    if(StringUtils.isNotBlank(keyword)){
       keyword = new StringBuilder().append("%").append(keyword).append("%").toString();
    }
    PageHelper.startPage(pageNum,pageSize);
    //排序处理
    if(StringUtils.isNotBlank(orderBy)){
        if(CONST.ProductListOrderBy.PRICE_ASC_DESC.contains(orderBy)){
          String[] orderByArray = orderBy.split("_");
          PageHelper.orderBy(orderByArray[0]+" "+orderByArray[1]);
        }
    }
    List<Product> productList = productMapper.selectByNameAndCategoryIds(StringUtils.isBlank(keyword)?null:keyword,
        CollectionUtil.isEmpty(categoryIdList)?null:categoryIdList);

    List<ProductListVo> productListVoList = productList.stream().map(product -> {
      ProductListVo productListVo = assembleProductListVo(product);
      return productListVo;
    }).collect(Collectors.toList());
    PageInfo pageResult = new PageInfo(productList);
    pageResult.setList(productListVoList);
    return ResultGenerator.genSuccessResult(pageResult);
  }

  private ProductDetailVo assembleProductDetailVo(Product product) {
    ProductDetailVo productDetailVo = new ProductDetailVo();
    productDetailVo.setId(product.getId());
    productDetailVo.setSubTitle(product.getSubtitle());
    productDetailVo.setPrice(product.getPrice());
    productDetailVo.setMainImage(product.getMainImage());
    productDetailVo.setSubImage(product.getSubImages());
    productDetailVo.setCategoryId(product.getCategoryId());
    productDetailVo.setDetail(product.getDetail());
    productDetailVo.setName(product.getName());
    productDetailVo.setStatus(product.getStatus());
    productDetailVo.setStock(product.getStock());

    productDetailVo.setImageHost(
        PropertiesUtil.getProperty("ftp.server.http.prefix", "http://182.92.9.232/img/"));

    Category category = categoryMapper.selectByPrimaryKey(product.getCategoryId());
    if (category == null) {
      //默认根节点
      productDetailVo.setParentCategoryId(0);
    } else {
      productDetailVo.setParentCategoryId(category.getParentId());
    }

    productDetailVo.setCreateTime(DateUtil.formatDateTime(product.getCreateTime()));
    productDetailVo.setUpdateTime(DateUtil.formatDateTime(product.getUpdateTime()));
    return productDetailVo;
  }

  private ProductListVo assembleProductListVo(Product product) {
    ProductListVo productListVo = DozerUtil.map(mapper,product, ProductListVo.class);
    productListVo.setImageHost(
        PropertiesUtil.getProperty("ftp.server.http.prefix", "http://182.92.9.232/img/"));
    return productListVo;
  }
}
