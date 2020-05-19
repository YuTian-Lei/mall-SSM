package com.easycode.mmall.manageController;

import com.easycode.mmall.Const.CONST;
import com.easycode.mmall.Enum.ResultCode;
import com.easycode.mmall.utils.ResultGenerator;
import com.easycode.mmall.model.User;
import com.easycode.mmall.service.CategoryService;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.Result;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manage/category")
public class CategoryManageController {

  @Autowired
  private UserService userService;

  @Autowired
  private CategoryService categoryService;

  @PostMapping("add_category")
  @ApiOperation(value = "增加节点",notes = "增加节点")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "categoryName",value = "品类名称",required = true,paramType = "String"),
      @ApiImplicitParam(name = "parentId",value = "父类品类id",required = true,paramType = "int")
  })
  public Result addCategory(HttpServletRequest request, String categoryName,
      @RequestParam(value = "parentId", defaultValue = "0") Integer parentId) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录，请登录");
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //增加处理分类逻辑
      return categoryService.addCategory(categoryName, parentId);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }

  @PostMapping("set_category_name")
  @ApiOperation(value = "修改品类名称",notes = "修改品类名称")
  @ApiImplicitParams({
      @ApiImplicitParam(name = "categoryName",value = "品类名称",required = true,paramType = "String"),
      @ApiImplicitParam(name = "categoryId",value = "商品品类id",required = true,paramType = "int")
  })
  public Result setCategoryName(HttpServletRequest request, Integer categoryId,
      String categoryName) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录，请登录");
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //更新categoryName
      return categoryService.updateCategoryName(categoryId, categoryName);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }


  @GetMapping("get_category")
  @ApiOperation(value = "获取品类子节点",notes = "获取品类子节点")
  @ApiImplicitParam(value = "categoryId",name = "商品id",paramType = "int")
  public Result getChildrenParallelCategory(HttpServletRequest request,
      @RequestParam(value = "categoryId", defaultValue = "0") Integer categoryId) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录，请登录");
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //查询子节点的category信息,并且不递归
      return categoryService.getChildrenParallelCategory(categoryId);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }

  @GetMapping("get_deep_category")
  @ApiOperation(value = "获取当前分类id及递归子节点categoryid",notes = "获取当前分类id及递归子节点categoryid")
  @ApiImplicitParam(value = "categoryId",name = "商品id",required = true,paramType = "int")
  public Result getCategoryAndDeepChildrenCategory(HttpServletRequest request,
      @RequestParam(value = "categoryId", defaultValue = "0") Integer categoryId) {
    User user = (User) request.getSession().getAttribute(CONST.CURRENT_USER);
    if (user == null) {
      return ResultGenerator.genFailResult("用户未登录，请登录");
    }
    //校验是否是管理员
    if (userService.checkAdminRole(user).getCode() == ResultCode.SUCCESS.getCode()) {
      //查询d当前子节点的category信息,并且递归
      return categoryService.selectCategoryAndChildrenById(categoryId);
    } else {
      return ResultGenerator.genFailResult("无权限操作，需要管理员权限");
    }
  }


}
