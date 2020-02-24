package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.mmallCartMapper;
import com.easycode.mmall.model.mmallCart;
import com.easycode.mmall.service.mmallCartService;
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
public class mmallCartServiceImpl extends AbstractService<mmallCart> implements mmallCartService {
    @Resource
    private mmallCartMapper mmallCartMapper;

}
