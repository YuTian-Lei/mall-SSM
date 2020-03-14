package com.easycode.mmall.service.impl;

import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import com.easycode.mmall.dao.CategoryMapper;
import com.easycode.mmall.dao.ProductMapper;
import com.easycode.mmall.model.Category;
import com.easycode.mmall.model.Product;
import com.easycode.mmall.service.ProductService;
import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.utils.DozerUtil;
import com.easycode.mmall.utils.DozerUtils;
import com.easycode.mmall.utils.PropertiesUtil;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.ProductDetailVo;
import com.easycode.mmall.vo.ProductListVo;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
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
        PropertiesUtil.getProperty("ftp.server.http.prefix", "http://img.happymmall.com"));

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
    ProductListVo productListVo = DozerUtil.map(product, ProductListVo.class);
    productListVo.setImageHost(
        PropertiesUtil.getProperty("ftp.server.http.prefix", "http://img.happymmall.com"));
    return productListVo;
  }
}
