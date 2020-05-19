package com.easycode.mmall.controller;

import cn.hutool.core.lang.UUID;
import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.async.AsyncManager;
import com.easycode.mmall.utils.DateUtils;
import com.easycode.mmall.utils.JsonResult;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.DigestUtils;
import com.easycode.mmall.utils.EncodeUtils;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.TokenCache;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tk.mybatis.mapper.entity.Example;

@Slf4j
@RestController
@RequestMapping("user")
public class UserController {

  @Autowired
  private UserService mmallUserService;

  @PostMapping("list")
  @ApiOperation(value = "获取用户列表", notes = "获取用户信息", httpMethod = "POST")
  public JsonResult getUserList() {
    log.info("日志框架测试--开始,{}", DateUtils.format(new Date()));
    AsyncManager.instance().execute(() -> {
      try {
        for (int i = 1000; i > 0; i++) {
          log.info("i" + i);
          Thread.sleep(1000);
        }
        log.info("线程结束");
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    });
    JsonResult jsonResult = new JsonResult();
    List<User> mmallUserList = mmallUserService.findAll();
    PageInfo<User> pageInfo = new PageInfo<>();
    pageInfo.setList(mmallUserList);
    jsonResult.setResultCode(1);
    jsonResult.setData("page", pageInfo);
    log.info("日志框架测试--结束,{}", DateUtils.format(new Date()));
    return jsonResult;
  }

  @PostMapping("getUserInfo")
  @ApiOperation(value = "获取当前用户信息", notes = "获取当前用户信息", httpMethod = "POST")
  public Result<User> getUserInfo(HttpSession session) {
    User user = (User) session.getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,无法获取相关信息");
    }
    return ResultGenerator.genSuccessResult(user);
  }

  @PostMapping("forgetPassword")
  @ApiOperation(value = "获取密保问题", notes = "获取密保问题", httpMethod = "POST")
  @ApiImplicitParam(name = "username", value = "用户名", required = true, paramType = "String")
  public Result<String> forgetPassword(@RequestParam(value = "username") String username) {
    int resultCount = mmallUserService.checkUsername(username);
    if (resultCount == 0) {
      return ResultGenerator.genFailResult("用户名不存在");
    }
    User user = mmallUserService.findBy("username", username);
    if (StringUtils.isNotBlank(user.getQuestion())) {
      return ResultGenerator.genSuccessResult(user.getQuestion());
    }
    return ResultGenerator.genFailResult("找回密码的问题是空的");
  }

