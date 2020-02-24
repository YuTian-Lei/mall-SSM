package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.mmallShippingMapper;
import com.easycode.mmall.model.mmallShipping;
import com.easycode.mmall.service.mmallShippingService;
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
public class mmallShippingServiceImpl extends AbstractService<mmallShipping> implements mmallShippingService {
    @Resource
    private mmallShippingMapper mmallShippingMapper;

}
