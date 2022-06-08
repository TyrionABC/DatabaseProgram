package com.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.dao.*;
import com.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PaperServiceImp implements PaperService{
    @Autowired
    private PaperMapper paperMapper;
    @Autowired
    private WriterMapper writerMapper;
    @Autowired
    private BelongMapper belongMapper;
    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private NoteAndFileMapper noteAndFileMapper;
    @Autowired
    private PublishMapper publishMapper;
    @Autowired
    private ReferenceMapper referenceMapper;
    @Autowired
    private BelongService belongService;
    @Autowired
    private DirectionService directionService;
    @Autowired
    private WriterService writerService;
    @Override
    public String insertPaper(Paper_Basic_info paper) {
        String id = UUID.randomUUID().toString().substring(0,10);
        while (paperMapper.selectPaperById(id)!=null){
            id=UUID.randomUUID().toString().substring(0,10);
        }
        paper.setThesisDate(new Date());
        paper.setId(id);
        paper.setLike(0);
        //paper.setFlag(0);
        System.out.println(paper);
        paperMapper.insert(paper);
        return id;
    }

    @Override
    public boolean deletePaperById(String id) {
        if(paperMapper.selectPaperById(id)==null)
            return false;//没有要删除的论文
        else{
            belongMapper.deleteById(id);
            commentMapper.deleteByPaperId(id);
            noteAndFileMapper.deleteNoteById(id);
            publishMapper.deleteByPaperId(id);
            referenceMapper.deleteReferenceById(id);
            writerMapper.deleteWriterByPaperId(id);
            paperMapper.deletePaperById(id);
        }
        return true;
    }

    @Override
    public boolean updatePaper(Paper_Basic_info paper) {
        if (paperMapper.selectPaperById(paper.getId())==null){
            return false;
        }
        else{
            //paper.setId(paper.getId());
            paper.setLike(paperMapper.selectLike(paper.getId()));
            paper.setThesisDate(paperMapper.selectPaperById(paper.getId()).getThesisDate());
            paperMapper.updateById(paper);
            return true;
        }
    }


    @Override
    public Paper_Basic_info selectPaperById(String id) {
        return paperMapper.selectPaperById(id);
    }

    @Override
    public Paper_Basic_info selectPaperByTitle(String title) {
        return paperMapper.selectPaperByTitle(title);
    }

    @Override
    public List<Paper_Basic_info> selectAll() {
        return paperMapper.selectList(null);
    }

    @Override
    public Map<String, Object> selectPage(int page, int size, QueryWrapper<Paper_Basic_info> queryWrapper) {
        Page<Paper_Basic_info> pageInfo=new Page<>(page,size);
        IPage<Paper_Basic_info> paperIPage=paperMapper.selectPage(pageInfo,queryWrapper);
        Map<String,Object> pageMap=new HashMap<>(3);
        pageMap.put("total_record",paperIPage.getTotal());
        pageMap.put("total_pages",paperIPage.getPages());
        pageMap.put("current_data",paperIPage.getRecords());
        return pageMap;
    }
    //去重
    private void method(List<Paper> papers) {
        for( int  i  =   0 ; i  <  papers.size()  -   1 ; i ++ )  {
            for  ( int  j  =  papers.size()  -   1 ; j  >  i; j -- )  {
                // 这里是对象的比较，如果去重条件不一样，在这里修改即可
                if  (papers.get(j).getId().equals(papers.get(i).getId()))  {
                    papers.remove(j);
                }
            }
        }
    }
    @Override
    public List<Paper> selectPapersByConditions(Query query) {
        List<Paper> papers=paperMapper.getPapersByConditions(query);
        method(papers);
        for (Paper paper:papers){
            List<String> list1=new ArrayList<>();
            List<String> list=new ArrayList<>();
            paper.setWriters(list1);
            paper.setPaths(list);
            List<Belong> belongs=belongService.getAllById(paper.getId());
            for(Belong belong:belongs){
                String parent=directionService.selectDirectionByName(belong.getDirectionName()).getParentDirectionName();
                int flag=1;
                for (Belong belong1:belongs){
                    if (parent.equals(belong1.getDirectionName())){
                        flag=0;
                        break;
                    }
                }
                if (flag==1)
                    paper.getPaths().add(parent);
                paper.getPaths().add(belong.getDirectionName());
            }
            List<Writer> writers=writerService.selectWriters(paper.getId());
            for (int i = 1; i <= writers.size(); i++) {
                for (Writer writer: writers) {
                    if (writer.getLevel()==i){
                        paper.getWriters().add(writer.getWriterName());
                    }
                }
            }
        }
        return papers;
    }


    @Override
    public List<Paper> selectMyPapers(String userId) {
        List<Paper> papers=paperMapper.getMyPapers(userId);
        method(papers);
        for (Paper paper:papers){
                List<String> list=new ArrayList<>();
                paper.setPaths(list);
                List<Belong> belongs=belongService.getAllById(paper.getId());
                for(Belong belong:belongs){
                    String parent=directionService.selectDirectionByName(belong.getDirectionName()).getParentDirectionName();
                    int flag=1;
                    for (Belong belong1:belongs){
                        if (parent.equals(belong1.getDirectionName())){
                            flag=0;
                            break;
                        }
                    }
                    if (flag==1)
                        paper.getPaths().add(parent);
                    paper.getPaths().add(belong.getDirectionName());
                }
            }

        return papers;
    }

    @Override
    public List<Paper> selectNewPapers() {
        int flag=0;
        List<Paper> papers=paperMapper.getNewPapers();
        List<Paper> newPapers=new ArrayList<>();
        for(Paper paper:papers){
            flag=0;
            for(Paper newPaper:newPapers){
                if (paper.getId().equals(newPaper.getId())){
                    flag=1;
                    break;
                }
            }
            if (flag==1)
                continue;
            if (writerMapper.selectWritersById(paper.getId()).size()>1){
                String str1="";
                String str2="";
                for(Writer writer:writerMapper.selectWritersById(paper.getId())){
                    if (writer.getLevel()==1){
                        str1+="第一作者:"+writer.getWriterName()+";";
                    }

                    else{
                        str2+="第二作者:"+writer.getWriterName()+"";
                    }
                }
                paper.setWriterName(str1+str2);
            }
            newPapers.add(paper);
        }
        return newPapers;
    }

    @Override
    public List<MyPaper> getMyPapers(String userId) {
        return paperMapper.selectMyPaper(userId);
    }

    @Override
    public List<Integer> getPaperOfMonth() {
        List<Integer> nums = new ArrayList<>();
        for (Month month:paperMapper.getNums()){
            nums.add(month.getNum());
        }
        return nums;
    }

    @Override
    public List<Integer> getPaperOfDay(String userId) {
        return paperMapper.getPapersOfDay(userId);
    }

    @Override
    public Integer likePaper(String paperId) {
        paperMapper.likePaper(paperId);
        return paperMapper.selectLike(paperId);
    }

    @Override
    public void update(Paper_Basic_info paper_basic_info) {
        paper_basic_info.setThesisDate(new Date());
        paper_basic_info.setLike(0);
        paperMapper.updateById(paper_basic_info);
    }

}
