package com.easycode.mmall.web.po;

import com.easycode.mmall.model.OrderItem;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.OrderItemService;
import com.easycode.mmall.service.UserService;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @Description: //TODO
 * @Date: 2020/4/19 15:24
 * @Author: pengfei.L
 */
@Component
public class HospitalBriefMap {
  private final ConcurrentHashMap<Integer, BlockingQueue> map = new ConcurrentHashMap<>();

  @Autowired
  private UserService userService;

  @Autowired
  private OrderItemService orderItemService;


  //初始化方法的注解方式  等同与init-method=init
  @PostConstruct
  public void init(){
    List<User> userList = userService.findAll();


    userList.forEach(user -> {
      OrderItem orderItem = new OrderItem();
      orderItem.setUserId(user.getId());
      List<OrderItem> orderItemList = orderItemService.findList(orderItem);
      BlockingQueue queue = new ArrayBlockingQueue(10);
      queue.add(orderItemList);
      map.put(user.getId(),queue);
    });
  }

  //销毁方法的注解方式  等同于destory-method=destory222
  @PreDestroy
  public void destroy(){
    System.out.println("hospitalBriefMap銷毀");
  }


  public ConcurrentHashMap<Integer, BlockingQueue> getMap() {
    return map;
  }
}
