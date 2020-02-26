package com.easycode.mmall.utils;

import cn.afterturn.easypoi.word.WordExportUtil;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created on 2020/1/17 16:09
 *
 * @author L.chen
 */
public class ExcelUtils
{

    /**
     * 下载文件
     *
     * @param fileName 文件名
     * @param request
     * @param response
     * @param workbook
     */
    public static void downLoadExcel(String fileName, HttpServletRequest request, HttpServletResponse response, Workbook workbook)
    {
        try {
            String agent = request.getHeader("User-Agent");

            if (agent.toUpperCase().indexOf("MSIE") > 0 || agent.toUpperCase().indexOf("EDGE") > 0) { // 解决IE /Edge 浏览器编码
                fileName = URLEncoder.encode(fileName, "UTF-8");
            } else { // 解决火狐/谷歌等 浏览器编码
                fileName = new String(fileName.getBytes("UTF-8"), "ISO8859-1");
            }
            // 解决下载文件名 带空格变为+号问题
            fileName = fileName.replaceAll("\\+", "%20");

            response.setCharacterEncoding("UTF-8");
            response.setHeader("content-Type", "application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment;fileName=\"" + fileName + "\"");
            workbook.write(response.getOutputStream());
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Excel 写入图片
     *
     * @param workBook workBook
     * @param sheet    sheet
     * @param file     图片文件
     */
    public static void writeImage(Workbook workBook, Sheet sheet, MultipartFile file)
    {
        BufferedImage bufferImg;//图片
        try {
            // 先把读进来的图片放到一个ByteArrayOutputStream中，以便产生ByteArray
            ByteArrayOutputStream byteArrayOut = new ByteArrayOutputStream();
            //将图片读到BufferedImage
            bufferImg = ImageIO.read(file.getInputStream());
            // 将图片写入流中
            ImageIO.write(bufferImg, "png", byteArrayOut);
            // 利用HSSFPatriarch将图片写入EXCEL
            XSSFDrawing patriarch = (XSSFDrawing) sheet.createDrawingPatriarch();
            //图片导出到单元格B2中
            XSSFClientAnchor anchor = new XSSFClientAnchor(0, 0, 0, 0, (short) 2, 4, (short) 25, 34);
            // 插入图片
            patriarch.createPicture(anchor, workBook.addPicture(byteArrayOut
                    .toByteArray(), HSSFWorkbook.PICTURE_TYPE_PNG));
        }
        catch (IOException io) {
            io.printStackTrace();
        }
    }

}
