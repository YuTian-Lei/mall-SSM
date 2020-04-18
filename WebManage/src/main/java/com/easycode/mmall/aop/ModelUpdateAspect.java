package com.easycode.mmall.aop;

import java.lang.reflect.Method;
import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

/**
 * 操作日志记录处理
 */
// 1.表明这是一个切面类
@Aspect
@Component
@Slf4j
public class ModelUpdateAspect {
  @Autowired(required = false)
  HttpServletRequest servletRequest;

  // 2. PointCut表示这是一个切点，@annotation表示这个切点切到一个注解上，后面带该注解的全类名
  // 切面最主要的就是切点，所有的故事都围绕切点发生
  // savePointCut()代表切点名称
  @Pointcut("@annotation(com.easycode.mmall.annotation.ModelUpdate))")
  public void savePointCut() {}



  /**
   * 前置通知 用于拦截Controller层记录用户的操作的开始时间
   * @param joinPoint 切点
   * @throws InterruptedException
   */
  // 3. 前置通知
  @Before("savePointCut()")
  public void doBefore(JoinPoint joinPoint) {
    Object[] args = joinPoint.getArgs();
    if(servletRequest==null){
      return;
    }
    Object userId = null;
    try{
      userId = servletRequest.getSession().getAttribute("userId");
    }catch (IllegalStateException e){
      log.warn("获取userId失败,此次操作日志未记录");
      return;
    }
    MethodSignature methodSignature=(MethodSignature)joinPoint.getSignature();
    if(methodSignature.getMethod().getName().equals("save")){
      Method setUserMethod= ReflectionUtils.findMethod(args[0].getClass(),"setCreateUser",Long.class);
      if(setUserMethod!=null&&userId!=null){
        ReflectionUtils.invokeMethod(setUserMethod,args[0],(Long)userId);
      }
    }else if(methodSignature.getMethod().getName().equals("update")){
      Method setUserMethod= ReflectionUtils.findMethod(args[0].getClass(),"setUpdateUser",Long.class);
      if(setUserMethod!=null&&userId!=null){
        ReflectionUtils.invokeMethod(setUserMethod,args[0],(Long)userId);
      }
      Method setTimeMethod= ReflectionUtils.findMethod(args[0].getClass(),"setUpdateTime",Date.class);
      if(setTimeMethod!=null){
        ReflectionUtils.invokeMethod(setTimeMethod,args[0],new Date());
      }
    }
  }
}
