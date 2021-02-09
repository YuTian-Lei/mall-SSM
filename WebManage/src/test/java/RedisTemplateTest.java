import com.easycode.mmall.model.User;
import com.easycode.mmall.utils.RedisUtils;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import org.apache.commons.collections.CollectionUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.DefaultTypedTuple;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @Description: //TODO
 * @Date: 2020/6/10 18:24
 * @Author: pengfei.L
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-service.xml"})
public class RedisTemplateTest {
    @Autowired(required = false)
    private RedisTemplate redisTemplate;

    @Test
    public void RedisUtilTest() {
        User user = new User();
        user.setUsername("lpf");
        RedisUtils.setValue("test", user);
        User user1 = (User) RedisUtils.getValue("test");
        System.out.println(user1.getUsername());
    }

    @Test
    public void stringTest() {
        //redisTemplate.expire("keyInt",1,TimeUnit.SECONDS);
        redisTemplate.opsForValue().increment("namespace:test:keyInt",1);
        System.out.println(redisTemplate.opsForValue().get("keyInt"));


        redisTemplate.opsForValue().set("num", "123");
        System.out.println(redisTemplate.opsForValue().get("num"));

        redisTemplate.opsForValue().set("num", "123", 10, TimeUnit.SECONDS);
        System.out.println(redisTemplate.opsForValue().get("num"));

        redisTemplate.opsForValue().set("key", "hello world");
        redisTemplate.opsForValue().set("key", "redis", 6);
        System.out.println("***************" + redisTemplate.opsForValue().get("key"));

        redisTemplate.opsForValue().set("getSetTest", "test");
        System.out.println(redisTemplate.opsForValue().getAndSet("getSetTest", "test2"));
        System.out.println(redisTemplate.opsForValue().get("getSetTest"));

        redisTemplate.opsForValue().set("test", "Hello");
        System.out.println(redisTemplate.opsForValue().get("test"));
        redisTemplate.opsForValue().append("test", "world");
        System.out.println(redisTemplate.opsForValue().get("test"));

        redisTemplate.opsForValue().set("key", "hello world");
        System.out.println("***************" + redisTemplate.opsForValue().size("key"));
    }

    @Test
    public void listTest() {
        System.out.println(redisTemplate.opsForList().size("list"));

        redisTemplate.opsForList().leftPush("list", "java");
        redisTemplate.opsForList().leftPush("list", "python");
        redisTemplate.opsForList().leftPush("list", "c++");
        System.out.println(redisTemplate.opsForList().range("list", 0, -1));

        redisTemplate.delete("list");
        String[] strs = new String[] {"1", "2", "3"};
        redisTemplate.opsForList().leftPushAll("list", strs);
        System.out.println(redisTemplate.opsForList().range("list", 0, -1));

        redisTemplate.delete("list");
        redisTemplate.opsForList().rightPush("listRight", "java");
        redisTemplate.opsForList().rightPush("listRight", "python");
        redisTemplate.opsForList().rightPush("listRight", "c++");
        System.out.println(redisTemplate.opsForList().range("list", 0, -1));

        redisTemplate.delete("list");
        redisTemplate.opsForList().rightPushAll("list", strs);
        System.out.println(redisTemplate.opsForList().range("list", 0, -1));

        System.out.println(redisTemplate.opsForList().range("listRight", 0, -1));
        redisTemplate.opsForList().set("listRight", 1, "setValue");
        System.out.println(redisTemplate.opsForList().range("listRight", 0, -1));

        //Long remove(K key, long count, Object value);
        //从存储在键中的列表中删除等于值的元素的第一个计数事件。
        //计数参数以下列方式影响操作：
        //count> 0：删除等于从头到尾移动的值的元素。
        //count <0：删除等于从尾到头移动的值的元素。
        //count = 0：删除等于value的所有元素。
        System.out.println(redisTemplate.opsForList().range("listRight", 0, -1));
        //将删除列表中存储的列表中第一次次出现的“setValue”
        redisTemplate.opsForList().remove("listRight", 1, "setValue");
        System.out.println(redisTemplate.opsForList().range("listRight", 0, -1));

        System.out.println(redisTemplate.opsForList().range("listRight", 0, -1));
        System.out.println(redisTemplate.opsForList().index("listRight", 2));

        System.out.println(redisTemplate.opsForList().range("list", 0, -1));
        System.out.println(redisTemplate.opsForList().leftPop("list"));
        System.out.println(redisTemplate.opsForList().range("list", 0, -1));

        System.out.println(redisTemplate.opsForList().range("listRight", 0, -1));
        System.out.println(redisTemplate.opsForList().rightPop("listRight"));
        System.out.println(redisTemplate.opsForList().range("listRight", 0, -1));
    }

