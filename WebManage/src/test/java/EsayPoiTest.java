import cn.afterturn.easypoi.excel.ExcelExportUtil;
import cn.afterturn.easypoi.excel.ExcelImportUtil;
import cn.afterturn.easypoi.excel.annotation.Excel;
import cn.afterturn.easypoi.excel.entity.ExportParams;
import cn.afterturn.easypoi.excel.entity.ImportParams;
import com.easycode.mmall.utils.AnnotationUtil;
import com.easycode.mmall.web.dto.ImageDTO;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.poi.ss.usermodel.Workbook;
import org.junit.Assert;
import org.junit.Test;

/**
 * @Description: //TODO
 * @Date: 2020/6/22 14:10
 * @Author: pengfei.L
 */

public class EsayPoiTest {

    @Test
    public void test() {
        try {
            AnnotationUtil.modifyAnnotationParams(ImageDTO.class,"companyLogo", Excel.class,"savePath","D:\\image");
            ImportParams params = new ImportParams();
            params.setHeadRows(1);
            params.setNeedSave(true);
            params.setSaveUrl("D:\\image\\recheckOctImg");
            List<ImageDTO> result = ExcelImportUtil.importExcel(new File("C:\\Users\\lenovo\\Desktop\\ExcelExportHasImgTest.exportCompanyImg.xls"), ImageDTO.class, params);
            for (int i = 0; i < result.size(); i++) {
                System.out.println(ReflectionToStringBuilder.toString(result.get(i)));
            }
            //Assert.assertTrue(result.size() == 4);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void exportCompanyImg() throws Exception {

        File savefile = new File("D:/excel/");
        if (!savefile.exists()) {
            savefile.mkdirs();
        }
        List<ImageDTO> list = new ArrayList<ImageDTO>();
        list.add(new ImageDTO("百度", "F:\\image\\u=2756824433,845554949&fm=26&gp=0.jpg", "北京市海淀区西北旺东路10号院百度科技园1号楼"));
        list.add(new ImageDTO("阿里巴巴", "F:\\image\\u=2756824433,845554949&fm=26&gp=0.jpg", "北京市海淀区西北旺东路10号院百度科技园1号楼"));
        list.add(new ImageDTO("Lemur", "F:\\image\\u=2756824433,845554949&fm=26&gp=0.jpg", "亚马逊热带雨林"));
        list.add(new ImageDTO("一众", "F:\\image\\u=2756824433,845554949&fm=26&gp=0.jpg", "山东济宁俺家"));

        Workbook workbook = ExcelExportUtil.exportExcel(new ExportParams(), ImageDTO.class, list);
        FileOutputStream fos = new FileOutputStream("D:/excel/ExcelExportHasImgTest.exportCompanyImg.xls");
        workbook.write(fos);
        fos.close();
    }
}
