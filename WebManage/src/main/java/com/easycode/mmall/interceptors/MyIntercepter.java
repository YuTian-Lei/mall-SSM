package com.easycode.mmall.interceptors;

import com.alibaba.fastjson.JSONObject;
import com.easycode.mmall.annotation.LoginRequired;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * 登陆拦截器 场景：用户点击查看的时候，我们进行登陆拦截器操作，判断用户是否登陆？ 登陆，则不拦截，没登陆，则转到登陆界面； TODO 作者：原明卓 时间：2016年1月8日 下午3:25:35
 * 工程：SpringMvcMybatis1Demo
 */
@Slf4j
public class MyIntercepter implements HandlerInterceptor {
  @Override
  public boolean preHandle(HttpServletRequest httpServletRequest,
      HttpServletResponse httpServletResponse, Object handler) {
    //System.out.println("拦截成功");
    log.info("request:{},param:{}", httpServletRequest.getRequestURI(), JSONObject.toJSONString(httpServletRequest.getParameterMap()));

    // 反射获取方法上的LoginRequred注解
    try {
      HandlerMethod handlerMethod = (HandlerMethod) handler;
      LoginRequired loginRequired = handlerMethod.getMethod().getAnnotation(LoginRequired.class);
      if (loginRequired != null && loginRequired.isRequired()) {
        //需要登录
        //需要登录，提示用户登录
        httpServletResponse.setContentType("application/json; charset=utf-8");
        httpServletResponse.getWriter().print("你访问的资源需要登录");
        return false;
      }
    } catch (ClassCastException | IOException e) {
      log.error("静态资源访问request:{}", httpServletRequest.getRequestURI());
      return true;
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
