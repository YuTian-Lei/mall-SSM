package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.CategoryMapper;
import com.easycode.mmall.model.Category;
import com.easycode.mmall.service.CategoryService;
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
public class CategoryServiceImpl extends AbstractService<Category> implements CategoryService {
    @Resource
    private CategoryMapper mmallCategoryMapper;

}
