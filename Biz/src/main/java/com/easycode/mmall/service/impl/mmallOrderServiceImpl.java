package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.mmallOrderMapper;
import com.easycode.mmall.model.mmallOrder;
import com.easycode.mmall.service.mmallOrderService;
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
public class mmallOrderServiceImpl extends AbstractService<mmallOrder> implements mmallOrderService {
    @Resource
    private mmallOrderMapper mmallOrderMapper;

}
