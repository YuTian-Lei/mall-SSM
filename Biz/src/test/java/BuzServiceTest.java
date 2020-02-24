import com.easycode.mmall.model.mmallUser;
import com.easycode.mmall.service.mmallUserService;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(value = SpringRunner.class)
@ContextConfiguration(locations = {"classpath:spring-service.xml"})

public class BuzServiceTest {

  @Autowired
  private mmallUserService mmallUserService;

  @Test
  public void testBuzService(){
    List<mmallUser> mmallUserList = mmallUserService.findAll();
    mmallUserList.forEach(mmallUser -> System.out.println(mmallUser.getUsername()));
  }
}