    @Test
    public void hashTest() {
        Map<String, Object> testMap = new HashMap();
        testMap.put("name", "666");
        testMap.put("age", 27);
        testMap.put("class", "1");
        redisTemplate.opsForHash().putAll("redisHash", testMap);

        System.out.println(redisTemplate.opsForHash().get("redisHash","age"));
        System.out.println(redisTemplate.opsForHash().entries("redisHash"));

        System.out.println(redisTemplate.opsForHash().hasKey("redisHash","666"));
        System.out.println(redisTemplate.opsForHash().hasKey("redisHash","777"));

        redisTemplate.opsForHash().put("redisHash", "name", "667");
        redisTemplate.opsForHash().put("redisHash", "age", 36);
        redisTemplate.opsForHash().put("redisHash", "class", "66");
        System.out.println(redisTemplate.opsForHash().entries("redisHash"));
        System.out.println(redisTemplate.opsForHash().keys("redisHash"));
        System.out.println(redisTemplate.opsForHash().values("redisHash"));



        System.out.println(redisTemplate.opsForHash().size("redisHash"));
        Cursor<Map.Entry<Object, Object>> curosr = redisTemplate.opsForHash().scan("redisHash", ScanOptions.NONE);
        while (curosr.hasNext()) {
            Map.Entry<Object, Object> entry = curosr.next();
            System.out.println(entry.getKey() + ":" + entry.getValue());
        }

        System.out.println(redisTemplate.opsForHash().delete("redisHash", "name"));
        System.out.println(redisTemplate.opsForHash().entries("redisHash"));
    }

    @Test
    public void setTest(){
        String[] strs= new String[]{"str1","str2","str3","lpf","aaa"};
        System.out.println(redisTemplate.opsForSet().add("setTest", strs));

        String[] strs2 = new String[]{"str1","str2"};
        System.out.println(redisTemplate.opsForSet().pop("setTest"));
        System.out.println(redisTemplate.opsForSet().members("setTest"));
        System.out.println(redisTemplate.opsForSet().remove("setTest",strs2));
        System.out.println(redisTemplate.opsForSet().members("setTest"));

        redisTemplate.opsForSet().move("setTest","aaa","setTest2");
        System.out.println(redisTemplate.opsForSet().members("setTest"));
        System.out.println(redisTemplate.opsForSet().members("setTest2"));

        System.out.println(redisTemplate.opsForSet().size("setTest"));

        Cursor<Object> curosr = redisTemplate.opsForSet().scan("setTest", ScanOptions.NONE);
        while (curosr.hasNext()) {
            System.out.println(curosr.next());
        }
    }

