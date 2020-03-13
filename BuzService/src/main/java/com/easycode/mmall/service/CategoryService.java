package com.easycode.mmall.service;
import com.easycode.mmall.model.Category;
import com.easycode.mmall.core.Service;
import com.easycode.mmall.utils.Result;
import java.util.List;

/**
 *
 * @author CodeGenerator
 * @date 2020/03/13
 */
public interface CategoryService extends Service<Category> {

  Result addCategory(String categoryName,Integer parentId);

  Result updateCategoryName(Integer categoryId, String categoryName);

  Result<List<Category>> getChildrenParallelCategory(Integer categoryId);

  Result selectCategoryAndChildrenById(Integer categoryId);
}
