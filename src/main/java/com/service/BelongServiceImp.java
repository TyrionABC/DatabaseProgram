package com.service;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.dao.BelongMapper;
import com.domain.Belong;
import com.domain.Direction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BelongServiceImp implements BelongService{

    @Autowired
    private BelongMapper belongMapper;
    @Override
    public List<Belong> getAllById(String id) {
        return belongMapper.selectById(id);
    }

    @Override
    public List<Belong> getAllByDirection(String directionName) {
        return belongMapper.selectByDirection(directionName);
    }

    @Override
    public void deleteBelongs(Belong belong) {
        if(belong.getId()!=null&&belong.getDirectionName()!=null){
            belongMapper.delete(belong.getId(),belong.getDirectionName());
        }
        else if(belong.getId()!=null){
            belongMapper.deleteById(belong.getId());
        }
        else {
            belongMapper.deleteByDirection(belong.getDirectionName());
        }
    }

    @Override
    public void insertBelong(Belong belong) {
        belongMapper.insert(belong);
    }

    @Override
    public List<Belong> getAll() {
        return belongMapper.selectList(null);
    }

    @Override
    public Belong selectBelong(Belong belong) {
        return belongMapper.selectOne(belong.getId(),belong.getDirectionName());
    }

    @Override
    public void update(String id,List<String> directions) {
        //先删除所有
        belongMapper.deleteById(id);
        //添加
        for(String direction:directions){
            belongMapper.insert(new Belong(direction,id));
        }
    }
}