    @Test
    public void sortSetTest(){
        System.out.println(redisTemplate.opsForZSet().add("zset1","zset-1",2.0));
        redisTemplate.opsForZSet().add("zset1","zset-2",1.2);
        redisTemplate.opsForZSet().add("zset1","zset-3",3.0);
        ZSetOperations.TypedTuple<Object> objectTypedTuple1 = new DefaultTypedTuple<>("zset-5",9.6);
        ZSetOperations.TypedTuple<Object> objectTypedTuple2 = new DefaultTypedTuple<>("zset-6",9.9);
        Set<ZSetOperations.TypedTuple<Object>> tuples = new HashSet<ZSetOperations.TypedTuple<Object>>();
        tuples.add(objectTypedTuple1);
        tuples.add(objectTypedTuple2);
        System.out.println(redisTemplate.opsForZSet().add("zset1",tuples));
        System.out.println(redisTemplate.opsForZSet().range("zset1",0,-1));

        System.out.println(redisTemplate.opsForZSet().range("zset1",0,-1));
        System.out.println(redisTemplate.opsForZSet().remove("zset1","zset-6"));
        System.out.println(redisTemplate.opsForZSet().range("zset1",0,-1));

        //Set<V> range(K key, long start, long end);
        //通过索引区间返回有序集合成指定区间内的成员，其中有序集成员按分数值递增(从小到大)顺序排列
        System.out.println(redisTemplate.opsForZSet().range("zset1",0,-1));
        //Long rank(K key, Object o);
        //返回有序集中指定成员的排名，其中有序集成员按分数值递增(从小到大)顺序排列
        System.out.println(redisTemplate.opsForZSet().rank("zset1","zset-5"));

        System.out.println(redisTemplate.opsForZSet().rangeByScore("zset1",0,5));
        //Long count(K key, double min, double max);
        //通过分数返回有序集合指定区间内的成员个数
        System.out.println(redisTemplate.opsForZSet().count("zset1",0,5));
        System.out.println(redisTemplate.opsForZSet().size("zset1"));

        //Double score(K key, Object o);
        //获取指定成员的score值
        System.out.println(redisTemplate.opsForZSet().score("zset1","zset-1"));

        System.out.println(redisTemplate.opsForZSet().range("zset1",0,-1));
        System.out.println(redisTemplate.opsForZSet().removeRange("zset1",1,2));
        System.out.println(redisTemplate.opsForZSet().range("zset1",0,-1));

        Cursor<ZSetOperations.TypedTuple<Object>> cursor = redisTemplate.opsForZSet().scan("zset1", ScanOptions.NONE);
        while (cursor.hasNext()) {
            ZSetOperations.TypedTuple<Object> item = cursor.next();
            System.out.println(item.getValue() + ":" + item.getScore());
        }
    }


    @Test
    public void redisTemplateTest(){
        //向redis里存入数据和设置缓存时间
        redisTemplate.opsForValue().set("baike", "100", 60 * 10, TimeUnit.SECONDS);
        //val做-1操作
        redisTemplate.boundValueOps("baike").increment(-1);
        //根据key获取缓存中的val
        redisTemplate.opsForValue().get("baike");
        //val +1
        redisTemplate.boundValueOps("baike").increment(1);
        //根据key获取过期时间
        redisTemplate.getExpire("baike");
        //根据key获取过期时间并换算成指定单位
        redisTemplate.getExpire("baike",TimeUnit.SECONDS);
        //根据key删除缓存
        redisTemplate.delete("baike");
        //检查key是否存在，返回boolean值
        redisTemplate.hasKey("baike");
        //向指定key中存放set集合
        redisTemplate.opsForSet().add("baike", "1","2","3");
        //设置过期时间
        redisTemplate.expire("baike",1000 , TimeUnit.MILLISECONDS);
        //根据key查看集合中是否存在指定数据
        redisTemplate.opsForSet().isMember("baike", "1");
        //根据key获取set集合
        redisTemplate.opsForSet().members("baike");
        //验证有效时间
        Long expire = redisTemplate.boundHashOps("baike").getExpire();
        System.out.println("redis有效时间："+expire+"S");
    }
    /**
     * 根据前缀删除key
     */
    public void deleteByPrex(String prex) {
        prex = prex + "**";
        Set<String> keys = redisTemplate.keys(prex);
        if (CollectionUtils.isNotEmpty(keys)) {
            redisTemplate.delete(keys);
        }
    }


    /**
     * 获得锁
     */
    public boolean getLock(String lockId, long millisecond) {
        Boolean success = redisTemplate.opsForValue().setIfAbsent(lockId, "lock", millisecond, TimeUnit.MILLISECONDS);
        return success != null && success;
    }

    public boolean removeLock(String lockId) {
        Boolean success = redisTemplate.delete(lockId);
        return success != null && success;
    }
}
