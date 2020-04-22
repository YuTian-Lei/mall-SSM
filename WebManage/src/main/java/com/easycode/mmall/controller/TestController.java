package com.easycode.mmall.controller;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.annotation.LoginRequired;
import com.easycode.mmall.async.AsyncManager;
import com.easycode.mmall.model.Order;
import com.easycode.mmall.model.OrderItem;
import com.easycode.mmall.model.SSEModel;
import com.easycode.mmall.model.User;
import com.easycode.mmall.po.HospitalBriefMap;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.DateUtils;
import com.easycode.mmall.utils.JsonResult;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.QueueMap;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import io.swagger.annotations.ApiOperation;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description: //TODO
 * @Date: 2020/4/4 11:11
 * @Author: pengfei.L
 * @Version: 1.0
 */
@Slf4j
@RestController
@RequestMapping("test")
public class TestController {
  @Autowired
  private UserService userService;

  @Autowired
  private HospitalBriefMap hospitalBriefMap;

  private  static volatile boolean isInit = true;

  @LoginRequired
  @GetMapping("path")
  public Result<Map<Object, Object>> testPath(HttpServletRequest request) {
    Map<Object, Object> map = Maps.newHashMap();
    //Servlet中获取路径
    //工程目录
    String servletContextRealPath = request.getSession().getServletContext().getRealPath("");
    //application路径
    String servletContextContextPath = request.getSession().getServletContext().getContextPath();
    //application路径下的资源路径
    Set<String> servletContextResourcePath =
        request.getSession().getServletContext().getResourcePaths("/");
    //application路径
    String contextPath = request.getContextPath();
    //当前servlet的路径
    String servletPath = request.getServletPath();
    map.put("servletContextRealPath", servletContextRealPath);
    map.put("servletContextContextPath", servletContextContextPath);
    map.put("servletContextResourcePath", servletContextResourcePath);
    map.put("contextPath", contextPath);
    map.put("servletPath", servletPath);

    //类中取得资源文件路径
    URL currentClassURL = TestController.class.getResource("zfbinfo.properties");
    URL currentClassPath = Class.class.getResource("zfbinfo.properties");
    URL classLoaderCurrentClassPath =
        TestController.class.getClassLoader().getResource("zfbinfo.properties");
    map.put("currentClassURL", currentClassURL);
    map.put("currentClassPath", currentClassPath);
    map.put("classLoaderCurrentClassPath", classLoaderCurrentClassPath);

    //文件对象获取路径方法
    File file = new File("D:\\ojbk\\test.txt");
    try {
      String canonicalPath = file.getCanonicalPath();
      String absolutePath = file.getAbsolutePath();
      String filePath = file.getPath();
      map.put("canonicalPath", canonicalPath);
      map.put("absolutePath", absolutePath);
      map.put("filePath", filePath);
    } catch (IOException e) {
      e.printStackTrace();
    }

    return ResultGenerator.genSuccessResult(map);
  }

  @LoginRequired(isRequired = true)
  // todo 不同用户请求不同产品阻塞队列
  @RequestMapping(value = "/get_data", produces = "text/event-stream;charset=UTF-8")
  public String push(HttpServletRequest request) throws InterruptedException {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
        return new SSEModel().toErrorString();
    }
    // todo 获取用户的阻塞队列
    Map map = hospitalBriefMap.getMap();
    BlockingQueue queue = (BlockingQueue)map.get(user.getId());
    if(queue == null){
      queue = new ArrayBlockingQueue(10);
      map.put(user.getId(),queue);
    }
    List<OrderItem> orderItemList = (List<OrderItem> ) queue.take();
    SSEModel model = new SSEModel();
    model.setData(orderItemList);
    System.out.println(model.toString());
    //！！！注意，EventSource返回的参数必须以data:开头，"\n\n"结尾，不然onmessage方法无法执行。
    return model.toString();
  }

  @LoginRequired
  @GetMapping("list")
  @ApiOperation(value = "获取用户列表", notes = "获取用户信息", httpMethod = "POST")
  public JsonResult getUserList(User user) {
    log.info("日志框架测试--开始,{}", DateUtils.format(new Date()));
    JsonResult jsonResult = new JsonResult();
    log.info("入参非格式化:{}",user.getCreateTime());
    log.info("入参格式化:{}",DateUtil.formatDateTime(user.getCreateTime()));
    List<User> mmallUserList = userService.findList(user);
    jsonResult.setResultCode(1);
    jsonResult.setData("page", new PageInfo<>(mmallUserList));
    log.info("出参非格式化:{}",mmallUserList.get(0).getCreateTime());
    log.info("出参格式化:{}",DateUtil.formatDateTime(mmallUserList.get(0).getCreateTime()));
    log.info("日志框架测试--结束,{}", DateUtils.format(new Date()));
    return jsonResult;
  }



  // todo 新增用户产品队列
  @RequestMapping("addOrder")
  public JsonResult addOrder(Integer id){
    Map map = hospitalBriefMap.getMap();
    BlockingQueue queue = (BlockingQueue)map.get(id);
    if(queue == null){
      queue = new ArrayBlockingQueue(10);
      map.put(id,queue);
    }
    OrderItem orderItem = new OrderItem ();
    orderItem.setUserId(id);
    orderItem.setProductName(IdUtil.simpleUUID());
    queue.add(Lists.newArrayList(orderItem));
    return JsonResult.buildSuccessJsonResult();
  }

  @RequestMapping("testJsonString")
  public String testJsonString(){
    System.out.println(JSONObject.toJSONString("testJsonString"));
    return "{\"ok\":\"testJsonString\"}";
  }

}
