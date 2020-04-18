package com.easycode.mmall.controller;

import cn.hutool.core.date.DateUtil;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.easycode.mmall.annotation.LoginRequired;
import com.easycode.mmall.model.SSEModel;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.vo.QueueMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description: //TODO
 * @Date: 2020/4/4 11:11
 * @Author: pengfei.L
 * @Version: 1.0
 */

@RestController
@RequestMapping("test")
public class TestController {
  @Autowired
  private UserService userService;

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

  @RequestMapping(value = "/get_data", produces = "text/event-stream;charset=UTF-8")
  public String push() throws InterruptedException {
    if(isInit){
      QueueMap.userList = userService.findAll();
      isInit = false;
    }


    SSEModel model = new SSEModel();
    List list = Lists.newArrayList();
    Map map1 = Maps.newHashMap();
    map1.put("username", "lpf");
    map1.put("time", DateUtil.now());
    TimeUnit.SECONDS.sleep(2);
    Map map2 = Maps.newHashMap();
    map2.put("username", "ceshi1");
    map2.put("time", DateUtil.now());
    TimeUnit.SECONDS.sleep(2);
    Map map3 = Maps.newHashMap();
    map3.put("username", "ceshi2");
    map3.put("time", DateUtil.now());
    list.add(map1);
    list.add(map2);
    list.add(map3);

    model.setData(QueueMap.userList);
    System.out.println(model.toString());
    //！！！注意，EventSource返回的参数必须以data:开头，"\n\n"结尾，不然onmessage方法无法执行。
    return model.toString();
  }
}
