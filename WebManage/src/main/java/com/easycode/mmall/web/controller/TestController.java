package com.easycode.mmall.web.controller;

import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.entity.ExportParams;
import cn.afterturn.easypoi.excel.entity.params.ExcelExportEntity;
import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.RandomUtil;
import com.alibaba.fastjson.JSONObject;
import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.utils.DateUtils;
import com.easycode.mmall.web.utils.DownLoadFileUtil;
import com.easycode.mmall.web.utils.ReturnUtils;
import com.easycode.mmall.utils.JsonResult;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.web.annotation.LoginRequired;
import com.easycode.mmall.model.OrderItem;
import com.easycode.mmall.model.SSEModel;
import com.easycode.mmall.model.User;
import com.easycode.mmall.web.po.HospitalBriefMap;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.Result;
import com.github.pagehelper.PageInfo;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import io.swagger.annotations.ApiOperation;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
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

  @GetMapping("testDateFormat")
  @ApiOperation(value = "获取用户列表", notes = "获取用户信息", httpMethod = "POST")
  public JsonResult testDateFormat(Date beginDate) {
    log.info("日志框架测试--开始,{}", DateUtils.format(new Date()));
    JsonResult jsonResult = new JsonResult();
    log.info("入参非格式化:{}",beginDate);
    log.info("入参格式化:{}",DateUtil.formatDateTime(beginDate));
    jsonResult.setData("date",beginDate);
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


  @RequestMapping("testDuplicaterName")
  public String  testDuplicaterName(@RequestParam("username") List<String> username){
    username.forEach(user->{
      System.out.println(user);
    });
    return "success";
  }

  @RequestMapping("testGetUrl")
  public String  testGetUrl(String name,Long age){
    System.out.println(name);
    System.out.println(age);
    return "success";
  }

  @RequestMapping("testJsonParams")
  public JSONObject testJsonParams(@RequestBody JSONObject object){
    System.out.println(object.toJSONString());
    System.out.println(object.toString());
    return object;
  }


  @RequestMapping("/recheckExcelExcport")
  @ResponseBody
  public ModelMap recheckExcelExcport(String id, HttpServletResponse response){
    //todo 构建导出数据集
    List<Map<String,Object>> dataList = Lists.newArrayList();
    //todo 构建导出excel格式
    List<ExcelExportEntity> exportBean = assembleRecheckExcelExportEntity();
    //todo 生成excel表
    Workbook workbook = ExcelExportUtil.exportExcel(new ExportParams(null, "复查数据"), exportBean, dataList);
    //todo 写入文件
    String filePath = "D:\\img" + "筛查数据导出" + DateUtil.format(new Date(), DatePattern.PURE_DATETIME_MS_FORMAT) + RandomUtil
        .randomNumbers(4) + ".xlsx";
    File file = new File(filePath);
    try{
      if(!file.exists()){
        //创建文件目录
        FileUtil.mkParentDirs(file);
        //创建文件
        file.createNewFile();
      }
      FileOutputStream fos = new FileOutputStream(file);
      workbook.write(fos);
      fos.close();
    }catch (Exception e){
      log.error("生成Excel异常",e);
      return ReturnUtils.Success("Excel导出错误", null);
    }
    //todo 下载文件
    DownLoadFileUtil.download(response,filePath,"UTF-8");
    return ReturnUtils.Success("导出成功", null, "/admin/recheck/index");
  }



  private  List<ExcelExportEntity>  assembleRecheckExcelExportEntity(){
    List<ExcelExportEntity> exportBean = Lists.newArrayList();
    //基本类型
    ExcelExportEntity studentName = new ExcelExportEntity("姓名","studentName");
    ExcelExportEntity sex = new ExcelExportEntity("性别","sex");
    ExcelExportEntity school = new ExcelExportEntity("学校","school");
    ExcelExportEntity gradeName = new ExcelExportEntity("所在年级","gradeName");
    ExcelExportEntity className = new ExcelExportEntity("班级","className");
    ExcelExportEntity idCard = new ExcelExportEntity("身份证号","idCard");
    ExcelExportEntity birthday = new ExcelExportEntity("出生日期","birthday");
    birthday.setDatabaseFormat("yyyy-MM-dd");
    ExcelExportEntity phone = new ExcelExportEntity("联系电话","phone");
    ExcelExportEntity pupillaryDistance = new ExcelExportEntity("瞳距","pupillaryDistance");
    ExcelExportEntity prescription = new ExcelExportEntity("配镜处方","prescription");
    ExcelExportEntity checkTime = new ExcelExportEntity("检查日期","checkTime");
    checkTime.setDatabaseFormat("yyyy-MM-dd");

    //复杂对象
    //屈光
    ExcelExportEntity dioptricBean = new ExcelExportEntity("屈光", "dioptric");
    List<ExcelExportEntity> dioptricGroup = Lists.newArrayList();
    dioptricGroup.add(new ExcelExportEntity("裸眼视力右","nakedVisionRight"));
    dioptricGroup.add(new ExcelExportEntity("裸眼视力左","nakedVisionLeft"));
    dioptricGroup.add(new ExcelExportEntity("戴镜视力右","cvaRight"));
    dioptricGroup.add(new ExcelExportEntity("戴镜视力左","cvaLeft"));
    dioptricGroup.add(new ExcelExportEntity("球镜（右眼）","oneRightDs"));
    dioptricGroup.add(new ExcelExportEntity("柱镜（右眼）","oneRightDc"));
    dioptricGroup.add(new ExcelExportEntity("轴位（右眼）","oneRightAxis"));
    dioptricGroup.add(new ExcelExportEntity("等效球镜（右眼）","oneRightSe"));
    dioptricGroup.add(new ExcelExportEntity("球镜（左眼）","oneLeftDs"));
    dioptricGroup.add(new ExcelExportEntity("柱镜（左眼）","oneLeftDc"));
    dioptricGroup.add(new ExcelExportEntity("轴位（左眼）","oneLeftAxis"));
    dioptricGroup.add(new ExcelExportEntity("等效球镜（左眼）","oneLeftSe"));
    dioptricBean.setList(dioptricGroup);
    //A超
    ExcelExportEntity aScanBean = new ExcelExportEntity("A超", "aScan");
    List<ExcelExportEntity> aScanGroup = Lists.newArrayList();
    aScanGroup.add(new ExcelExportEntity("眼轴右眼","acRightAx"));
    aScanGroup.add(new ExcelExportEntity("角膜曲率1右眼","acRightCurvature1"));
    aScanGroup.add(new ExcelExportEntity("角膜曲率2右眼","acRightCurvature2"));
    aScanGroup.add(new ExcelExportEntity("眼轴左眼","acLeftAx"));
    aScanGroup.add(new ExcelExportEntity("角膜曲率1左眼","acLeftCurvature1"));
    aScanGroup.add(new ExcelExportEntity("角膜曲率2左眼","acLeftCurvature2"));
    aScanBean.setList(aScanGroup);
    //眼压
    ExcelExportEntity iopBean = new ExcelExportEntity("眼压", "iop");
    List<ExcelExportEntity> iopGroup = Lists.newArrayList();
    iopGroup.add(new ExcelExportEntity("眼压左眼","iopLeft"));
    iopGroup.add(new ExcelExportEntity("眼压右眼","iopRight"));
    iopBean.setList(iopGroup);
    //oct图
    ExcelExportEntity octBean = new ExcelExportEntity("oct图", "oct");
    List<ExcelExportEntity> octGroup = Lists.newArrayList();
    ExcelExportEntity octleft = new ExcelExportEntity("oct图左眼","octLeft");
    ExcelExportEntity octRight = new ExcelExportEntity("oct图右眼","octRight");
    octleft.setType(2);
    octleft.setExportImageType(1);
    octRight.setType(2);
    octRight.setExportImageType(1);
    octGroup.add(octleft);
    octGroup.add(octRight);
    octBean.setList(octGroup);
    //SW9000生物测量仪
    ExcelExportEntity sw9000 = new ExcelExportEntity("SW9000", "sw9000");
    List<ExcelExportEntity> sw9000Group = Lists.newArrayList();
    sw9000Group.add(new ExcelExportEntity("右眼轴位1","swOdAone"));
    sw9000Group.add(new ExcelExportEntity("右眼轴位2","swOdAtwo"));
    sw9000Group.add(new ExcelExportEntity("右眼眼轴长度","swOdAl"));
    sw9000Group.add(new ExcelExportEntity("右眼角膜厚度","swOdCct"));
    sw9000Group.add(new ExcelExportEntity("右眼前房深度","swOdAd"));
    sw9000Group.add(new ExcelExportEntity("右眼角膜散光","swOdAst"));
    sw9000Group.add(new ExcelExportEntity("右眼角膜曲率1","swOdK1"));
    sw9000Group.add(new ExcelExportEntity("右眼角膜曲率2","swOdK2"));
    sw9000Group.add(new ExcelExportEntity("右眼晶状体厚度","swOdLt"));
    sw9000Group.add(new ExcelExportEntity("右眼瞳孔大小","swOdPd"));
    sw9000Group.add(new ExcelExportEntity("右眼玻璃体厚度","swOdVt"));
    sw9000Group.add(new ExcelExportEntity("右眼白到白距离","swOdWtw"));
    sw9000Group.add(new ExcelExportEntity("左眼轴位1","swOsAone"));
    sw9000Group.add(new ExcelExportEntity("左眼轴位2","swOsAtwo"));
    sw9000Group.add(new ExcelExportEntity("左眼眼轴长度","swOsAl"));
    sw9000Group.add(new ExcelExportEntity("左眼角膜厚度","swOsCct"));
    sw9000Group.add(new ExcelExportEntity("左眼前房深度","swOsAd"));
    sw9000Group.add(new ExcelExportEntity("左眼角膜散光","swOsAst"));
    sw9000Group.add(new ExcelExportEntity("左眼角膜曲率1","swOsK1"));
    sw9000Group.add(new ExcelExportEntity("左眼角膜曲率2","swOsK2"));
    sw9000Group.add(new ExcelExportEntity("左眼晶状体厚度","swOsLt"));
    sw9000Group.add(new ExcelExportEntity("左眼瞳孔大小","swOsPd"));
    sw9000Group.add(new ExcelExportEntity("左眼玻璃体厚度","swOsVt"));
    sw9000Group.add(new ExcelExportEntity("左眼白到白距离","swOsWtw"));
    sw9000.setList(sw9000Group);
    //蔡司生物测量仪
    ExcelExportEntity zeiss = new ExcelExportEntity("蔡司生物测量仪", "zeiss");
    List<ExcelExportEntity> zeissGroup = Lists.newArrayList();
    zeissGroup.add(new ExcelExportEntity("眼轴长度右眼(AL)","zeissOdAl"));
    zeissGroup.add(new ExcelExportEntity("中央角膜厚度右眼(CCT)","zeissOdCct"));
    zeissGroup.add(new ExcelExportEntity("前房深度右眼(ACD)","zeissOdAcd"));
    zeissGroup.add(new ExcelExportEntity("晶状体厚度右眼(LT)","zeissOdLt"));
    zeissGroup.add(new ExcelExportEntity("角膜曲率右眼(K1)","zeissOdK1"));
    zeissGroup.add(new ExcelExportEntity("角膜曲率右眼(K2)","zeissOdK2"));
    zeissGroup.add(new ExcelExportEntity("△K右眼(△K)","zeissOdK"));
    zeissGroup.add(new ExcelExportEntity("白到白/角膜直径右眼(WTW)","zeissOdWtw"));
    zeissGroup.add(new ExcelExportEntity("瞳孔值右眼(P)","zeissOdP"));
    zeissGroup.add(new ExcelExportEntity("眼轴长度左眼(AL)","zeissOsAl"));
    zeissGroup.add(new ExcelExportEntity("中央角膜厚度左眼(CCT)","zeissOsCct"));
    zeissGroup.add(new ExcelExportEntity("前房深度左眼(ACD)","zeissOsAcd"));
    zeissGroup.add(new ExcelExportEntity("晶状体厚度左眼(LT)","zeissOsLt"));
    zeissGroup.add(new ExcelExportEntity("角膜曲率左眼(K1)","zeissOsK1"));
    zeissGroup.add(new ExcelExportEntity("角膜曲率左眼(K2)","zeissOsK2"));
    zeissGroup.add(new ExcelExportEntity("△K左眼(△K)","zeissOsK"));
    zeissGroup.add(new ExcelExportEntity("白到白/角膜直径左眼(WTW)","zeissOsWtw"));
    zeissGroup.add(new ExcelExportEntity("瞳孔值左眼(P)","zeissOsWtw"));
    zeiss.setList(zeissGroup);
    //todo 装配
    exportBean.add(studentName);
    exportBean.add(sex);
    exportBean.add(school);
    exportBean.add(gradeName);
    exportBean.add(className);
    exportBean.add(idCard);
    exportBean.add(birthday);
    exportBean.add(phone);
    exportBean.add(dioptricBean);
    exportBean.add(pupillaryDistance);
    exportBean.add(aScanBean);
    exportBean.add(iopBean);
    exportBean.add(octBean);
    exportBean.add(sw9000);
    exportBean.add(zeiss);
    exportBean.add(prescription);
    exportBean.add(checkTime);
    return exportBean;
  }
}