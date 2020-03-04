package com.easycode.mmall.controller;

import cn.hutool.core.lang.UUID;
import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.async.AsyncManager;
import com.easycode.mmall.model.mmallUser;
import com.easycode.mmall.service.mmallUserService;
import com.easycode.mmall.utils.DateUtils;
import com.easycode.mmall.utils.JsonResult;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.utils.TokenCache;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("user")
public class UserController {

  @Autowired
  private mmallUserService mmallUserService;

  @PostMapping("list")
  @ApiOperation(value="获取用户列表",notes = "获取用户信息",httpMethod = "POST")
  public JsonResult getUserList() {
    log.info("日志框架测试--开始,{}", DateUtils.format(new Date()));
    AsyncManager.instance().execute(()->{
      try {
        for(int i=1000;i>0;i++){
          log.info("i"+i);
          Thread.sleep(1000);
        }
        log.info("线程结束");
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    });
    JsonResult jsonResult = new JsonResult();
    List<mmallUser> mmallUserList = mmallUserService.findAll();
    PageInfo<mmallUser> pageInfo = new PageInfo<>();
    pageInfo.setList(mmallUserList);
    jsonResult.setResultCode(1);
    jsonResult.setData("page",pageInfo);
    log.info("日志框架测试--结束,{}",DateUtils.format(new Date()));
    return jsonResult;
  }

  @PostMapping("getUserInfo")
  @ApiOperation(value="获取当前用户信息",notes = "获取当前用户信息",httpMethod = "POST")
  public Result<mmallUser> getUserInfo(HttpSession session){
    mmallUser user = (mmallUser) session.getAttribute(CONST.CURRENT_USER);
    if(user == null){
      return ResultGenerator.genFailResult("用户未登录,无法获取相关信息");
    }
    return  ResultGenerator.genSuccessResult(user);
  }

  @PostMapping("forgetPassword")
  @ApiOperation(value="获取忘记密码问题",notes = "获取忘记密码问题",httpMethod = "POST")
  @ApiImplicitParam(name = "username",value = "用户名",required = true,paramType = "String")
  public Result<String> forgetPassword(String username){
    int resultCount = mmallUserService.checkUsername(username);
    if(resultCount == 0){
      return ResultGenerator.genFailResult("用户名不存在");
    }
    mmallUser user = mmallUserService.findBy("username",username);
    if(StringUtils.isNotBlank(user.getQuestion())){
      return ResultGenerator.genSuccessResult(user.getQuestion());
    }
    return  ResultGenerator.genFailResult("找回密码的问题是空的");
  }


  @PostMapping("forgetCheckAnswer")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "username",value = "用户名",required = true,paramType = "String"),
      @ApiImplicitParam(name = "question",value = "问题",required = true,paramType = "String"),
      @ApiImplicitParam(name = "answer",value = "答案",required = true,paramType = "String")
  })
  public Result<String> forgetCheckAnswer(String username,String question,String answer){
    int resultCount = mmallUserService.checkAnswer(username,question,answer);
    if(resultCount > 0){
      String forgetToken = UUID.randomUUID().toString();
      TokenCache.setKey("token_"+username,forgetToken);
      return ResultGenerator.genSuccessResult(forgetToken);
    }
    return ResultGenerator.genFailResult("问题的答案错误");
  }
}
