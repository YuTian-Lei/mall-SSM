package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.OrderMapper;
import com.easycode.mmall.model.Order;
import com.easycode.mmall.service.OrderService;
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
public class OrderServiceImpl extends AbstractService<Order> implements OrderService {
    @Resource
    private OrderMapper mmallOrderMapper;

}
