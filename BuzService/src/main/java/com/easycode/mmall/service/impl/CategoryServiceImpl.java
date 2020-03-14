package com.easycode.mmall.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import com.easycode.mmall.dao.CategoryMapper;
import com.easycode.mmall.model.Category;
import com.easycode.mmall.service.CategoryService;
import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import java.util.List;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.annotation.Resource;
import tk.mybatis.mapper.entity.Example;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class CategoryServiceImpl extends AbstractService<Category> implements CategoryService {
    @Resource
    private CategoryMapper categoryMapper;

    @Override
    public Result addCategory(String categoryName, Integer parentId) {
        if(parentId == null || StringUtils.isBlank(categoryName)){
            return ResultGenerator.genFailResult("添加品类参数错误");
        }

        Category category = new Category();
        category.setName(categoryName);
        category.setParentId(parentId);
        category.setStatus(true);

        int rowCount = categoryMapper.insert(category);
        if(rowCount > 0){
            return ResultGenerator.genSuccessResult("添加品类成功");
        }
        return ResultGenerator.genFailResult("添加品类失败");
    }

    @Override
    public Result updateCategoryName(Integer categoryId, String categoryName){
        if(categoryId == null || StringUtils.isBlank(categoryName)){
            return ResultGenerator.genFailResult("更新品类参数错误");
        }
        Category category = new Category();
        category.setId(categoryId);
        category.setName(categoryName);

        int rowCount = categoryMapper.updateByPrimaryKeySelective(category);
        if(rowCount > 0){
            return ResultGenerator.genSuccessResult("更新品类名称成功");
        }
        return ResultGenerator.genFailResult("更新品类名称失败");
    }


    @Override
    public Result<List<Category>> getChildrenParallelCategory(Integer categoryId){
        Example example = new Example(Category.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andEqualTo("parentId",categoryId);
        List<Category> categoryList = categoryMapper.selectByExample(example);
        if(CollectionUtil.isEmpty(categoryList)){
            log.info("未找到当前分类的子分类");
        }
        return ResultGenerator.genSuccessResult(categoryList);
    }

    @Override
    public Result selectCategoryAndChildrenById(Integer categoryId){
        Set<Category> categorySet = Sets.newHashSet();
        findChildCategory(categorySet,categoryId);

        List<Integer> categoryIdList = Lists.newArrayList();
        if(categoryId != null){
            categorySet.forEach(category -> {
                categoryIdList.add(category.getId());
            });
        }
        return  ResultGenerator.genSuccessResult(categoryIdList);
    }

    private void findChildCategory(Set<Category> categorySet,Integer categoryId){
        Category category = categoryMapper.selectByPrimaryKey(categoryId);
        if(category != null){
            categorySet.add(category);
        }
        //查找子节点
        Example example = new Example(Category.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andEqualTo("parentId",categoryId);
        List<Category> categoryList = categoryMapper.selectByExample(example);
        categoryList.forEach(categoryItem ->{
            findChildCategory(categorySet,categoryItem.getId());
        });
    }
}
