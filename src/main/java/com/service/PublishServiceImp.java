package com.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dao.PublishMapper;
import com.domain.Paper_Basic_info;
import com.domain.Paper_publish;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PublishServiceImp implements PublishService{
    @Autowired
    private PublishMapper publishMapper;
    @Override
    public void insert(Paper_publish publishInfo) {
        publishMapper.insert(publishInfo);
    }

    @Override
    public void delete(String id) {
        QueryWrapper<Paper_publish> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("id",id);
        publishMapper.delete(queryWrapper);
    }

    @Override
    public void update(Paper_publish publishInfo) {
        publishMapper.updateById(publishInfo);
    }

    @Override
    public List<Paper_Basic_info> selectByPublishInfo(Paper_publish publishInfo) {
        return publishMapper.selectPaperByPublishInfo(publishInfo);
    }
    @Override
    public List<Paper_publish> selectById(String id) {
        QueryWrapper<Paper_publish> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("id",id);
        return publishMapper.selectList(queryWrapper);
    }
    @Override
    public Paper_publish selectByPaperId(String paperId) {
        return publishMapper.selectByPaperId(paperId);
    }
}
