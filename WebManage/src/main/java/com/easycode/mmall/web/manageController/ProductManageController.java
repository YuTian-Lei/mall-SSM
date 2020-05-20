package com.easycode.mmall.web.manageController;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.model.Product;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.IFileService;
import com.easycode.mmall.service.ProductService;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.PropertiesUtil;
import com.easycode.mmall.utils.Result;
import com.google.common.collect.Maps;
import io.swagger.annotations.ApiOperation;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/manage/product")
public class ProductManageController {

  @Autowired
  private UserService userService;

  @Autowired
  private ProductService productService;

  @Autowired
  private IFileService fileService;


  @PostMapping("save")
  @ApiOperation(value = "新增或更新商品·")
  public Result productSave(HttpServletRequest request, Product product) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //填充增加产品的业务逻辑
      return productService.saveOrUpdateProduct(product);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }

  @PostMapping("set_sale_status")
  @ApiOperation(value = "修改产品销售状态")
  public Result setSaleStatus(HttpServletRequest request, Integer productId, Integer status) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      return productService.setSaleStatus(productId,status);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }

  @GetMapping("detail")
  @ApiOperation(value = "获取商品详细信息")
  public Result getProductDetail(HttpServletRequest request, Integer productId) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      return productService.manageProductDetail(productId);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }


  @GetMapping("list")
  @ApiOperation(value = "获取商品列表")
  public Result getList(HttpServletRequest request, @RequestParam(value = "pageNum",defaultValue = "1") int pageNum, @RequestParam(value = "pageSize",defaultValue = "10") int pageSize) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      return productService.getProductList(pageNum,pageSize);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }


  @GetMapping("search")
  @ApiOperation(value = "商品搜索")
  public Result productSearch(HttpServletRequest request,String productName, Integer productId, @RequestParam(value = "pageNum",defaultValue = "1") int pageNum, @RequestParam(value = "pageSize",defaultValue = "10") int pageSize) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      return productService.searchProduct(productName,productId,pageNum,pageSize);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }

  @PostMapping("upload")
  @ApiOperation(value = "上传文件")
  public Result upload(@RequestParam(value = "upload_file",required = false) MultipartFile multipartFile,HttpServletRequest request){
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录,请登录管理员!", ResultCode.NEED_LOGIN);
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      String path = request.getSession().getServletContext().getRealPath("upload");
      String targetFileName = fileService.upload(multipartFile,path);
      String url = PropertiesUtil.getProperty("ftp.server.http.prefix") + targetFileName;

      Map fileMap = Maps.newHashMap();
      fileMap.put("uri",targetFileName);
      fileMap.put("url",url);
      return  ResultGenerator.genSuccessResult(fileMap);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }

  @PostMapping("richtext_img_upload")
  @ApiOperation(value = "富文本图片上传文件")
  public Map richTextImgUpload(@RequestParam(value = "upload_file",required = false) MultipartFile multipartFile,HttpServletRequest request,
      HttpServletResponse response){
    Map resultMap = Maps.newHashMap();
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      resultMap.put("suceess", false);
      resultMap.put("msg", "请登录管理员");
      return resultMap;
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //富文本对于返回值有自己的要求，我们使用的是simditor所以按照simditor的要求进行返回
      String path = request.getSession().getServletContext().getRealPath("upload");
      String targetFileName = fileService.upload(multipartFile,path);
      if(StringUtils.isBlank(targetFileName)){
        resultMap.put("suceess", false);
        resultMap.put("msg", "上传失败");
        return resultMap;
      }
      String url = PropertiesUtil.getProperty("ftp.server.http.prefix") + targetFileName;

      resultMap.put("suceess", true);
      resultMap.put("msg", "上传成功");
      resultMap.put("file_path",url);
      response.addHeader("Access-Control-Allow-Headers","X-File-name");
      return  resultMap;
    } else {
      resultMap.put("suceess", false);
      resultMap.put("msg", "无权限操作");
      return resultMap;
    }
  }

}
