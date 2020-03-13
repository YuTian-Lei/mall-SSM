package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.ShippingMapper;
import com.easycode.mmall.model.Shipping;
import com.easycode.mmall.service.ShippingService;
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
public class ShippingServiceImpl extends AbstractService<Shipping> implements ShippingService {
    @Resource
    private ShippingMapper mmallShippingMapper;

}
