package com.easycode.mmall.aop;

import com.alibaba.fastjson.JSON;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static java.util.stream.Collectors.joining;

@Slf4j
@Aspect
@Component
public class ConsoleLogAspect {
  //设置切面点（切面地址根据自己的项目填写）
  @Pointcut(value = "(execution(* com.easycode.mmall.controller.*.*(..)))")
  public void webLog() {
  }

  //指定切点前的处理方法
  @Before("webLog()")
  public void doBefore(JoinPoint joinPoint) throws Exception {
    //获取request对象
    ServletRequestAttributes attributes =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    HttpServletRequest request = attributes.getRequest();
    StringBuilder sb = new StringBuilder();
    //拼接请求内容
    sb.append("\n请求路径:" + request.getRequestURL().toString() + "  " + request.getMethod() + "\n");
    //判断请求是什么请求
    if (request.getMethod().equalsIgnoreCase(RequestMethod.GET.name())) {
      Map<String, String[]> parameterMap = request.getParameterMap();
      Map<String, String> paramMap = new HashMap<>();
      parameterMap.forEach(
          (key, value) -> paramMap.put(key, Arrays.stream(value).collect(joining(","))));
      sb.append("请求内容:" + JSON.toJSONString(paramMap));
    } else if (request.getMethod().equalsIgnoreCase(RequestMethod.POST.name())) {
      Object[] args = joinPoint.getArgs();

      StringBuilder stringBuilder = new StringBuilder();
      if (args.length > 1) {
        Arrays.stream(args)
            .forEach(object -> stringBuilder.append((object != null ? object.toString() : "" ).replace("=", ":")));
      }
      if (stringBuilder.length() == 0) {
        stringBuilder.append("{}");
      }
      sb.append("请求内容:" + stringBuilder.toString());
    }
    log.info(sb.toString());
  }
}
