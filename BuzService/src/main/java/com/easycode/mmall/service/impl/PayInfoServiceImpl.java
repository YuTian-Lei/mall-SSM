package com.easycode.mmall.service.impl;

import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.dao.PayInfoMapper;
import com.easycode.mmall.model.PayInfo;
import com.easycode.mmall.service.PayInfoService;
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
public class PayInfoServiceImpl extends AbstractService<PayInfo> implements PayInfoService {
    @Resource
    private PayInfoMapper mmallPayInfoMapper;

}
