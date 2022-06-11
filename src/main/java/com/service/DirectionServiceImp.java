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
            //插入一级方向
            if (direction.getDirectionName().equals(direction.getParentDirectionName())) {
                direction.setLevel(1);
                direction.setPath(direction.getDirectionName());
            }
            else {//插入二级方向
                Direction parent=directionMapper.selectDirectionByName(direction.getParentDirectionName());
                 if (parent==null||parent.getLevel()==2)
                     return false;//子方向的父亲方向不存在或者父方向为子方向
                direction.setLevel(2);
                direction.setPath(direction.getParentDirectionName()+"-"+direction.getDirectionName());
            }
            directionMapper.insert(direction);
            return true;
        }
    }

    @Override
    public void deleteDirectionByName(String name) {
        //如果是父方向,则修改其子方向的信息
        if (directionMapper.selectDirectionByName(name).getLevel()==1){
            List<Direction> directions=directionMapper.selectDirectionByParent(name);
            for(Direction direction:directions){
                direction.setParentDirectionName(direction.getDirectionName());
                direction.setLevel(1);
                direction.setPath(direction.getDirectionName());
                directionMapper.updateById(direction);
            }
        }
        belongMapper.deleteByDirection(name);
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
        return directionMapper.selectPaperDirections(id);
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
        Direction direction1=this.selectDirectionByName(name);
        if (!direction1.getParentDirectionName().equals(direction.getParentDirectionName())
                &&!direction1.getDirectionName().equals(direction.getDirectionName())){
            System.out.println("不能同时修改父方向和子方向");
            return false;
        }
        else if (!direction.getDirectionName().equals(direction1.getDirectionName())){
            System.out.println("修改子方向");
            if (directionMapper.selectDirectionByName(direction.getDirectionName())!=null){
                System.out.println("子方向名字重复");
                return false;
            }
            else {
                System.out.println("成功修改子方向");
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
        else if (!direction.getParentDirectionName().equals(direction1.getParentDirectionName())) {
            System.out.println("修改父方向");
            if (this.getDirectionsByParent(direction.getParentDirectionName()).size() == 0) {
                System.out.println("要修改的父方向不存在");
                return false;
            } else {
                //directionMapper.updateParentByChild(direction.getDirectionName(), direction.getParentDirectionName());
                direction.setLevel(2);
                direction.setPath(direction.getParentDirectionName()+"-"+direction.getDirectionName());
                directionMapper.updateById(direction);
                System.out.println("修改成功");
                return true;
            }
        }
        return false;
    }


}
