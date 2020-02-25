package com.easycode.mmall.utils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author L.chen
 * @date 2019-01-08
 */
@Log4j2
public class FileUtils
{

    /**
     * MultipartFile 转 File
     *
     * @param path 保存的文件路径
     * @param file 保存的文件
     * @return
     * @throws Exception
     */
    public static File multipartFileToFile(String path, MultipartFile file) throws Exception
    {

        File toFile;
        if (file.equals("") || file.getSize() <= 0 || StringUtils.isEmpty(path)) {
            throw new RuntimeException(String.format("The [%s] does not exist or file content is empty", file.getOriginalFilename()));
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
    private static void inputStreamToFile(InputStream ins, File file)
    {
        try {
            OutputStream os = new FileOutputStream(file);
            int bytesRead = 0;
            byte[] buffer = new byte[8192];
            while ((bytesRead = ins.read(buffer, 0, 8192)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
            os.close();
            ins.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 删除本地临时文件
     *
     * @param file
     */
    public static void delteTempFile(File file)
    {
        if (file != null) {
            File del = new File(file.toURI());
            del.delete();
        }
    }

}
