package com.easycode.mmall.controller;

import com.easycode.mmall.model.mmallUser;
import com.easycode.mmall.service.mmallUserService;
import com.easycode.mmall.utils.DigestUtils;
import com.easycode.mmall.utils.EncodeUtils;
import com.easycode.mmall.utils.JsonResult;
import com.easycode.mmall.vo.RegisterVO;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.ExcessiveAttemptsException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Slf4j
@RestController
@RequestMapping("login")
public class LoginController {

  @Autowired
  private mmallUserService mmallUserService;

  @PostMapping("register")
  @ApiOperation(value = "用户注册",notes = "用户注册",httpMethod = "POST")
  public JsonResult register(@Valid RegisterVO RegisterVO, BindingResult bindingResult){
    JsonResult jsonResult = new JsonResult();
    if (bindingResult.hasErrors()) {
      String msg = bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).reduce((s, s2) -> s + "," + s2).get();
      jsonResult.setMessage(msg);
      jsonResult.setResultCode(0);
      return jsonResult;
    }
    mmallUser mmallUser = new mmallUser();
    //密码加密开始
    byte[] salt = DigestUtils.generateSalt(8);
    String saveSalt = EncodeUtils.encodeHex(salt);
    mmallUser.setSalt(saveSalt);
    byte[] hashPassword = DigestUtils.sha1(mmallUser.getPassword().trim().getBytes(), salt, 1024);
    String passWord = EncodeUtils.encodeHex(hashPassword);
    mmallUser.setPassword(passWord);
    //密码加密结束
    mmallUser.setRole(0);
    mmallUser.setCreateTime(new Date());
    mmallUser.setUpdateTime(new Date());
    mmallUserService.save(mmallUser);
    jsonResult.setResultCode(1);
    jsonResult.setMessage("注册成功");
    return jsonResult;
  }

  @PostMapping("login")
  @ApiOperation(value = "用户登录", notes = "用户登录",httpMethod = "POST")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "username", value = "用户名", required = true, paramType = "String"),
      @ApiImplicitParam(name = "password", value = "密码", required = true, paramType = "String")
  })
  public JsonResult  login(HttpServletRequest request, RedirectAttributes redirectAttributes,String username,String password) {
    JsonResult jsonResult = new JsonResult();
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
      redirectAttributes.addFlashAttribute("message", "未知账户");
    } catch (IncorrectCredentialsException ice) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,错误的凭证");
      redirectAttributes.addFlashAttribute("message", "密码不正确");
    } catch (LockedAccountException lae) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,账户已锁定");
      redirectAttributes.addFlashAttribute("message", "账户已锁定");
    } catch (ExcessiveAttemptsException eae) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,错误次数过多");
      redirectAttributes.addFlashAttribute("message", "用户名或密码错误次数过多");
    } catch (AuthenticationException ae) {
      //通过处理Shiro的运行时AuthenticationException就可以控制用户登录失败或密码错误时的情景
      log.info("对用户[" + username + "]进行登录验证..验证未通过");
      ae.printStackTrace();
      redirectAttributes.addFlashAttribute("message", "用户名或密码不正确");
    }

    //验证是否登录成功
    if (currentUser.isAuthenticated()) {
      log.info("用户[" + username + "]登录认证通过(这里可以进行一些认证通过后的一些系统参数初始化操作)");
      HttpSession session = request.getSession();
      //向HttpSession对象中存储数据
      session.setAttribute("username", username);
      jsonResult.setResultCode(1);
      jsonResult.setMessage("登录成功");
      return jsonResult;
    } else {
      token.clear();
      jsonResult.setResultCode(0);
      jsonResult.setMessage("登录失败");
      return  jsonResult;
    }
  }

  @PostMapping("logout")
  @ApiOperation(value = "用户登出" ,notes = "用户登出功能",httpMethod = "POST")
  public  JsonResult logout(){
    JsonResult jsonResult = new JsonResult();
    SecurityUtils.getSubject().logout();
    jsonResult.setResultCode(1);
    jsonResult.setMessage("您已安全退出");
    return  jsonResult;
  }



}
