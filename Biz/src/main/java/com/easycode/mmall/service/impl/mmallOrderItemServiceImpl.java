package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.mmallOrderItemMapper;
import com.easycode.mmall.model.mmallOrderItem;
import com.easycode.mmall.service.mmallOrderItemService;
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
public class mmallOrderItemServiceImpl extends AbstractService<mmallOrderItem> implements mmallOrderItemService {
    @Resource
    private mmallOrderItemMapper mmallOrderItemMapper;

}
