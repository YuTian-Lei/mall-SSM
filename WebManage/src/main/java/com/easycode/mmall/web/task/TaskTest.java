package com.easycode.mmall.web.task;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Configuration
@EnableScheduling
@Slf4j
public class TaskTest {

   /* @Scheduled(cron="0/5 * * * * ?")
    @Transactional
    public void funcReportInit(){
        System.out.println("---------------- 定时任务 ----------------");
    }
*/

    @Scheduled(cron="0/5 * * * * ?")
    public void funcReportInit(){
        //System.out.println("---------------- 定时任务 ----------------");
        log.info("---------------- 定时任务 ----------------");
    }

}
