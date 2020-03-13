package com.easycode.mmall.service.impl;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.dao.UserMapper;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.core.AbstractService;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
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
public class UserServiceImpl extends AbstractService<User> implements UserService {
    @Resource
    private UserMapper mmallUserMapper;

    @Override
    public int checkUsername(String username) {
        User user = new User();
        user.setUsername(username);
        return mmallUserMapper.selectCount(user);
    }

    @Override
    public int checkEmail(String email) {
        User user = new User();
        user.setEmail(email);
        return mmallUserMapper.selectCount(user);
    }

    @Override
    public int checkAnswer(String username, String question, String answer) {
        User user = new User();
        user.setUsername(username);
        user.setQuestion(question);
        user.setAnswer(answer);
        return  mmallUserMapper.selectCount(user);
    }

    @Override
    public Result checkAdminRole(User user){
        if(user != null && user.getRole().intValue() == CONST.ROLE.ROLE_ADMIN){
            return ResultGenerator.genSuccessResult();
        }
        return ResultGenerator.genFailResult("不是管理员");
    }
}
