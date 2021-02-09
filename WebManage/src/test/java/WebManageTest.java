import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import com.easycode.mmall.async.AsyncManager;
import com.easycode.mmall.async.AsyncProcessor;
import com.easycode.mmall.utils.BrowserUtils;
import com.easycode.mmall.utils.TimerManager;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.joda.time.DateTime;
import org.junit.Test;

/*@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-service.xml"})*/
public class WebManageTest {
    @Test
    public void testDate() throws InterruptedException {
        Boolean res = true;
        CountDownLatch count = new CountDownLatch(20);
        TimerManager.getInstance(1).execute(new TimerTask() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + "定时任务当前执行时间:" + DateUtil.now());
                count.countDown();
            }
        }, TimeUnit.SECONDS, 5L);

        TimerManager.getInstance(2).execute(new TimerTask() {
            @Override
            public void run() {
                System.out.println(Thread.currentThread().getName() + "定时任务当前执行时间:" + DateUtil.now());
                count.countDown();
            }
        }, TimeUnit.SECONDS, 3L);

        while (res) {
            System.out.println(Thread.currentThread().getName() + "主线程当前执行时间:" + DateUtil.now());
            Thread.sleep(20300);
            TimerManager.getInstance(1).cancel();
            System.out.println(Thread.currentThread().getName() + "主线程取消执行时间:" + DateUtil.now());
            res = false;
        }
        count.await();
    }

    @Test
    public void testBigDecimal() {
        System.out.println(0.05 + 0.01);
    }

    @Test
    public void testAysnc() {
        while (true) {
            AsyncManager.instance().execute(() -> {
                System.out.println("测试线程" + DateUtil.now());
                throw new NullPointerException();
            });
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    @Test
    public void testInterrupt() {
        CountDownLatch countDownLatch = new CountDownLatch(1);
        //阻塞线程
        Thread thread1 = new Thread(() -> {
            try {
                TimeUnit.SECONDS.sleep(5);
            } catch (InterruptedException e) {
                System.out.println(Thread.currentThread().getName() + "当前中断状态:" + Thread.currentThread().isInterrupted());
            }
        });

        //非阻塞线程
        Thread thread2 = new Thread(() -> {
            while (!Thread.interrupted()) {
                System.out.println(Thread.currentThread().getName() + "当前中断状态:" + Thread.currentThread().isInterrupted());
            }
            System.out.println(Thread.currentThread().getName() + "已中断");
            System.out.println(Thread.currentThread().getName() + "当前中断状态:" + Thread.currentThread().isInterrupted());
        });

        try {
            thread1.start();
            thread2.start();
            thread1.interrupt();
            TimeUnit.SECONDS.sleep(1);
            thread2.interrupt();
            countDownLatch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }


    @Test
    public void testOutFile() {

        try {
            File file = new File("D:\\ojbk\\test.txt");
            if (!FileUtil.exist(file)) {
                FileUtil.mkParentDirs(file);
                file.createNewFile();
            }
            OutputStream out = new FileOutputStream(file);
            out.write("我爱你".getBytes("UTF-8"));
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testInFile() {
        InputStream in = this.getClass().getClassLoader().getResourceAsStream("zfbinfo.properties");
    }

    @Test
    public void testConcurrentHashMap() {
        ConcurrentHashMap<Integer, String> map = new ConcurrentHashMap<>();

        AsyncManager.instance().execute(() -> {
            int i = 0;
            while (true) {
                map.put(1, Thread.currentThread().getName() + "    " + i);
                i++;
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        AsyncManager.instance().execute(() -> {
            int i = 0;
            while (true) {
                map.put(1, Thread.currentThread().getName() + "    " + i);
                i++;
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        while (true) {
            System.out.println(map.get(1));
        }


    }


    @Test
    public void runThread() throws InterruptedException {
        CountDownLatch cout = new CountDownLatch(1);
        for (int i = 1; i < 550; i++) {
            int finalI = i;
            AsyncProcessor.instance().execute(() -> {
                try {
                    System.out.println("线程id:" + finalI + "开始执行" + DateTime.now());
                    TimeUnit.SECONDS.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("线程id:" + finalI + "执行完毕————————————————————————————————————");
            });
        }
        cout.await();
        Executors.newCachedThreadPool();
    }

    @Test
    public void testPoolSize() throws InterruptedException {
        System.out.println(AsyncProcessor.instance().getPoolSize());
        TimeUnit.SECONDS.sleep(20);
        System.out.println(AsyncProcessor.instance().getPoolSize());
    }

    @Test
    public void classLoaderTest() {
        String test = BrowserUtils.getBrowserName("");
        System.out.println(test);
    }
}
