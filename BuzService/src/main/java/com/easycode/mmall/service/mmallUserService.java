package com.easycode.mmall.service;
import com.easycode.mmall.model.mmallUser;
import com.easycode.mmall.core.Service;



/**
 *
 * @author CodeGenerator
 * @date 2020/02/26
 */
public interface mmallUserService extends Service<mmallUser> {

  int checkUsername(String username);

  int checkEmail(String email);

  int checkAnswer(String username,String question,String answer);
}
