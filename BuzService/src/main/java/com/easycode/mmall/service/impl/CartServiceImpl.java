package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.CartMapper;
import com.easycode.mmall.model.Cart;
import com.easycode.mmall.service.CartService;
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
public class CartServiceImpl extends AbstractService<Cart> implements CartService {
    @Resource
    private CartMapper mmallCartMapper;

}