  @PostMapping("forgetCheckAnswer")
  @ApiOperation(value = "回答密保问题", notes = "回答密保问题")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "username", value = "用户名", required = true, paramType = "String"),
      @ApiImplicitParam(name = "question", value = "问题", required = true, paramType = "String"),
      @ApiImplicitParam(name = "answer", value = "答案", required = true, paramType = "String")
  })
  public Result<String> forgetCheckAnswer(String username, String question, String answer) {
    int resultCount = mmallUserService.checkAnswer(username, question, answer);
    if (resultCount > 0) {
      String forgetToken = UUID.randomUUID().toString();
      TokenCache.setKey(TokenCache.TOKEN_PREFIX + username, forgetToken);
      return ResultGenerator.genSuccessResult(forgetToken);
    }
    return ResultGenerator.genFailResult("问题的答案错误");
  }

  @PostMapping("forgetResetPassword")
  @ApiOperation(value = "密保问题重置密码", notes = "忘记密码重置密码")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "username",value = "用户名" ,required = true,paramType = "String"),
      @ApiImplicitParam(name = "passwordNew",value = "新密码",required = true,paramType = "String"),
      @ApiImplicitParam(name = "forgetToken",value = "token",required = true,paramType = "String")
  })
  public Result<String> forgetResetPassword(String username, String passwordNew,
      String forgetToken) {
    Result result = new Result();
    if (StringUtils.isBlank(forgetToken)) {
      return ResultGenerator.genFailResult("參數錯誤，token需要传递");
    }
    int resultCount = mmallUserService.checkUsername(username);
    if (resultCount == 0) {
      return ResultGenerator.genFailResult("用户不存在");
    }
    String token = TokenCache.getKey(TokenCache.TOKEN_PREFIX + username);
    if (StringUtils.isBlank(token)) {
      return ResultGenerator.genFailResult("token无效或过期");
    }

    if (StringUtils.equals(forgetToken, token)) {
      User user = mmallUserService.findBy("username", username);
      //密码加密开始
      byte[] salt = DigestUtils.generateSalt(8);
      String saveSalt = EncodeUtils.encodeHex(salt);
      user.setSalt(saveSalt);
      byte[] hashPassword = DigestUtils.sha1(passwordNew.trim().getBytes(), salt, 1024);
      String passWord = EncodeUtils.encodeHex(hashPassword);
      //密码加密结束
      user.setPassword(passWord);
      mmallUserService.update(user);
      result.setCode(ResultCode.SUCCESS);
      result.setMessage("修改密码成功");
      return result;
    } else {
      return ResultGenerator.genFailResult("token错误,请重新获取重置密码的token");
    }
  }


  @PostMapping("resetPassword")
  @ApiOperation(value = "登录状态重置密码", notes = "登录状态重置密码")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "passwordOld",value = "旧密码" ,required = true,paramType = "String"),
      @ApiImplicitParam(name = "passwordNew",value = "新密码",required = true,paramType = "String")
  })
  public Result<String> resetPassword(HttpServletRequest request,String passwordOld, String passwordNew){
      Result result = new Result();
      User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
      User mmallUser = mmallUserService.findBy("id",user.getId());
      String password = EncodeUtils.encodeHex(DigestUtils.sha1(passwordOld.trim().getBytes(), EncodeUtils.decodeHex(mmallUser.getSalt()), 1024));
      if(StringUtils.equals(password,mmallUser.getPassword())){
        //密码加密开始
        byte[] salt = DigestUtils.generateSalt(8);
        String saveSalt = EncodeUtils.encodeHex(salt);
        byte[] hashPassword = DigestUtils.sha1(passwordNew.trim().getBytes(), salt, 1024);
        String passWord = EncodeUtils.encodeHex(hashPassword);
        //密码加密结束
        mmallUser.setSalt(saveSalt);
        mmallUser.setPassword(passWord);
        mmallUserService.update(mmallUser);
        result.setCode(ResultCode.SUCCESS);
        result.setMessage("密码更新成功");
        return  result;
      }
      return ResultGenerator.genFailResult("密码更新失败");
  }

  @PostMapping("updateInformation")
  @ApiOperation(value = "更新用户信息", notes = "更新用户信息")
  public Result<User>  updateInformation(HttpServletRequest request,@Valid User user ,BindingResult bindingResult){
    if (bindingResult.hasErrors()) {
      String msg = bindingResult.getAllErrors().stream()
          .map(objectError -> objectError.getDefaultMessage()).reduce((s, s2) -> s + "," + s2).get();
      return ResultGenerator.genFailResult(msg);
    }

    User currentUser = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if(currentUser == null){
      return ResultGenerator.genFailResult("用户未登录");
    }
    user.setId(currentUser.getId());
    //username不能被更新
    Result result  = ResultGenerator.genSuccessResult();
    Example example = new Example(User.class);
    Example.Criteria criteria = example.createCriteria();
    criteria.andEqualTo("email",user.getEmail());
    criteria.andEqualTo("id",user.getId());
    int count = mmallUserService.findByExample(example).size();
    if(count > 0){
      return  ResultGenerator.genFailResult("email已经存在，请更换email再尝试更新");
    }
    User updateUser = new User();
    updateUser.setId(user.getId());
    updateUser.setEmail(user.getEmail());
    updateUser.setPhone(user.getPhone());
    updateUser.setQuestion(user.getQuestion());
    updateUser.setAnswer(user.getAnswer());
    updateUser.setUpdateTime(new Date());
    mmallUserService.update(updateUser);
    User mmallUser = mmallUserService.findById(updateUser.getId());
    result.setMessage("更新状态成功");
    result.setData(mmallUser);
    request.getSession().setAttribute(CONST.CURRENT_USER,mmallUser);
    return result;
  }

  @PostMapping("getInformation")
  @ApiOperation(value = "获取用户信息", notes = "获取用户信息")
  public Result<User> getInformation(HttpServletRequest request){
      User currentUser = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
      if(currentUser == null){
        return  ResultGenerator.genFailResult("未登录，需要强制登录");
      }
      User user = mmallUserService.findById(currentUser.getId());
      user.setPassword(StringUtils.EMPTY);
      user.setSalt(StringUtils.EMPTY);
      return ResultGenerator.genSuccessResult(user);
  }
}
