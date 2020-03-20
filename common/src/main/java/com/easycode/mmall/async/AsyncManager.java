package com.easycode.mmall.async;

import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.concurrent.BasicThreadFactory;

/**
 * 异步任务管理器
 *
 * @author lpf
 */
@Slf4j
public class AsyncManager {
    /**
     * 操作延迟10毫秒
     */
    private static final int OPERATE_DELAY_TIME = 10;

    /**
     * 线程池核心池的大小<corePoolSize>  -- 计算密集型
     * 线程数 = CPU核数+1，也可以设置成CPU核数*2，但还要看JDK的版本以及CPU配置(服务器的CPU有超线程)
     */
    /*private static final int COREPOOLSIZE = Runtime.getRuntime().availableProcessors() * 2;*/


    /**
     * 线程池核心池的大小<corePoolSize>  -- IO密集型
     * 计算公式：线程数 = CPU核心数/(1-阻塞系数) 这个阻塞系数一般为0.8~0.9之间，也可以取0.8或者0.9
     */
    private static final int COREPOOLSIZE = Runtime.getRuntime().availableProcessors() * 10;

    /**
     * 线程池的最大线程数<maximumPoolSize>
     */
    private static final int MAXIMUMPOOLSIZE  = COREPOOLSIZE * 2;

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
     * 线程工厂名称
     */
    private static final ThreadFactory FACTORY = new BasicThreadFactory.Builder().namingPattern(THREAD_POOL_NAME).build();

    /**
     * 单例模式 -- 饿汉
     */
    private static AsyncManager instance = new AsyncManager();

    private AsyncManager(){}

    public static AsyncManager instance() {
        return instance;
    }



    /**
     * 异步操作任务调度线程池
     */
    private ScheduledExecutorService executor = new ScheduledThreadPoolExecutor(COREPOOLSIZE, FACTORY) {
        @Override
        protected void afterExecute(Runnable r, Throwable t) {
            super.afterExecute(r, t);
            printException(r, t);
        }
    };

    private void printException(Runnable r, Throwable t) {
        if (t == null && r instanceof Future<?>) {
            try {
                Future<?> future = (Future<?>) r;
                if (future.isDone()) {
                    future.get();
                }
            } catch (CancellationException ce) {
                t = ce;
            } catch (ExecutionException ee) {
                t = ee.getCause();
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        }
        if (t != null) {
            log.error(t.getMessage(), t);
        }
    }


    /**
     * 执行任务
     *
     * @param task 任务
     */
    public void execute(Runnable task) {
        executor.schedule(task, OPERATE_DELAY_TIME, TimeUnit.MILLISECONDS);
    }

    /**
     * 停止线程池
     * 先使用shutdown, 停止接收新任务并尝试完成所有已存在任务.
     * 如果超时, 则调用shutdownNow, 取消在workQueue中Pending的任务,并中断所有阻塞函数.
     * 如果仍人超時，則強制退出.
     * 另对在shutdown时线程本身被调用中断做了处理.
     */
    public void shutdown() {
        if (executor != null && !executor.isShutdown()) {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(120, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                    if (!executor.awaitTermination(120, TimeUnit.SECONDS)) {
                        log.info("Pool did not terminate");
                    }
                }
            } catch (InterruptedException ie) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
}
