package com.easycode.mmall.controller;

import com.easycode.mmall.model.mmallUser;
import com.easycode.mmall.service.mmallUserService;
import com.easycode.mmall.utils.DateUtils;
import com.easycode.mmall.utils.JsonResult;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.ApiOperation;
import java.util.Date;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
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
  @ApiOperation(value="获取用户列表",notes = "获取用户信息这是notes描述",httpMethod = "POST")
  public JsonResult getUserList() {
    log.info("日志框架测试--开始,{}", DateUtils.format(new Date()));
    JsonResult jsonResult = new JsonResult();
    List<mmallUser> mmallUserList = mmallUserService.findAll();
    PageInfo<mmallUser> pageInfo = new PageInfo<>();
    pageInfo.setList(mmallUserList);
    jsonResult.setResultCode(1);
    jsonResult.setData("page",pageInfo);
    log.info("日志框架测试--结束,{}",DateUtils.format(new Date()));
    return jsonResult;
  }

}
