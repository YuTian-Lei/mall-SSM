package com.easycode.mmall.utils;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.net.InetAddress;
import java.net.URLEncoder;

/**
 * 客户端工具类
 *
 * @author lpf
 */
public class ServletUtils
{

    /**
     * 获取String参数
     */
    public static String getParameter(String name)
    {
        return getRequest().getParameter(name);
    }

    /**
     * 获取request
     */
    public static HttpServletRequest getRequest()
    {
        return getRequestAttributes().getRequest();
    }

    /**
     * 获取response
     */
    public static HttpServletResponse getResponse()
    {
        return getRequestAttributes().getResponse();
    }

    /**
     * 获取session
     */
    public static HttpSession getSession()
    {
        return getRequest().getSession();
    }

    public static ServletRequestAttributes getRequestAttributes()
    {
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        return (ServletRequestAttributes) attributes;
    }

    /**
     * 将字符串渲染到客户端
     *
     * @param response 渲染对象
     * @param string   待渲染的字符串
     * @return null
     */
    public static String renderString(HttpServletResponse response, String string)
    {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("utf-8");
            response.getWriter().print(string);
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * @Description: 获取客户端IP地址
     */
    public static String getIpAddr()
    {
        HttpServletRequest request = getRequestAttributes().getRequest();
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
            if (ip.equals("127.0.0.1")) {
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
                ip = inet.getHostAddress();
            }
        }
        // 多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
        if (ip != null && ip.length() > 15) {
            if (ip.indexOf(",") > 0) {
                ip = ip.substring(0, ip.indexOf(","));
            }
        }
        return ip;
    }

    public static void outputFile(HttpServletRequest request, HttpServletResponse response, String filePath,
                                  String outputFileName)
    {
        if (StringUtils.isEmpty(filePath)) {
            return;
        }
        InputStream is = null;
        OutputStream os = null;
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        try {
            Cookie cookie = new Cookie("state", "success");
            cookie.setHttpOnly(false);
            response.addCookie(cookie);
            // 解决下载文件名带中文编码
            fileNameEncoder(request, response, outputFileName);
            File file = new File(filePath);
            if (!file.exists()) {
                return;
            }
            is = new FileInputStream(file);
            bis = new BufferedInputStream(is);
            os = response.getOutputStream();
            bos = new BufferedOutputStream(os);
            byte[] b = new byte[1024];
            int len = 0;
            while ((len = bis.read(b)) != -1) {
                bos.write(b, 0, len);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            try {
                if (bos != null) {
                    bos.close();
                }
                if (bis != null) {
                    bis.close();
                }
                if (os != null) {
                    os.close();
                }
                if (is != null) {
                    is.close();
                }
            }
            catch (IOException e) {
                e.printStackTrace();
            }

        }
    }

    /**
     * 解决下载中文文件名乱码
     *
     * @param request
     * @param response
     * @param fileName
     */
    public static void fileNameEncoder(HttpServletRequest request, HttpServletResponse response, String fileName)
    {
        try {
            String agent = request.getHeader("User-Agent");
            // 解决IE /Edge 浏览器编码
            if (agent.toUpperCase().indexOf("MSIE") > 0 || agent.toUpperCase().indexOf("EDGE") > 0) {
                fileName = URLEncoder.encode(fileName, "UTF-8");
            } else {
                // 解决火狐/谷歌等 浏览器编码
                fileName = new String(fileName.getBytes("UTF-8"), "ISO8859-1");
            }
            // 解决下载文件名 带空格变为+号问题
//            fileName.replaceAll("\\+", "%20");
            response.setCharacterEncoding("UTF-8");
            response.setContentType("applicaiton/x-download");
            response.addHeader("Content-Disposition", "attachment;fileName=\"" + fileName + "\"");

        }
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

}
