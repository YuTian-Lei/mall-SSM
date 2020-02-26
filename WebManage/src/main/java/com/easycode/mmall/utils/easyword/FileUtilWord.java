package com.easycode.mmall.utils.easyword;

import cn.afterturn.easypoi.word.WordExportUtil;
import cn.hutool.core.lang.Assert;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

@SuppressWarnings("deprecation")
public class FileUtilWord {

	/**
	 * 导出word
	 * <p>
	 * 第一步生成替换后的word文件，只支持docx
	 * </p>
	 * <p>
	 * 第二步下载生成的文件
	 * </p>
	 * <p>
	 * 第三步删除生成的临时文件
	 * </p>
	 * 模版变量中变量格式：{{foo}}
	 * 
	 * @param templatePath word模板地址
	 * @param temDir       生成临时文件存放地址
	 * @param fileName     文件名
	 * @param params       替换的参数
	 * @param request      HttpServletRequest
	 * @param response     HttpServletResponse
	 */
	public static void exportWord(String templatePath, String temDir, String fileName, Map<String, Object> params,
			HttpServletRequest request, HttpServletResponse response) {
		Assert.notNull(templatePath, "模板路径不能为空");
		Assert.notNull(temDir, "临时文件路径不能为空");
		Assert.notNull(fileName, "导出文件名不能为空");
		Assert.isTrue(fileName.endsWith(".docx"), "word导出请使用docx格式");
		if (!temDir.endsWith("/")) {
			temDir = temDir + File.separator;
		}
		File dir = new File(temDir);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		try {
			String userAgent = request.getHeader("user-agent").toLowerCase();
			if (userAgent.contains("msie") || userAgent.contains("like gecko")) {
				fileName = URLEncoder.encode(fileName, "UTF-8");
			} else {
				fileName = new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
			}
			XWPFDocument doc = WordExportUtil.exportWord07(templatePath, params);
			String tmpPath = temDir + fileName;
			FileOutputStream fos = new FileOutputStream(tmpPath);
			doc.write(fos);
			// 设置强制下载不打开
			response.setContentType("application/force-download");
			// 设置文件名
			response.addHeader("Content-Disposition", "attachment;fileName=" + fileName);
			OutputStream out = response.getOutputStream();
			doc.write(out);
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// delAllFile(temDir);//这一步看具体需求，要不要删
		}

	}

	/**
	 * 生成带图片Word方法
	 * @param request
	 * @param response
	 * @param templatePath
	 * @param temDir
	 * @param fileName
	 * @param params
	 */
	public static void exportImageWord(HttpServletRequest request, HttpServletResponse response, String templatePath,
			String temDir, String fileName, Map<String, Object> params) {
		try {
			XWPFDocument doc = WordExportUtil.exportWord07(templatePath, params);
			FileOutputStream fos = new FileOutputStream(temDir);
			doc.write(fos);
			fos.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 浏览器下载报告方法
	 * @param request	
	 * @param response
	 * @param templatePath		
	 * @param temDir
	 * @param fileName
	 * @param params
	 */
	public static void exportWordReport(HttpServletRequest request, HttpServletResponse response, String templatePath,
			String temDir, String fileName, Map<String, Object> params) {
		Assert.notNull(templatePath, "模板路径不能为空");
		Assert.notNull(temDir, "临时文件路径不能为空");
		Assert.notNull(fileName, "导出文件名不能为空");
		Assert.isTrue(fileName.endsWith(".docx"), "word导出请使用docx格式");
		if (!temDir.endsWith("/")) {
			temDir = temDir + File.separator;
		}
		File dir = new File(temDir);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		try {
			String userAgent = request.getHeader("user-agent").toLowerCase();
			XWPFDocument doc = WordExportUtil.exportWord07(templatePath, params);
			String tmpPath = temDir + fileName;
			FileOutputStream fos = new FileOutputStream(tmpPath);
			doc.write(fos);
			if (userAgent.contains("msie") || userAgent.contains("like gecko")) {
				fileName = URLEncoder.encode(fileName, "UTF-8");
			} else {
				fileName = new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
			}
			// 设置强制下载不打开
			response.setContentType("application/force-download");
			// 设置文件名
			response.addHeader("Content-Disposition", "attachment;fileName=" + fileName);
			OutputStream out = response.getOutputStream();
			doc.write(out);
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// delAllFile(temDir);//这一步看具体需求，要不要删
		}

	}
}
