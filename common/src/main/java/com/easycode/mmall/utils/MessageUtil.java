package com.easycode.mmall.utils;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

/**
 * @version 1.0
 * @ClassName: MessageUtil
 * @Description: 发送短信验证码工具类
 */
public class MessageUtil {

  public static final int MESSAGE_COMMON = 1;
  public static final int MESSAGE_INFO = 3;
  //注册提示语
  public static final int MESSAGE_REGISTER = 4;
  //找回密码提示语
  public static final int MESSAGE_FORGETPASSWORD = 5;
  // 到期提醒
  public static final int MESSAGE_REMINDERMESSAGE = 6;
  // 默认随机密码
  public static final int MESSAGE_DEFAULTPASSWORD = 7;

  private static final String POST_URL = "http://cf.51welink.com/submitdata/Service.asmx/g_Submit";

  /**
   * 账号信息
   */
  private static final String SNAME = "dlbathlw";    //dlhbcy00
  private static final String SPWD = "JiDian2018";  // Artrnb123
  //企业代码
  private static final String SCORPID = "";
  //产品编号
  private static final String SPRDID = "1012818";  //1012808

  /**
   * @return Map<String, String>    返回类型
   * @throws UnsupportedEncodingException
   * @throws DocumentException 设定文件
   * @throws
   * @Title: send
   * @Description: TODO(这里用一句话描述这个方法的作用)
   * @author LiuFei
   */
  public static Map<String, String> send(String phone, String code, int messageTemplate)
      throws UnsupportedEncodingException, DocumentException {
    //根据模块生成消息内容
    String postData = null;
    postData = getMmessageContent(phone, code, messageTemplate);
    if (postData == null) {
      return null;
    }
    try {
      //发送POST请求
      URL url = new URL(POST_URL);
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("POST");
      conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
      conn.setRequestProperty("Connection", "Keep-Alive");
      conn.setUseCaches(false);
      conn.setDoOutput(true);

      conn.setRequestProperty("Content-Length", "" + postData.length());
      OutputStreamWriter out = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
      out.write(postData);
      out.flush();
      out.close();

      //获取响应状态
      if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
        return null;
      }
      //获取响应内容体
      String line = "";
      String result = "";
      BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
      while ((line = in.readLine()) != null) {
        result += line + "\n";
      }
      in.close();
      return xMLReader2(result);
    } catch (IOException e) {
      e.printStackTrace(System.out);
    }
    return null;
  }

  /**
   * @return String    返回类型
   * @throws UnsupportedEncodingException
   * @throws
   * @Title: messageContent
   * @Description: 拼接短信内容
   * @author LiuFei
   */
  private static String getMmessageContent(String phone, String code, int messageTemplate)
      throws UnsupportedEncodingException {
    String postData = null;
    switch (messageTemplate) {
      case MESSAGE_REGISTER:
        String smag4 = "【智能眼镜】您的验证码是：" + code + "，5分钟内有效。本次操作为注册新用户，请勿将验证码泄露给其他人。";
        postData = packMMS(SNAME, SPWD, SCORPID, SPRDID, phone, smag4);
        break;
      case MESSAGE_FORGETPASSWORD:
        String smag5 = "【智能眼镜】您的验证码是：" + code + " ，5分钟内有效。本次操作为找回密码，请勿将验证码泄露给其他人。";
        postData = packMMS(SNAME, SPWD, SCORPID, SPRDID, phone, smag5);
        break;
      case MESSAGE_COMMON:
        String smag1 = "您的验证码是：" + code + "。请不要把验证码泄露给其他人。【智能眼镜】";
        postData = packMMS(SNAME, SPWD, SCORPID, SPRDID, phone, smag1);
        break;
      case MESSAGE_INFO:
        String smag3 = "尊敬的会员，感谢您完善个人信息，您当前操作的验证码为" + code + "。如果不是您本人操作，请忽略此条信息。【智能眼镜】";
        postData = packMMS(SNAME, SPWD, SCORPID, SPRDID, phone, smag3);
        break;
      case MESSAGE_REMINDERMESSAGE:
        String smag6 = "【智能眼镜】尊敬的用户您好，您有" + code + "件租赁作品已经到期，请及时登录APP进行续租或退租操作。";
        postData = packMMS(SNAME, SPWD, SCORPID, SPRDID, phone, smag6);
        break;
      case MESSAGE_DEFAULTPASSWORD:
        String smag7 = "您的默认密码是：" + code + "。请妥善保管你的默认密码且不要泄露给他人，并及时登录客户端修改密码。【智能眼镜】";
        postData = packMMS(SNAME, SPWD, SCORPID, SPRDID, phone, smag7);
        break;
      default:
        break;
    }
    return postData;
  }

  /**
   * @return String    返回类型
   * @throws UnsupportedEncodingException 设定文件
   * @throws
   * @Title: PackMMS
   * @Description: 拼接接口请求参数
   * @author LiuFei
   */
  private static String packMMS(String sname, String spwd, String scorpid, String sprdid,
      String sdst, String smag) throws UnsupportedEncodingException {
    StringBuilder sb = new StringBuilder();
    sb.append("");
    sb.append("sname=" + sname + "&");
    sb.append("spwd=" + spwd + "&");
    sb.append("scorpid=" + scorpid + "&");
    sb.append("sprdid=" + sprdid + "&");
    sb.append("sdst=" + sdst + "&");
    sb.append("smsg=" + URLEncoder.encode(smag, "utf-8") + "");
    sb.append("");
    return sb.toString();
  }

  /**
   * @throws UnsupportedEncodingException
   * @throws DocumentException
   * @throws
   * @Title: main
   * @Description: 测试短信接口方法
   * @author xrz
   */
  public static void main(String[] args) throws UnsupportedEncodingException, DocumentException {
    System.out.println(URLEncoder.encode("小小", "UTF-8"));
    Map<String, String> map = MessageUtil.send("18611120564", "027451", MESSAGE_REGISTER);
    System.err.println("State= " + map.get("State"));
    System.err.println("MsgState= " + map.get("MsgState"));
    System.err.println("MsgID= " + map.get("MsgID"));
    System.err.println("Reserve= " + map.get("Reserve"));
  }

  /**
   * @return Map<String, String>    返回类型
   * @throws DocumentException 设定文件
   * @throws
   * @Title: XMLReader
   * @Description: 将调用接口后返回的XML字符串转换为Map
   * @author LiuFei
   */
  public static Map<String, String> xMLReader(String xmlText) throws DocumentException {
    Map<String, String> map = new HashMap<String, String>();
    SAXReader saxReader = new SAXReader();
    Document document = saxReader.read(new ByteArrayInputStream(xmlText.getBytes()));
    Element root = document.getRootElement();
    Element foo = root.element("State");
    map.put("State", foo.getTextTrim());
    foo = root.element("MsgState");
    map.put("MsgState", foo.getTextTrim());
    foo = root.element("MsgID");
    map.put("MsgID", foo.getTextTrim());
    foo = root.element("Reserve");
    map.put("Reserve", foo.getTextTrim());
    return map;
  }

  /**
   * @return Map<String, String>    返回类型
   * @throws DocumentException 设定文件
   * @throws
   * @Title: XMLReader
   * @Description: 将调用接口后返回的XML字符串转换为Map
   * @author LiuFei
   */
  public static Map<String, String> xMLReader2(String xmlText) throws DocumentException {
    Map<String, String> map = new HashMap<String, String>();
    Document document = DocumentHelper.parseText(xmlText);
    Element root = document.getRootElement();
    Element foo = root.element("State");
    map.put("State", foo.getTextTrim());
    foo = root.element("MsgState");
    map.put("MsgState", foo.getTextTrim());
    foo = root.element("MsgID");
    map.put("MsgID", foo.getTextTrim());
    foo = root.element("Reserve");
    map.put("Reserve", foo.getTextTrim());
    return map;
  }

  /**
   * 创建指定数量的随机字符串
   *
   * @param numberFlag 是否是数字
   * @param length 验证码的位数
   */
  public static String createRandom(boolean numberFlag, int length) {
    String retStr = "";
    String strTable = numberFlag ? "1234567890" : "1234567890abcdefghijkmnpqrstuvwxyz";
    int len = strTable.length();
    boolean bDone = true;
    do {
      retStr = "";
      int count = 0;
      for (int i = 0; i < length; i++) {
        double dblR = Math.random() * len;
        int intR = (int) Math.floor(dblR);
        char c = strTable.charAt(intR);
        if (('0' <= c) && (c <= '9')) {
          count++;
        }
        retStr += strTable.charAt(intR);
      }
      if (count >= 2) {
        bDone = false;
      }
    } while (bDone);
    return retStr;
  }
}
