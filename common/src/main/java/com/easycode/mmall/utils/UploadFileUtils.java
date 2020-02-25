package com.easycode.mmall.utils;

import java.io.File;
import java.util.Arrays;
import java.util.List;

/**
 * @author qhy
 * @version 1.0
 * @ClassName: UploadFileUtils
 * @Description: 上传文件处理工具类
 */
public class UploadFileUtils {
    /**
     * 获取上传文件的后缀名
     */
    public static String getFileSuffix(String fileName) {
        String fileSuffix = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        return fileSuffix;
    }

    /**
     * 递归指定目录下所有的文件（不包含文件夹）
     *
     * @param files   遍历的文件列表
     * @param path    文件目录
     * @param suffixs 指定后缀 (指定多个或为空)
     */
    public static void getAllFiles(List<File> files, String path, String... suffixs) {
        if (null == path) {
            return;
        }
        File file = new File(path);
        if (file.exists()) {
            if (file.isDirectory()) {
                for (File f : file.listFiles()) {
                    getAllFiles(files, f.getAbsolutePath(), suffixs);
                }
            } else {
                if (null == suffixs || suffixs.length == 0
                        || (null != suffixs && file.getName().indexOf(".") != -1 && Arrays.asList(suffixs).contains(file.getName().split("\\.")[1].toLowerCase()))) {
                    files.add(file);
                }
            }
        }
    }

}
