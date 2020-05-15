package com.easycode.mmall.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * @Description: //TODO
 * @Date: 2020/5/13 18:34
 * @Author: pengfei.L
 */
@Slf4j
public class DownLoadFileUtil {
    /**
     * 文件下载方法:以application/x-msdownload方式下载文件
     * @param response
     * @param filePath
     * @param encode
     */
    public static void downloadMsdownload(HttpServletResponse response, String filePath, String encode) {
        response.setContentType("text/html;charset=" + encode);
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        String downLoadPath = filePath;
        try {
            File file = new File(downLoadPath);
            long fileLength = file.length();
            String fileName = file.getName();
            response.setContentType("application/x-msdownload;");
            response.setHeader("Content-disposition", "attachment; filename=" + new String(fileName.getBytes(encode), "ISO8859-1"));
            response.setHeader("Content-Length", String.valueOf(fileLength));
            bis = new BufferedInputStream(new FileInputStream(downLoadPath));
            bos = new BufferedOutputStream(response.getOutputStream());
            byte[] buff = new byte[2048];
            int bytesRead;
            while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
                bos.write(buff, 0, bytesRead);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        } finally {
            if (bis != null)
                try {
                    bis.close();
                } catch (IOException e) {
                    log.error(e.getMessage());
                }
            if (bos != null)
                try {
                    bos.close();
                } catch (IOException e) {
                    log.error(e.getMessage());
                }
        }
    }

    /**
     * 以流的方式下载:以application/octet-stream方式下载文件
     * @param response
     * @param filePath
     * @param encode
     * @return response
     */
    public static void download(HttpServletResponse response, String filePath, String encode) {
        response.setContentType("text/html;charset=" + encode);
        try {
            // path是指欲下载的文件的路径
            File file = new File(filePath);
            // 取得文件名
            String filename = file.getName();
            // 取得文件的后缀名
            // String ext = filename.substring(filename.lastIndexOf(".") + 1).toUpperCase();
            // 以流的形式下载文件
            InputStream fis = new BufferedInputStream(new FileInputStream(filePath));
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();
            // 清空response
            response.reset();
            // 设置response的Header
            response.addHeader("Content-Disposition", "attachment;filename=" + new String(filename.getBytes(encode), "ISO8859-1"));
            response.addHeader("Content-Length", "" + file.length());
            response.setContentType("application/octet-stream");
            OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
            toClient.write(buffer);
            toClient.flush();
            toClient.close();
        } catch (IOException ex) {
            log.error(ex.getMessage());
        }
    }
}
