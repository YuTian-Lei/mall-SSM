package com.easycode.mmall.app.interceptor;

import com.alibaba.fastjson.JSON;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.app.conf.PassToken;
import com.easycode.mmall.app.conf.UserLoginException;
import com.easycode.mmall.app.conf.UserLoginToken;
import com.easycode.mmall.app.util.JwtTokenUtil;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.ResultGenerator;
import java.lang.reflect.Method;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * 登录权限
 *
 * @author hpb
 */
@Slf4j
public class AuthenticationInterceptor implements HandlerInterceptor {
    @Autowired
    UserService appUserService;
    private static String KEY_CODE_PREFIX = "code_";

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest,
                             HttpServletResponse httpServletResponse, Object object) throws Exception {

        log.info("request:{},param:{}", httpServletRequest.getRequestURI(),
                JSON.toJSONString(httpServletRequest.getParameterMap()));
        String tokenHeader = httpServletRequest.getHeader(JwtTokenUtil.TOKEN_HEADER);
        if (!(object instanceof HandlerMethod)) {
            return true;
        }
        HandlerMethod handlerMethod = (HandlerMethod) object;
        Method method = handlerMethod.getMethod();
        //检查是否有passtoken注释，有则跳过认证
        if (method.isAnnotationPresent(PassToken.class)) {
            PassToken passToken = method.getAnnotation(PassToken.class);
            if (passToken.required()) {
                return true;
            }
        }
        //检查有没有需要用户权限的注解
        if (method.isAnnotationPresent(UserLoginToken.class)) {
            UserLoginToken userLoginToken = method.getAnnotation(UserLoginToken.class);
            if (userLoginToken.required()) {
                if (tokenHeader == null || !tokenHeader.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
                    throw new UserLoginException(
                            ResultGenerator.genFailResult("no token", ResultCode.NOTOKEN));
                }
                tokenHeader = tokenHeader.replace(JwtTokenUtil.TOKEN_PREFIX, "");
                JwtTokenUtil.getUsername(tokenHeader);
            }
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest,
                           HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView)
            throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest,
                                HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}