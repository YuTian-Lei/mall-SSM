package com.easycode.mmall.service;
import com.easycode.mmall.model.Product;
import com.easycode.mmall.core.Service;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.vo.ProductDetailVo;
import com.github.pagehelper.PageInfo;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
public interface ProductService extends Service<Product> {

  Result saveOrUpdateProduct(Product product);

  Result<String> setSaleStatus(Integer productId,Integer status);

  Result<ProductDetailVo> manageProductDetail(Integer productId);

  Result getProductList(int pageNum,int pageSize);

  Result<PageInfo> searchProduct(String productName, Integer productId, int pageNum, int pageSize);
}
