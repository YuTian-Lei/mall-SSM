package com.easycode.mmall.controller;

import com.easycode.mmall.model.mmallUser;
import com.easycode.mmall.service.mmallUserService;
import com.easycode.mmall.utils.DateUtils;
import com.easycode.mmall.utils.JsonResult;
import com.github.pagehelper.PageInfo;
import java.util.Date;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


@Slf4j
@Controller
@RequestMapping("user")
public class UserController {

  @Autowired
  private mmallUserService mmallUserService;

  @ResponseBody
  @RequestMapping(value = "list", method = RequestMethod.GET)
  public JsonResult getUserList() {
    log.debug("日志框架测试--开始,{}", DateUtils.format(new Date()));
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
