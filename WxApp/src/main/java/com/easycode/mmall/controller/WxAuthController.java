package com.easycode.mmall.controller;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpUtil;
import com.alibaba.fastjson.JSONObject;
import com.easycode.mmall.service.UserService;
import com.easycode.mmall.utils.AesCbcUtil;
import com.easycode.mmall.utils.JsonResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;


@Api(description = "医药类获取用户openid")
@RestController
@RequestMapping("/wxauth")
@Slf4j
public class WxAuthController {
	
	@Autowired
	private UserService userService;
	
	//医药类
	private final String appId ="wx964c8546f4e2227d";
	private final String appSecret = "01f4ba0c79f7050bb6e0adccb0a1727e";

	/** 
	* @Title: getWxUserInfo
	* @Description: 获取微信小程序 session_key 和 openid
	* @param code
	* @return JSONObject    返回类型 
	* @author zy
	* @date 2019年5月5日 下午7:05:11 
	* @throws 
	*/
	@ApiOperation(value = "微信小程序获取userInfo", notes="注册")
	@RequestMapping(value="/getWxUserInfo",method = RequestMethod.GET)
	public JsonResult getWxUserInfo(@RequestParam("encryptedData")String encryptedData,@RequestParam("iv") String iv, @RequestParam("code")String code, HttpServletRequest request){
		JsonResult result = new JsonResult();

		// 登录凭证不能为空
		if (StringUtils.isEmpty(code)) {
			result.setResultCode(0);
			result.setMessage("code 不能为空");
			return result;
		}
		String originalUrl = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";
		String targetUrl = String.format(originalUrl, appId,appSecret,code);
		String jr = HttpUtil.get(targetUrl);
		JSONObject object = JSONObject.parseObject(jr);
		log.info("jr信息" + jr);
		Long wechatId = null;
		try {
			String session_key = object.get("session_key").toString();
			if(session_key == null){
				result.setResultCode(2);
				result.setMessage("获取sessionKey失败！");
				return result;
			}
			String useInfo = AesCbcUtil.decrypt(encryptedData, session_key, iv, "UTF-8");
			if(StringUtils.isEmpty(useInfo)){
				result.setResultCode(0);
				result.setMessage("解密失败");
				return result;
			}
			log.info("授权信息" + useInfo);
			JSONObject userInfoJSON = JSONObject.parseObject(useInfo);
			String wxOpenId =userInfoJSON.getString("openId");//openid
			String nickName = userInfoJSON.getString("nickName");//微信名称
			String avatarUrl = userInfoJSON.getString("avatarUrl");//头像路径
			Integer gender=userInfoJSON.getInteger("gender");//x性别
			String country=userInfoJSON.getString("country");
			String province=userInfoJSON.getString("province");
			String city=userInfoJSON.getString("city");
			result.setResultCode(1);
			result.setData("userInfo",userInfoJSON);
			return result;
		} catch (Exception e) {
			e.printStackTrace();
			result.setResultCode(0);
			result.setMessage("授权失败");
			return result;
		}
	}
	
}
