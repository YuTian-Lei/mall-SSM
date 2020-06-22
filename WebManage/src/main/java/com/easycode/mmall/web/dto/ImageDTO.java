package com.easycode.mmall.web.dto;

import cn.afterturn.easypoi.excel.annotation.Excel;
import cn.afterturn.easypoi.excel.annotation.ExcelTarget;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Description: //TODO
 * @Date: 2020/6/22 14:11
 * @Author: pengfei.L
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ExcelTarget("ImageDTO")
public class ImageDTO {
    @Excel(name = "公司名称", height = 40, width = 20,orderNum = "0")
    private String companyName;

    @Excel(name = "公司LOGO", type = 2 ,width = 40 , height = 20,imageType = 1,savePath="D:\\image\\recheckOctImg",orderNum = "2")
    private String companyLogo;

    @Excel(name = "公司地址", height = 40, width = 20,orderNum = "2")
    private String address;
}
