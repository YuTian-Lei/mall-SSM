package com.easycode.mmall.service;
import com.easycode.mmall.core.Service;
import com.easycode.mmall.utils.Result;
import com.easycode.mmall.model.User;

/**
 *
 * @author CodeGenerator
 * @date 2020/02/26
 */
public interface UserService extends Service<User> {

  int checkUsername(String username);

  int checkEmail(String email);

  int checkAnswer(String username,String question,String answer);

  Result checkAdminRole(User user);
}
