package com.easycode.mmall.service.impl;

import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.dao.OrderItemMapper;
import com.easycode.mmall.model.OrderItem;
import com.easycode.mmall.service.OrderItemService;
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
public class OrderItemServiceImpl extends AbstractService<OrderItem> implements OrderItemService {
    @Resource
    private OrderItemMapper mmallOrderItemMapper;

}
