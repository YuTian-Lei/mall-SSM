package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.mmallProductMapper;
import com.easycode.mmall.model.mmallProduct;
import com.easycode.mmall.service.mmallProductService;
import com.easycode.mmall.core.AbstractService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;



/**
 *
 * @author CodeGenerator
 * @date 2020/02/24
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class mmallProductServiceImpl extends AbstractService<mmallProduct> implements mmallProductService {
    @Resource
    private mmallProductMapper mmallProductMapper;

}
