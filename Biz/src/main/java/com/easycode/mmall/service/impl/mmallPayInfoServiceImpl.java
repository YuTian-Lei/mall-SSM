package com.easycode.mmall.service.impl;

import com.easycode.mmall.dao.mmallPayInfoMapper;
import com.easycode.mmall.model.mmallPayInfo;
import com.easycode.mmall.service.mmallPayInfoService;
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
public class mmallPayInfoServiceImpl extends AbstractService<mmallPayInfo> implements mmallPayInfoService {
    @Resource
    private mmallPayInfoMapper mmallPayInfoMapper;

}
