package com.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.Paper;
import com.domain.Paper_Basic_info;
import com.domain.Query;

import java.util.List;
import java.util.Map;

public interface PaperService {
    boolean insertPaper(Paper_Basic_info paper);
    boolean deletePaperById(String id);
    boolean updatePaper(Paper_Basic_info paper,String id);
    Paper_Basic_info selectPaperById(String id);
    Paper_Basic_info selectPaperByTitle(String title);
    List<Paper_Basic_info> selectAll();
    Map<String,Object> selectPage(int page, int size, QueryWrapper<Paper_Basic_info> queryWrapper);
    List<Paper> selectPapersByConditions(Query query);
    List<Paper> selectMyPapers(String userId);
}