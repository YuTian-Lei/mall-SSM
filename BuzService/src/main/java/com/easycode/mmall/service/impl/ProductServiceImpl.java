package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.ProductMapper;
import com.easycode.mmall.model.Product;
import com.easycode.mmall.service.ProductService;
import com.easycode.mmall.core.AbstractService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;



/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ProductServiceImpl extends AbstractService<Product> implements ProductService {
    @Resource
    private ProductMapper mmallProductMapper;

}
