package com.easycode.mmall.controller;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/manage/user")
public class UserManageController {

  @Autowired
  private UserService mmallUserService;

  @PostMapping("login")
  @ApiOperation(value = "管理员登录",notes = "管理员登录")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "username",value = "用户名",required = true,paramType = "String"),
      @ApiImplicitParam(name = "password",value = "密码",required = true,paramType = "String")
  })
  public Result<User> login(HttpServletRequest request, String username, String password) {
    Result result = ResultGenerator.genSuccessResult();
    UsernamePasswordToken token = new UsernamePasswordToken(username, password, false);
    Subject currentUser = SecurityUtils.getSubject();
    try {
      //在调用了login方法后,SecurityManager会收到AuthenticationToken,并将其发送给已配置的Realm执行必须的认证检查
      //每个Realm都能在必要时对提交的AuthenticationTokens作出反应
      //所以这一步在调用login(token)方法时,它会走到MyRealm.doGetAuthenticationInfo()方法中,具体验证方式详见此方法
      log.info("对用户[" + username + "]进行登录验证..验证开始");
      currentUser.login(token);
      log.info("对用户[" + username + "]进行登录验证..验证通过");
    } catch (UnknownAccountException uae) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,未知账户");
      result.setCode(ResultCode.FAIL);
      result.setMessage("未知账户");
      return result;
    } catch (IncorrectCredentialsException ice) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,错误的凭证");
      result.setCode(ResultCode.FAIL);
      result.setMessage("密码不正确");
      return result;
    } catch (LockedAccountException lae) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,账户已锁定");
      result.setCode(ResultCode.FAIL);
      result.setMessage("账户已锁定");
      return result;
    } catch (ExcessiveAttemptsException eae) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,错误次数过多");
      result.setCode(ResultCode.FAIL);
      result.setMessage("用户名或密码错误次数过多");
      return result;
    } catch (AuthenticationException ae) {
      //通过处理Shiro的运行时AuthenticationException就可以控制用户登录失败或密码错误时的情景
      log.info("对用户[" + username + "]进行登录验证..验证未通过");
      ae.printStackTrace();
      result.setCode(ResultCode.FAIL);
      result.setMessage("用户名或密码不正确");
      return result;
    }

    //验证是否登录成功
    if (currentUser.isAuthenticated()) {
      log.info("用户[" + username + "]登录认证通过(这里可以进行一些认证通过后的一些系统参数初始化操作)");
      User mmallUser = mmallUserService.findBy("username", username);
      mmallUser.setPassword(StringUtils.EMPTY);
      mmallUser.setSalt(StringUtils.EMPTY);
      mmallUser.setQuestion(StringUtils.EMPTY);
      mmallUser.setAnswer(StringUtils.EMPTY);
      HttpSession session = request.getSession();
      //向HttpSession对象中存储数据
      if (mmallUser.getRole() == CONST.ROLE.ROLE_ADMIN) {
        session.setAttribute(CONST.CURRENT_USER, mmallUser);
        result.setCode(ResultCode.SUCCESS);
        result.setMessage("登录成功");
        return result;
      } else {
        return ResultGenerator.genFailResult("不是管理员，无法登录");
      }
    } else {
      token.clear();
      result.setCode(ResultCode.FAIL);
      result.setMessage("登录失败");
      return result;
    }
  }
}
