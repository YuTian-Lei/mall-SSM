package com.easycode.mmall.wx.aop;


import java.io.IOException;
import java.util.concurrent.TimeUnit;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.support.atomic.RedisAtomicLong;
import org.springframework.stereotype.Component;

/**
 * @Description: //TODO
 * @Date: 2020/5/19 18:02
 * @Author: pengfei.L
 */
@Slf4j
@Aspect
@Component
public class LimitRequest {
    @Autowired
    RedisTemplate redisTemplate;

    @Autowired(required = false)
    private HttpServletRequest request;

    @Autowired(required = false)
    private HttpServletResponse response;

    @Pointcut("execution(* com.easycode.mmall.controller.*.*(..))")
    public void before(){}

    @Before("before()")
    public void requestLimit(JoinPoint joinPoint) throws IOException {
        String ip = request.getRemoteAddr();
        String uri = request.getRequestURI();
        String redisKey = "limit-ip-request:" + uri + ":" + ip;
        //设置在redis中的缓存，累加1
        RedisAtomicLong entityIdCounter = new RedisAtomicLong(redisKey, redisTemplate.getConnectionFactory());
        Long count= entityIdCounter.getAndIncrement();
        log.info("redisKey: {} , count: {}",redisKey,count);
        if(count == 0){
            //redisTemplate.expire(redisKey, 5, TimeUnit.MILLISECONDS);
            //设置过期时间
            entityIdCounter.expire(10, TimeUnit.SECONDS);
        }
        if(count > 0){
            response.sendError(500,"10s内不能重复提交数据");
        }
    }
}
