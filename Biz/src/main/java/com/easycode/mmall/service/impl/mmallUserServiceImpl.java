package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.mmallUserMapper;
import com.easycode.mmall.model.mmallUser;
import com.easycode.mmall.service.mmallUserService;
import com.easycode.mmall.core.AbstractService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;



/**
 *
 * @author CodeGenerator
 * @date 2020/02/26
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class mmallUserServiceImpl extends AbstractService<mmallUser> implements mmallUserService {
    @Resource
    private mmallUserMapper mmallUserMapper;

}
