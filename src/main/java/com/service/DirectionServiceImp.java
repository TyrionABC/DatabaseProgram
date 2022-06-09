package com.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.dao.BelongMapper;
import com.dao.DirectionMapper;
import com.domain.Direction;
import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DirectionServiceImp implements DirectionService{
    @Autowired
    private DirectionMapper directionMapper;
    @Autowired
    private BelongMapper belongMapper;
    @Override
    public boolean insertDirection(Direction direction) {
        //该方向已经存在
        if(directionMapper.selectDirectionByName(direction.getDirectionName())!=null){
            return false;
        }
        else{
            if (direction.getDirectionName().equals(direction.getParentDirectionName())) {
                direction.setLevel(1);
                direction.setPath(direction.getDirectionName());
            }
            else {
                direction.setLevel(2);
                direction.setPath(direction.getParentDirectionName()+"-"+direction.getDirectionName());
            }
            directionMapper.insert(direction);
            return true;
        }
    }

    @Override
    public void deleteDirectionByName(String name) {
        if (directionMapper.selectDirectionByName(name).getLevel()==1){
            List<Direction> directions=directionMapper.selectDirectionByParent(name);
            for(Direction direction:directions){
                direction.setParentDirectionName(direction.getDirectionName());
                direction.setLevel(1);
                direction.setPath(direction.getDirectionName());
                directionMapper.updateById(direction);
            }
            belongMapper.deleteByDirection(name);
        }
        directionMapper.deleteDirectionByName(name);
    }

    @Override
    public void updateDirection(String name,Direction direction){
        //子方向与父方向相同，改为一级方向
        if (direction.getParentDirectionName().equals(direction.getDirectionName())){
            direction.setPath(direction.getDirectionName());
            direction.setLevel(1);
        }
        else{
            direction.setLevel(2);
            direction.setPath(direction.getParentDirectionName()+"-"+direction.getDirectionName());
        }
        directionMapper.updateByName(name,direction);
    }

    @Override
    public Direction selectDirectionByName(String name) {
        return directionMapper.selectDirectionByName(name);
    }
    public List<Direction> selectAll(){
        return directionMapper.selectList(null);
    }

    @Override
    public Map<String,Object> selectPage(int page,int size,QueryWrapper<Direction> queryWrapper) {
        Page<Direction> pageInfo=new Page<>(page,size);
        IPage<Direction> directionIPage=directionMapper.selectPage(pageInfo,queryWrapper);
        Map<String,Object> pageMap=new HashMap<>(3);
        pageMap.put("total_record",directionIPage.getTotal());
        pageMap.put("total_pages",directionIPage.getPages());
        pageMap.put("current_data",directionIPage.getRecords());
        return pageMap;
    }

    @Override
    public List<Direction> getDirectionsByParent(String parentDirectionName) {
        return directionMapper.selectDirectionByParent(parentDirectionName);
    }

    @Override
    public List<Direction> getPaperDirection(String id) {
        List<Direction> directions=directionMapper.selectPaperDirections(id);
        return directions;
    }

    @Override
    public List<Direction> getAllParents() {
        return directionMapper.selectAllParents();
    }

    @Override
    public boolean updateParent(String name, Direction direction) {
        if (this.selectDirectionByName(direction.getDirectionName()) != null)
            return false;//要修改的方向已经存在
        else{
            direction.setParentDirectionName(direction.getDirectionName());
            direction.setLevel(1);
            direction.setPath(direction.getDirectionName());
            directionMapper.updateParentDirection(name,direction.getDirectionName());//换掉所有子方向的父方向
            for (Direction direction1:directionMapper.selectDirectionByParent(direction.getDirectionName())){
                direction1.setPath(direction1.getParentDirectionName()+"-"+direction1.getDirectionName());
                directionMapper.updateById(direction1);//更新子方向
            }
            directionMapper.insert(direction);//插入新方向
            //将所有belong的directionName换掉
            belongMapper.updateDirection(name,direction.getDirectionName());
            //删除旧方向
            directionMapper.deleteDirectionByName(name);
            return true;
        }
    }

    @Override
    public boolean updateChildren(String name, Direction direction) {
        //方向名重复
        if (directionMapper.selectDirectionByName(direction.getDirectionName())!=null){
            return false;
        }
        else {
            direction.setParentDirectionName(
                    directionMapper.selectDirectionByName(name).getParentDirectionName());
            direction.setLevel(2);
            direction.setPath(direction.getParentDirectionName()+"-"+direction.getDirectionName());
            //插入新方向
            directionMapper.insert(direction);
            //换掉所有belong的directionName
            belongMapper.updateDirection(name,direction.getDirectionName());
            //删除旧方向
            directionMapper.deleteDirectionByName(name);
            return true;
        }

    }


}
