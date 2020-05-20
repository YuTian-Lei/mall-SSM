package com.easycode.mmall.web.shiro;

import com.easycode.mmall.utils.DigestUtils;
import com.easycode.mmall.utils.EncodeUtils;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;

/**
* @author hpb
* @Description: 自定义shiro密码验证
 */
public class CustomCredentialsMatcher extends SimpleCredentialsMatcher {

	public static final int HASH_INTERATIONS = 1024;
	/**
	* @Title: doCredentialsMatch 
	* @Description:  凭证匹配
	* @param authenticationToken
	* @param authenticationInfo
	* @return boolean    返回类型 
	* @author 吕洋
	* @throws 
	*/
	@Override
	public boolean doCredentialsMatch(AuthenticationToken authenticationToken,AuthenticationInfo authenticationInfo) {
		UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
		SimpleAuthenticationInfo info = (SimpleAuthenticationInfo) authenticationInfo;
		String password = String.valueOf(token.getPassword());
		byte[] salts = info.getCredentialsSalt().getBytes();
		Object tokenCredentials = encrypt(password,salts);
		Object accountCredentials = getCredentials(info);
		return equals(tokenCredentials,accountCredentials);
	}
	
	/** 
	* @Title: encrypt 
	* @Description:  加密
	* @param input
	* @param salt
	* @return String    返回类型 
	* @author 吕洋
	* @throws 
	*/
	private String encrypt(String input,byte[] salt){
		String password = null;
		byte[] pass = DigestUtils.sha1(input.getBytes(), salt, HASH_INTERATIONS);
		password = EncodeUtils.encodeHex(pass);
		return password;
	}

}
