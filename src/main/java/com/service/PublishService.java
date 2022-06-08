package com.service;

import com.domain.Paper_Basic_info;
import com.domain.Paper_publish;
import org.springframework.stereotype.Service;

import java.util.List;

public interface PublishService {
    void insert(Paper_publish publishInfo);
    void delete(String id);
    void update(Paper_publish publishInfo);
    //根据发布信息查找论文
    List<Paper_Basic_info> selectByPublishInfo(Paper_publish publishInfo);
    //根据论文id查找发布信息
    List<Paper_publish> selectById(String id);
    Paper_publish selectByPaperId(String paperId);
}
