package com.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.domain.Belong;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BelongMapper extends BaseMapper<Belong> {
    @Select("select * from belong where id=#{id}")
    List<Belong> selectById(String id);
    @Select("select * from belong where direction_name=#{directionName}")
    List<Belong> selectByDirection(String directionName);
    @Select("select * from belong where id=#{id} and direction_name=#{directionName}")
    Belong selectOne(String id,String directionName);
    @Delete("delete from belong where id=#{id}")
    void deleteById(String id);
    @Delete("delete from belong where direction_name=#{directionName}")
    void deleteByDirection(String directionName);
    @Delete("delete from belong where direction_name=#{directionName} and id=#{id}")
    void delete(String id,String directionName);
//    @Insert("insert into belong(id,direction_name) values (#{id},#{directionName})")
//    void insertInto(String id,String directionName);
    @Update("update belong set direction_name=#{newName} where direction_name=#{oldName}")
    void updateDirection(String oldName,String newName);
}
