package com.easycode.mmall.utils;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.lang3.StringEscapeUtils;

/**
 * @author lpf
 * @ClassName: StringUtils
 * @Description: 字符串工具类
 */
public class StringUtils
{

    //图片域名
//	public static String IMAGE_CLOUD_PATH = "http://yjktest.brightoculist.com";

    //图片路径前缀
    private static final String IMG_PATH_PREFIX = "/files/img";

    /**
     * @param @return
     * @return boolean
     * @Title:isNull
     * @Description: 判断字符串是否为空
     */
    public static boolean isNull(String characters)
    {
        if (null == characters || "".equals(characters)) {
            return true;
        }
        return false;
    }

    /**
     * @return boolean    返回类型
     * @throws
     * @Title: isNotNull
     * @Description: 是否为空
     */
    public static boolean isNotNull(String value)
    {
        if (value == null) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @return boolean    返回类型
     * @throws
     * @Title: isBlank
     * @Description: TODO(这里用一句话描述这个方法的作用)
     */
    public static boolean isBlank(String value)
    {
        if (isNotNull(value)) {
            if (value.trim().equals("") || value.isEmpty()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @return boolean    返回类型
     * @throws
     * @Title: isNotBlank
     * @Description: TODO(这里用一句话描述这个方法的作用)
     */
    public static boolean isNotBlank(String value)
    {
        if (isNotNull(value)) {
            if (value.trim().equals("")) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    /**
     * @return boolean    返回类型
     * @throws
     * @Title: isEmpty
     * @Description: TODO(这里用一句话描述这个方法的作用)
     */
    public static boolean isEmpty(String value)
    {
        if (isNull(value) || isBlank(value)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @return boolean    返回类型
     * @throws
     * @Title: isNotEmpty
     * @Description: TODO(这里用一句话描述这个方法的作用)
     */
    public static boolean isNotEmpty(String value)
    {
        if (isNotNull(value) && isNotBlank(value)) {
            return true;
        } else {
            return false;
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
    public static String getFileName(String fileSubfix)
    {
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
    public static String getFilePath(String directory)
    {
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
    public static boolean createFile(String filePath)
    {
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
            }
            catch (IOException e) {
                e.printStackTrace();
            }
        }
        return true;
    }

    public static void mkdirFilePath(String filePath)
    {
        File file = new File(filePath);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    /**
     * @param physicsPath 物理路径，自己上传时的路径
     * @param imgName     图片名称
     * @return String    返回类型
     * @throws
     * @Title: getServerImgPath
     * @Description: 根据物理路径和图片名称获取服务器路径
     * @author LiuFei
     */
    public static String getServerImgPath(String physicsPath, String imgName, String imageCloudPath)
    {
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
        //先查
        //IMAGE_CLOUD_PATH = ProcessorImagePath.init();
        //return  IMAGE_CLOUD_PATH + IMG_PATH_PREFIX+"/"+physicsPath+"/"+imgName;
        return imageCloudPath + IMG_PATH_PREFIX + "/" + physicsPath + "/" + imgName;
    }


    /**
     * 如果为整数则加上 "+" ， 否则直接返回
     *
     * @param val Dc 或者 Ds
     * @return
     */
    public static String formatDsOrDc(String val)
    {

        if (!val.startsWith("-")) {
            return "+".concat(val);
        }
        return val;
    }

    /**
     * 格式化小数 为百分比
     *
     * @param rate
     * @return
     */
    public static String formatRate(float rate)
    {
        DecimalFormat df = new DecimalFormat("0.00%");
        String r = df.format(rate);
        return r;
    }

    /**
     * 格式化小数 保留两位
     *
     * @param rate
     * @return
     */
    public static Double formatNum(float rate)
    {
        DecimalFormat df = new DecimalFormat("#0.00");
        Double r = Double.valueOf(df.format(rate));
        return r;
    }

    /**
     * 替换掉HTML标签方法
     */
    public static String replaceHtml(String html)
    {
        if (isBlank(html)) {
            return "";
        }
        String regEx = "<.+?>";
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(html);
        String s = m.replaceAll("");
        return s;
    }

    /**
     * 缩略字符串（不区分中英文字符）
     *
     * @param str    目标字符串
     * @param length 截取长度
     * @return
     */
    public static String abbr(String str, int length)
    {
        if (str == null) {
            return "";
        }
        try {
            StringBuilder sb = new StringBuilder();
            int currentLength = 0;
            for (char c : replaceHtml(StringEscapeUtils.unescapeHtml4(str)).toCharArray()) {
                currentLength += String.valueOf(c).getBytes("GBK").length;
                if (currentLength <= length - 3) {
                    sb.append(c);
                } else {
                    sb.append("...");
                    break;
                }
            }
            return sb.toString();
        }
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return "";
    }

}
