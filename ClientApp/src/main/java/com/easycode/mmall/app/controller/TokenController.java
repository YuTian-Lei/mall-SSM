package com.easycode.mmall.app.controller;

import com.easycode.mmall.app.conf.PassToken;
import com.easycode.mmall.app.conf.UserLoginToken;
import com.easycode.mmall.app.util.JwtTokenUtil;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.DigestUtils;
import com.easycode.mmall.utils.EncodeUtils;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * @Description: //TODO
 * @Date: 2020/8/28 17:48
 * @Author: pengfei.L
 */

public class TokenController {
    @Autowired
    UserService appUserService;

    /**
     * 登录
     */
    @PostMapping(value = "/login")
    @PassToken
    @ApiOperation(value = "普通登录",notes = "普通登录")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "phone",value = "手机号",required = true,paramType = "String"),
        @ApiImplicitParam(name = "password",value = "密码",required = true,paramType = "String")
    })
    public Result login(String phone, String password, HttpServletRequest request,
        HttpServletResponse response) {
        Result result = ResultGenerator.genSuccessResult();

        User appUser = appUserService.findBy("accountNumber", phone);
        if (appUser == null) {
            return ResultGenerator.genFailResult("用户不存在");
        }
        byte[] salt = EncodeUtils.decodeHex(appUser.getSalt());
        byte[] hashPassword = DigestUtils.sha1(password.trim().getBytes(), salt, 1024);
        String realPwd = EncodeUtils.encodeHex(hashPassword);
        if (!appUser.getPassword().equals(realPwd)) {
            return ResultGenerator.genFailResult("密码错误");
        }
        //创建token
        addToken(appUser.getId().longValue(), appUser.getUsername(), response);
        return result;
    }

    /**
     * 添加共享用户
     */
    @PostMapping(value = "/addShareUser")
    @UserLoginToken
    @ApiOperation(value = "添加共享用户")
    public Result addShareUser() {
        return ResultGenerator.genSuccessResult("success");
    }

    @UserLoginToken
    @PostMapping(value = "/refreshToken")
    @ApiOperation(value = "刷新token")
    public Result<String> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String phone = JwtTokenUtil.getUsername(request);
        String userId = JwtTokenUtil.getUserId(request);
        String refreshToken = addToken(Long.parseLong(userId), phone, response);
        return ResultGenerator.genSuccessResult(refreshToken);
    }


    private String addToken(Long userId, String account, HttpServletResponse response) {
        String token =
            JwtTokenUtil.createToken(userId.toString(), account, true);
        response.setHeader(JwtTokenUtil.TOKEN_HEADER, JwtTokenUtil.TOKEN_PREFIX + token);
        return token;
    }

    private String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.indexOf(",") != -1) {
            ip = ip.substring(0, ip.indexOf(",")).trim();
        }
        return ip;
    }
}
