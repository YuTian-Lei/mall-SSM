package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.mmallCategoryMapper;
import com.easycode.mmall.model.mmallCategory;
import com.easycode.mmall.service.mmallCategoryService;
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
public class mmallCategoryServiceImpl extends AbstractService<mmallCategory> implements mmallCategoryService {
    @Resource
    private mmallCategoryMapper mmallCategoryMapper;

}
