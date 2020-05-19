package com.easycode.mmall.service.impl;

import cn.hutool.core.collection.CollectionUtil;
import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.dao.ShippingMapper;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.model.Shipping;
import com.easycode.mmall.service.ShippingService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Maps;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import tk.mybatis.mapper.entity.Example;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class ShippingServiceImpl extends AbstractService<Shipping> implements ShippingService {
    @Resource
    private ShippingMapper shippingMapper;

    @Override
    public Result add(Integer userId,Shipping shipping){
        shipping.setUserId(userId);
        int rowCount = shippingMapper.insert(shipping);
        if(rowCount > 0){
            Map  result = Maps.newHashMap();
            result.put("shippingId",shipping.getId());
            return ResultGenerator.genSuccessResult("新建地址成功",result);
        }
        return  ResultGenerator.genFailResult("新建地址失败");
    }
    @Override
    public Result del(Integer userId,Integer shippingId){
        Shipping shipping = new Shipping();
        shipping.setUserId(userId);
        shipping.setId(shippingId);
        int resultCount = shippingMapper.delete(shipping);
        if(resultCount > 0){
            return  ResultGenerator.genSuccessResult("删除地址成功");
        }
        return ResultGenerator.genFailResult("删除地址失败");
    }
    @Override
    public Result update(Integer userId,Shipping shipping){
        Example example = new Example(Shipping.class);
        example.createCriteria()
            .andEqualTo("id",shipping.getId())
            .andEqualTo("userId",userId);
        shipping.setUserId(userId);
        int rowCount = shippingMapper.updateByExample(shipping,example);
        if(rowCount > 0){
            return ResultGenerator.genSuccessResult("更新地址成功");
        }
        return  ResultGenerator.genFailResult("更新地址失败");

    }
    @Override
    public Result<Shipping> select(Integer userId,Integer shippingId){
        Example example = new Example(Shipping.class);
        example.createCriteria()
            .andEqualTo("id",shippingId)
            .andEqualTo("userId",userId);

        List<Shipping> shippingList = shippingMapper.selectByExample(example);

        if(CollectionUtil.isEmpty(shippingList)){
            return  ResultGenerator.genFailResult("无法查询到该地址");
        }
        return ResultGenerator.genSuccessResult("查询地址成功",shippingList.get(0));
    }
    @Override
    public Result<PageInfo> list(Integer userId,int pageNum,int pageSize){
        PageHelper.startPage(pageNum,pageSize);
        Example example = new Example(Shipping.class);
        example.createCriteria().andEqualTo("userId",userId);
        List<Shipping> shippingList = shippingMapper.selectByExample(example);
        PageInfo<Shipping> pageInfo = new PageInfo(shippingList);
        return  ResultGenerator.genSuccessResult(pageInfo);
    }

}
