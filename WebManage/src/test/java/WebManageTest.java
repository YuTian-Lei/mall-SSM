import cn.hutool.core.date.DateUtil;
import com.easycode.mmall.utils.TimerManager;
import java.time.LocalDateTime;
import java.util.TimerTask;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.junit.Test;

public class WebManageTest {

  @Test
  public  void testDate() throws InterruptedException {
    Boolean res = true;
    CountDownLatch count = new CountDownLatch(20);
    TimerManager.getInstance(1).execute(new TimerTask() {
      @Override public void run() {
        System.out.println(Thread.currentThread().getName()+"定时任务当前执行时间:"+   DateUtil.now());
        count.countDown();
      }
    }, TimeUnit.SECONDS,5L);

    TimerManager.getInstance(2).execute(new TimerTask() {
      @Override public void run() {
        System.out.println(Thread.currentThread().getName()+"定时任务当前执行时间:"+   DateUtil.now());
        count.countDown();
      }
    }, TimeUnit.SECONDS,3L);

    while(res){
       System.out.println(Thread.currentThread().getName() +"主线程当前执行时间:"  + DateUtil.now());
       Thread.sleep(20300);
       TimerManager.getInstance(1).cancel();
       System.out.println(Thread.currentThread().getName() +"主线程取消执行时间:"  + DateUtil.now());
       res = false;
    }
    count.await();
  }
}
