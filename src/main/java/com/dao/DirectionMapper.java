package com.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.domain.Direction;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DirectionMapper extends BaseMapper<Direction> {
    @Select("select * from direction where direction_name=#{name}")
    Direction selectDirectionByName(String name);
    @Delete("delete from direction where direction_name=#{name}")
    void deleteDirectionByName(String name);

    @Select("select * from direction where parent_direction_name=#{parentDirectionName}")
    List<Direction> selectDirectionByParent(String parentDirectionName);

    @Update("update direction set direction_name=#{direction.directionName}," +
            "parent_direction_name=#{direction.parentDirectionName}," +
            "level=#{direction.level}," +
            "path=#{direction.path} " +
            "where direction_name=#{name}")
    void updateByName(String name,@Param("direction") Direction direction);

    @Select("select * from belong inner join direction on belong.direction_name=direction.direction_name where belong.id=#{id}")
    List<Direction> selectPaperDirections(String id);

    @Select("select * from direction where direction_name=parent_direction_name")
    List<Direction> selectAllParents();

    @Update("update direction set parent_direction_name=#{newParent} where parent_direction_name=#{oldParent}")
    void updateParentDirection(String oldParent,String newParent);

}
