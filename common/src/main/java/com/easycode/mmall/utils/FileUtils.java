package com.easycode.mmall.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author L.chen
 * @date 2019-01-08
 */
public class FileUtils {

  /**
   *图片域名
   * */
  public static String IMAGE_CLOUD_PATH = "http://yjktest.brightoculist.com";

  /**
   *图片路径前缀
   * */
  private static final String IMG_PATH_PREFIX = "/files/img";

  /**
   * MultipartFile 转 File
   *
   * @param path 保存的文件路径
   * @param file 保存的文件
   * @throws Exception
   */
  public static File multipartFileToFile(String path, MultipartFile file) throws Exception {

    File toFile;
    if (file.equals("") || file.getSize() <= 0 || StringUtils.isEmpty(path)) {
      throw new RuntimeException(String.format("The [%s] does not exist or file content is empty",
          file.getOriginalFilename()));
    } else {
      if (!path.endsWith(File.separator)) {
        path = path + File.separator;
      }
      new File(path).mkdirs();
      InputStream ins;
      ins = file.getInputStream();
      toFile = new File(path + file.getOriginalFilename());
      inputStreamToFile(ins, toFile);
      ins.close();
    }
    return toFile;
  }

  //获取流文件
  private static void inputStreamToFile(InputStream ins, File file) {
    try {
      OutputStream os = new FileOutputStream(file);
      int bytesRead = 0;
      byte[] buffer = new byte[8192];
      while ((bytesRead = ins.read(buffer, 0, 8192)) != -1) {
        os.write(buffer, 0, bytesRead);
      }
      os.close();
      ins.close();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * 删除本地临时文件
   */
  public static void delteTempFile(File file) {
    if (file != null) {
      File del = new File(file.toURI());
      del.delete();
    }
  }

  /**
   * @param fileSubfix 文件后缀名
   * @return String    返回类型
   * @throws
   * @Title: getFileName
   * @Description: 根据文件后缀名获取文件名
   * @author LiuFei
   */
  public static String getFileName(String fileSubfix) {
    StringBuffer sb = new StringBuffer();
    //添加时间
    SimpleDateFormat fm = new SimpleDateFormat("yyyyMMddHHmmssSSSS");
    sb.append(fm.format(new Date()));
    //随机生成4位整数
    sb.append((int) (Math.random() * 9000 + 1000));
    //添加后缀名
    if ('.' == fileSubfix.charAt(0)) {
      sb.append(fileSubfix);
    } else {
      sb.append("." + fileSubfix);
    }
    return sb.toString();
  }

  /**
   * @param directory 文件根目录
   * @return String    返回类型
   * @throws
   * @Title: getFilePath
   * @Description: 返回文件存储路径
   * @author Leipengfei
   */
  public static String getFilePath(String directory) {
    StringBuffer filePath = new StringBuffer(directory);
    //添加时间
    SimpleDateFormat fm = new SimpleDateFormat("yyyyMMdd");
    filePath.append("/" + fm.format(new Date()) + "/");

    return filePath.toString();
  }

  /**
   * @param filePath 文件名
   * @return boolean    返回类型
   * @throws
   * @Title: createFile
   * @Description: 创建文件
   * @author Leipengfei
   */
  public static boolean createFile(String filePath) {
    File file = new File(filePath);
    if (file.exists()) {
      return false;
    } else {
      File fileParent = file.getParentFile();
      if (fileParent != null) {
        if (!fileParent.exists()) {
          fileParent.mkdirs();
        }
      }
      try {
        file.createNewFile();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    return true;
  }

  public static void mkdirFilePath(String filePath) {
    File file = new File(filePath);
    if (!file.exists()) {
      file.mkdirs();
    }
  }

  /**
   * @param physicsPath 物理路径，自己上传时的路径
   * @param imgName 图片名称
   * @return String    返回类型
   * @throws
   * @Title: getServerImgPath
   * @Description: 根据物理路径和图片名称获取服务器路径
   * @author LiuFei
   */
  public static String getServerImgPath(String physicsPath, String imgName, String imageCloudPath) {
    if (physicsPath == null) {
      return null;
    }
    if (physicsPath.endsWith("/") || physicsPath.endsWith(File.separator)) {
      physicsPath = physicsPath.substring(0, physicsPath.length() - 1);
    }
    if (physicsPath.contains(File.separator)) {
      physicsPath = physicsPath.substring(physicsPath.lastIndexOf(File.separator) + 1);
    } else if (physicsPath.contains("/")) {
      physicsPath = physicsPath.substring(physicsPath.lastIndexOf("/") + 1);
    }
    return imageCloudPath + IMG_PATH_PREFIX + "/" + physicsPath + "/" + imgName;
  }
}
