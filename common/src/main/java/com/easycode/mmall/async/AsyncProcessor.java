package com.easycode.mmall.async;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.concurrent.BasicThreadFactory;

/**
 * @author lpf
 * @Description: 异步任务管理器 包含拒绝策略/线程异常捕获/自定义线程池各个参数设置
 * @date 2020/3/20 17:45
 */
@Slf4j
public class AsyncProcessor {

  /**
   * 线程池核心池的大小<corePoolSize>  -- 计算密集型
   * 线程数 = CPU核数+1，也可以设置成CPU核数*2，但还要看JDK的版本以及CPU配置(服务器的CPU有超线程)
   */
  /*private static final int COREPOOLSIZE = Runtime.getRuntime().availableProcessors() * 2;*/

  /**
   * 线程池核心池的大小<corePoolSize>  -- IO密集型 计算公式：线程数 = CPU核心数/(1-阻塞系数) 这个阻塞系数一般为0.8~0.9之间，也可以取0.8或者0.9
   */
  private static final int COREPOOLSIZE = Runtime.getRuntime().availableProcessors() * 10;

  /**
   * 线程池的最大线程数<maximumPoolSize>
   */
  private static final int MAXIMUMPOOLSIZE = COREPOOLSIZE * 2;

  /**
   * 默认线程存活时间
   */
  private static final long DEFAULT_KEEP_ALIVE = 60L;

  /**
   * 默认队列大小
   */
  private static final int DEFAULT_SIZE = 500;

  /**
   * 线程池名称格式
   */
  private static final String THREAD_POOL_NAME = "SchedulePoolThreadExecutor-%d";

  /**
   * 捕获线程异常
   * */
  private static Thread.UncaughtExceptionHandler uncaughtExceptionHandler = new Thread.UncaughtExceptionHandler(){
    @Override public void uncaughtException(Thread t, Throwable e) {
      if (e != null) {
        log.error(e.getMessage(), e);
      }
    }
  };

  /**
   * 线程工厂
   */
  private static final ThreadFactory FACTORY =
      new BasicThreadFactory.Builder().namingPattern(THREAD_POOL_NAME).uncaughtExceptionHandler(uncaughtExceptionHandler).build();

  /**
   * 执行队列
   */
  private static BlockingQueue<Runnable> executeQueue = new ArrayBlockingQueue<>(DEFAULT_SIZE);

  /**
   * 自定义拒绝策略
   */
  private static RejectedExecutionHandler rejectedExecutionHandler = new RejectedExecutionHandler(){
    @Override public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
      // todo 记录异常
      // todo 报警处理等
      log.error("线程池拒绝策略触发!当前执行任务数:{}" , executor.getActiveCount());
    }
  };

  /**
   * 单例模式 -- 饿汉
   */
  private static AsyncProcessor instance = new AsyncProcessor();

  private AsyncProcessor() {
  }

  public static AsyncProcessor instance() {
    return instance;
  }

  /**
   * 异步操作任务调度线程池
   */
  private ExecutorService executor = new ThreadPoolExecutor(
      COREPOOLSIZE,
      MAXIMUMPOOLSIZE,
      DEFAULT_KEEP_ALIVE,
      TimeUnit.SECONDS,
      executeQueue,
      FACTORY,
      rejectedExecutionHandler);

  /**
   * 执行任务
   */
  public void execute(Runnable task) {
    executor.execute(task);
  }

  /**
   * 提交任务
   */
  public <T> Future<T> submit(Callable<T> task) {
    return executor.submit(task);
  }

  /**
   * 停止线程池
   */
  public void shutdown() {
    if(executor != null)
    {
      executor.shutdown();
    }
  }
}




