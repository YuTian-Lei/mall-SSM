package com.easycode.mmall.core;

import java.util.List;
import org.apache.ibatis.exceptions.TooManyResultsException;
import tk.mybatis.mapper.entity.Condition;
import tk.mybatis.mapper.entity.Example;

public interface Service<T> {
    int save(T model);

    void save(List<T> models);

    void deleteById(Integer id);

    void delete(String fieldName, Object value);

    /**
     * ids -> “1,2,3,4”
     *
     * @param ids
     */
    void deleteByIds(String ids);

    void update(T model);

    void updateByExampleSelective(T model, Example example);

    /**
     * 修改允许输入null
     *
     * @param model
     * @return
     */
    void updateByPrimaryKey(T model);

    T findById(Integer id);

    List<T> findList(String property, Object value);

    List<T> findList(T model);

    /**
     * 通过Model中某个成员变量名称（非数据表中column的名称）查找,value需符合unique约束
     *
     * @param fieldName
     * @param value
     * @return
     * @throws TooManyResultsException
     */
    T findBy(String fieldName, Object value) throws TooManyResultsException;

    /**
     * 通过多个ID查找//eg：ids -> “1,2,3,4
     *
     * @param ids
     * @return
     */
    List<T> findByIds(String ids);

    /**
     * 根据条件查找，基本打表查询均可满足
     *
     * @param condition
     * @return
     */
    List<T> findByCondition(Condition condition);

    List<T> findAll();

    List<T> findByExample(Example example);

    int findCountByExample(Example example);
}

