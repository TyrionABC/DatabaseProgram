package com.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.domain.Direction;
import org.apache.ibatis.javassist.NotFoundException;

import java.util.List;
import java.util.Map;

public interface DirectionService {
    boolean insertDirection(Direction direction);
    void deleteDirectionByName(String name);
    void updateDirection (String name,Direction direction) throws NotFoundException;
    Direction selectDirectionByName(String name);
    List<Direction> selectAll();
    Map<String,Object> selectPage(int page, int size, QueryWrapper<Direction> queryWrapper);
    List<Direction> getDirectionsByParent(String parentDirectionName);
    List<Direction> getPaperDirection(String id);
    List<Direction> getAllParents();
    boolean updateParent(String name,Direction direction);
    boolean updateChildren(String name,Direction direction);
}
