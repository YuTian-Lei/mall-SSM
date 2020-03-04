import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;
import com.easycode.mmall.utils.DateUtils;
import java.util.Date;
import org.junit.Test;

public class WebManageTest {

  @Test
  public  void testDate(){
    System.out.println(DateUtil.betweenDay(DateUtils.addDateDays(new Date(),-4), new Date(),true));
  }
}
