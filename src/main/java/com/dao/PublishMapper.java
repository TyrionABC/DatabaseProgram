package com.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.domain.Paper_Basic_info;
import com.domain.Paper_publish;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

@Mapper
public interface PublishMapper extends BaseMapper<Paper_publish> {
    @Select({"<script>"+
            "select * from paper_publish left join paper_basic_info pbi on pbi.id = paper_publish.id"+
            "<where>"+
            "<if test='publish.publisher!=null'>publisher=#{publish.publisher}</if>"+
            "<if test='publish.publisherId!=null'>and paper_publish.publisher_id=#{publish.publisherId}</if>"+
            "<if test='publish.publishMeeting!=null'>and publish_meeting=#{publish.publishMeeting}</if>"+
            "<if test='publish.publishTime!=null'>and publish_time=#{publish.publishTime}</if>"+
            "</where>"+
            "</script>"})
    List<Paper_Basic_info> selectPaperByPublishInfo(@Param("publish") Paper_publish publish);

    @Select("select * from paper_publish where id=#{paperId}")
    Paper_publish selectByPaperId(String paperId);

    @Delete("delete from paper_publish where id=#{id}")
    void deleteByPaperId(String id);
//    @Select({"<script>"+
//            "select * from paper_publish left join paper_basic_info pbi on pbi.id = paper_publish.id"+
//            "<where>"+
//            "<if test='publisher!=null'>publisher=#{publisher}</if>"+
//            "<if test='publisherId!=null'>and paper_publish.publisher_id=#{publisherId}</if>"+
//            "<if test='publishMeeting!=null'>and publish_meeting=#{publishMeeting}</if>"+
//            "<if test='publishTime!=null'>and publish_time=#{publishTime}</if>"+
//            "</where>"+
//            "</script>"})
//    List<Paper_Basic_info> selectPaperByPublishInfo(
//            @Param("publisher") String publisher,
//            @Param("publisherId") String publisherId,
//            @Param("publishMeeting") String publisherMeeting,
//            @Param("publishTime") Date publishTime);
}
