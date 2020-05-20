package com.easycode.mmall.web.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * @Description: //TODO
 * @Date: 2020/4/18 19:15
 * @Author: pengfei.L
 */
// 1.表明这是一个切面类
@Aspect
@Component
public class MyLogAspect {

  // 2. PointCut表示这是一个切点，@annotation表示这个切点切到一个注解上，后面带该注解的全类名
  // 切面最主要的就是切点，所有的故事都围绕切点发生
  // logPointCut()代表切点名称
  @Pointcut("@annotation(com.easycode.mmall.web.annotation.ModelUpdate)")
  public void logPointCut(){};

  // 3. 前置通知
  @Before("logPointCut()")
  public void logAround(JoinPoint joinPoint){
    // 获取方法名称
    String methodName = joinPoint.getSignature().getName();
    // 获取入参
    Object[] param = joinPoint.getArgs();

    StringBuilder sb = new StringBuilder();
    for(Object arg : param){
      sb.append(arg + "; ");
    }
    System.out.println("进入[" + methodName + "]方法,参数为:" + sb.toString());
  }
}