package com.easycode.mmall.service.impl;

import cn.hutool.core.io.FileUtil;
import com.easycode.mmall.service.IFileService;
import com.easycode.mmall.utils.FTPUtil;
import com.google.common.collect.Lists;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
public class FileServiceImpl implements IFileService {

  @Override
  public  String upload(MultipartFile file,String path){
    String fileName = file.getOriginalFilename();
    String fileExtensionName = fileName.substring(fileName.lastIndexOf(".")+1);
    String uploadFileName = UUID.randomUUID().toString()+"."+fileExtensionName;
    log.info("开始上传文件,上传文件的文件名:{},上传的路径:{},新文件名:{}",fileName,path,uploadFileName);

    //创建目录
    FileUtil.mkdir(path);
    File targetFile = new File(path,uploadFileName);
    try {
      file.transferTo(targetFile);
      //文件已经上传成功

      //将targetFile上传到FTP服务器上
      FTPUtil.uploadFile(Lists.newArrayList(targetFile));

      //上传完之后，删除upload下面的文件
      FileUtil.del(targetFile);

    } catch (IOException e) {
      log.error("上传文件异常",e);
      return null;
    }
    return  targetFile.getName();
  }
}
