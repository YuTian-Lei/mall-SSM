package com.easycode.mmall.utils;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

/**
 * 定时任务管理器
 *
 * @author lpf
 */

public class TimerManager {

  /**
   * 多例模式  延迟加载（懒汉）
   */
  private static volatile TimerManager instance1 = null;
  private static volatile TimerManager instance2 = null;


  private static final int FIRST = 1;
  private static final int SECOND = 2;

  private TimerManager() { }

  /**
   * 多例模式双重检测
   */
  public static TimerManager getInstance(int key) {
    if (key == FIRST) {
      if (instance1 == null) {
        synchronized (TimerManager.class) {
          if (instance1 == null) {
            instance1 = new TimerManager();
          }
        }
      }
      return instance1;
    } else if (key == SECOND) {
      if (instance2 == null) {
        synchronized (TimerManager.class) {
          if (instance2 == null) {
            instance2 = new TimerManager();
          }
        }
      }
      return instance2;
    }
    return  null;
  }


  /*具体业务*/
  /**
   * 定时器
   */
  private Timer timer = new Timer();

  /**
   * 定时任务
   */
  private TimerTask timerTask = null;

  /**
   * 启动定时任务
   */
  public void execute(TimerTask task, TimeUnit timeUnit, Long periods) {
    //赋值新的timerTask
    cancel();
    timerTask = task;

    switch (timeUnit) {
      case DAYS:
        timer.schedule(timerTask, new Date(), TimeUnit.DAYS.toMillis(periods));
        break;
      case SECONDS:
        timer.schedule(timerTask, new Date(), TimeUnit.SECONDS.toMillis(periods));
        break;
      case HOURS:
        timer.schedule(timerTask, new Date(), TimeUnit.HOURS.toMillis(periods));
        break;
      case MINUTES:
        timer.schedule(timerTask, new Date(), TimeUnit.MINUTES.toMillis(periods));
        break;
      case NANOSECONDS:
        timer.schedule(timerTask, new Date(), TimeUnit.NANOSECONDS.toMillis(periods));
        break;
      case MICROSECONDS:
        timer.schedule(timerTask, new Date(), TimeUnit.MICROSECONDS.toMillis(periods));
        break;
      case MILLISECONDS:
        timer.schedule(timerTask, new Date(), TimeUnit.MILLISECONDS.toMillis(periods));
        break;
      default:
        timer.schedule(timerTask, new Date(), TimeUnit.MILLISECONDS.toMillis(periods));
        break;
    }
  }

  /**
   * 定时任务取消
   */
  public void cancel() {
    if (timerTask != null) {
      timerTask.cancel();
    }
    //如果不重新new，会报异常
    timerTask = null;

    //从任务队列中清除已经cancel的timerTask
    timer.purge();
  }
}
