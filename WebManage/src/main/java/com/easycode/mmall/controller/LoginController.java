package com.easycode.mmall.controller;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.DigestUtils;
import com.easycode.mmall.utils.EncodeUtils;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.RegisterVO;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
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
  private UserService mmallUserService;

  @PostMapping("register")
  @ApiOperation(value = "用户注册",notes = "用户注册",httpMethod = "POST")
  public Result<String> register(@Valid RegisterVO RegisterVO, BindingResult bindingResult){
    Result result  = ResultGenerator.genSuccessResult();
    if (bindingResult.hasErrors()) {
      String msg = bindingResult.getAllErrors().stream().map(objectError -> objectError.getDefaultMessage()).reduce((s, s2) -> s + "," + s2).get();
      result.setMessage(msg);
      result.setCode(ResultCode.FAIL);
      return result;
    }
    int resultCount = mmallUserService.checkUsername(RegisterVO.getUsername());
    if(resultCount > 0){
      result.setCode(ResultCode.FAIL);
      result.setMessage("用户名已存在");
      return result;
    }
    resultCount = mmallUserService.checkEmail(RegisterVO.getEmail());

    if(resultCount > 0){
      result.setCode(ResultCode.FAIL);
      result.setMessage("email已存在");
      return result;
    }

    User mmallUser = new User();
    //密码加密开始
    byte[] salt = DigestUtils.generateSalt(8);
    String saveSalt = EncodeUtils.encodeHex(salt);
    mmallUser.setSalt(saveSalt);
    byte[] hashPassword = DigestUtils.sha1(RegisterVO.getPassword().trim().getBytes(), salt, 1024);
    String passWord = EncodeUtils.encodeHex(hashPassword);
    //密码加密结束
    mmallUser.setPassword(passWord);
    mmallUser.setUsername(RegisterVO.getUsername());
    mmallUser.setQuestion(RegisterVO.getQuestion());
    mmallUser.setAnswer(RegisterVO.getAnswer());
    mmallUser.setPhone(RegisterVO.getPhone());
    mmallUser.setEmail(RegisterVO.getEmail());
    mmallUser.setRole(CONST.ROLE.ROLE_CUSTOMER);
    mmallUser.setCreateTime(new Date());
    mmallUser.setUpdateTime(new Date());
    resultCount = mmallUserService.save(mmallUser);
    if(resultCount == 0){
      result.setCode(ResultCode.FAIL);
      result.setMessage("注册失败");
      return result;
    }
    result.setCode(ResultCode.SUCCESS);
    result.setMessage("注册成功");
    return result;
  }

  @PostMapping("login")
  @ApiOperation(value = "用户登录", notes = "用户登录",httpMethod = "POST")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "username", value = "用户名", required = true, paramType = "String"),
      @ApiImplicitParam(name = "password", value = "密码", required = true, paramType = "String")
  })
  public Result<User> login(HttpServletRequest request, RedirectAttributes redirectAttributes,String username,String password) {
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
      return  result;
    } catch (IncorrectCredentialsException ice) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,错误的凭证");
      result.setCode(ResultCode.FAIL);
      result.setMessage("密码不正确");
      return  result;
    } catch (LockedAccountException lae) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,账户已锁定");
      result.setCode(ResultCode.FAIL);
      result.setMessage("账户已锁定");
      return  result;
    } catch (ExcessiveAttemptsException eae) {
      log.info("对用户[" + username + "]进行登录验证..验证未通过,错误次数过多");
      result.setCode(ResultCode.FAIL);
      result.setMessage("用户名或密码错误次数过多");
      return  result;
    } catch (AuthenticationException ae) {
      //通过处理Shiro的运行时AuthenticationException就可以控制用户登录失败或密码错误时的情景
      log.info("对用户[" + username + "]进行登录验证..验证未通过");
      ae.printStackTrace();
      result.setCode(ResultCode.FAIL);
      result.setMessage("用户名或密码不正确");
      return  result;
    }

    //验证是否登录成功
    if (currentUser.isAuthenticated()) {
      log.info("用户[" + username + "]登录认证通过(这里可以进行一些认证通过后的一些系统参数初始化操作)");
      User mmallUser = mmallUserService.findBy("username",username);
      mmallUser.setPassword(StringUtils.EMPTY);
      mmallUser.setSalt(StringUtils.EMPTY);
      mmallUser.setQuestion(StringUtils.EMPTY);
      mmallUser.setAnswer(StringUtils.EMPTY);
      HttpSession session = request.getSession();
      //向HttpSession对象中存储数据
      session.setAttribute(CONST.CURRENT_USER, mmallUser);
      result.setCode(ResultCode.SUCCESS);
      result.setMessage("登录成功");
      return result;
    } else {
      token.clear();
      result.setCode(ResultCode.FAIL);
      result.setMessage("登录失败");
      return  result;
    }
  }

  @PostMapping("logout")
  @ApiOperation(value = "用户登出" ,notes = "用户登出功能",httpMethod = "POST")
  public  Result<String> logout(){
    Result result = ResultGenerator.genSuccessResult();
    SecurityUtils.getSubject().logout();
    result.setCode(ResultCode.SUCCESS);
    result.setMessage("您已安全退出");
    return  result;
  }


  @PostMapping("paramsValid")
  @ApiOperation(value = "参数校验" ,notes = "参数校验",httpMethod = "POST")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "str",value = "用户名或者邮箱",required = true,paramType = "String"),
      @ApiImplicitParam(name = "type",value = "email：邮箱,username:用户名",required = true,paramType = "String")
  })
  public Result<String> checkValid(String str,String type){
    Result result = ResultGenerator.genSuccessResult();
    if(StringUtils.isNotBlank(type)){
        if(StringUtils.equals(CONST.USERNAME,type)){
          int resultCount = mmallUserService.checkUsername(str);
          if(resultCount > 0){
            result.setCode(ResultCode.FAIL);
            result.setMessage("用户名已存在");
            return result;
          }
        }

      if(StringUtils.equals(CONST.EMAIL,type)){
        int resultCount = mmallUserService.checkEmail(str);
        if(resultCount > 0){
          result.setCode(ResultCode.FAIL);
          result.setMessage("email已存在");
          return result;
        }
      }
    }else{
      return ResultGenerator.genFailResult("参数错误");
    }
    result.setCode(ResultCode.SUCCESS);
    result.setMessage("校验成功");
    return  result;
  }
}
