package com.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.domain.*;
//import com.domain.Query;
import org.apache.ibatis.annotations.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

//⽀持按照研究⽅向、论⽂标题、论⽂类型、论⽂摘要模糊查询、作者、发布⼈、
//会议等条件筛选或查询，以及组合查询。具体实现度⾃⾏决定。
//列表查询结果⽀持分页、排序
@Mapper
public interface PaperMapper extends BaseMapper<Paper_Basic_info> {
//    需要模糊查询:
//    1.使用 $ 占位符:使用 $ 作为占位符，会存在 sql 注入问题，生产环境中应当避免使用
//    2.使用数据库函数 concat:concat 属于数据库函数，MySQL 和 Oracle 都支持，用于字符串连接，而且可以使用 # 作为占位符，防止 SQL 注入,
//      但是有些公司并不推荐使用数据库函数，因为可能会切换数据库
//    3.使用 Mybatis 的动态 sql 标签
    //论文标题
//研究方向
//论文类型
//论文摘要
//作者
//发布人
//会议
    @Select({"<script>" +
            "select * from paper_basic_info left join belong on paper_basic_info.id=belong.id " +
            "left join direction on belong.direction_name=direction.direction_name " +
            "left join note_and_extra_file on paper_basic_info.id=note_and_extra_file.id " +
            "left join paper_publish on paper_basic_info.id=paper_publish.id " +
            "left join writer on paper_basic_info.id=writer.id " +
            "left join user on paper_basic_info.publisher_id=user.user_id " +
            "<where>" +
            "<if test='query.directionName!=null'>belong.direction_name like concat('%',#{query.directionName},'%')</if>" +
            "<if test='query.title!=null'>and paper_basic_info.title like concat('%',#{query.title},'%')</if>" +
            "<if test='query.thesisType!=null'>and paper_basic_info.thesis_type like concat('%',#{query.thesisType},'%')</if>" +
            "<if test='query.overview!=null'>and note_and_extra_file.overview like concat('%',#{query.overview},'%')</if>" +
            "<if test='query.publishMeeting!=null'>and paper_publish.publish_meeting=#{query.publishMeeting}</if>" +
            "<if test='query.name!=null'>and writer.writer_name=#{query.name}</if>" +
            "<if test='query.userName!=null'>and user.name=#{query.userName}</if>" +
            "</where>" +
            "</script>"})
    List<Paper> getPapersByConditions(@Param("query") Query query);
//    @Insert("<script>" +
//            "insert into paper_basic_info ( id, title, thesis_type,  literature_link, publisher_id, text, flag, like )" +
//            "values (#{paper.id},#{paper.title},#{paper.thesisType},#{paper.literatur})" +
//            "</script>")
//    void insertPaper(@Param("paper") Paper paper);
    @Select({"<script>" +
            "select * from paper_basic_info left join belong on paper_basic_info.id=belong.id " +
            "left join direction on belong.direction_name=direction.direction_name " +
            "left join note_and_extra_file on paper_basic_info.id=note_and_extra_file.id " +
            "left join paper_publish on paper_basic_info.id=paper_publish.id " +
            "left join writer on paper_basic_info.id=writer.id " +
            "left join user on paper_basic_info.publisher_id=user.user_id " +
            "<where>" +
            "paper_basic_info.publisher_id=#{userId}" +
            "</where>" +
            "</script>"})
    List<Paper> getMyPapers(@Param("userId") String userId);

    @Select({"<script>" +
            "select * from paper_basic_info left join belong on paper_basic_info.id=belong.id " +
            "left join direction on belong.direction_name=direction.direction_name " +
            "left join note_and_extra_file on paper_basic_info.id=note_and_extra_file.id " +
            "left join paper_publish on paper_basic_info.id=paper_publish.id " +
            "left join writer on paper_basic_info.id=writer.id " +
            "left join user on paper_basic_info.publisher_id=user.user_id " +
            "order by paper_basic_info.thesis_date desc " +
            "limit 0,20"+
            "</script>"})
    List<Paper> getNewPapers();




    @Select("select * from paper_basic_info where id=#{id}")
    Paper_Basic_info selectPaperById(String id);

    @Delete("delete from paper_basic_info where id=#{id}")
    void deletePaperById(String id);

    @Select("select * from paper_basic_info where title=#{title}")
    Paper_Basic_info selectPaperByTitle(String title);

    @Select("select count(*) as num,direction.parent_direction_name as direction,sum(paper_basic_info.`likes`) as likes " +
            "from direction inner join belong on direction.direction_name=belong.direction_name INNER JOIN paper_basic_info on paper_basic_info.id=belong.id " +
            "WHERE paper_basic_info.publisher_id=#{userId} GROUP BY direction.parent_direction_name")
    List<MyPaper> selectMyPaper(String userId);

    @Select("SELECT count(*) FROM paper_basic_info WHERE flag=0 GROUP BY DATE_FORMAT(thesis_date,'%Y-%m') ORDER BY DATE_FORMAT(thesis_date,'%Y-%m') DESC")
    List<Integer> getPapersOfMonth();

    @Select("select count(*) FROM paper_basic_info WHERE flag=0 and paper_basic_info.publisher_id=#{userId} GROUP BY DATE_FORMAT(thesis_date,'%Y-%m-%d') ORDER BY DATE_FORMAT(thesis_date,'%Y-%m-%d') DESC")
    List<Integer> getPapersOfDay(String userId);

    @Update("update paper_basic_info set likes=likes+1 where id=#{paperId}")
    void likePaper(String paperId);

    @Select("select likes from paper_basic_info where id=#{paperId}")
    Integer selectLike(String paperId);

    @Select("SELECT DATE_FORMAT(CURDATE(), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 0 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 1 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 1 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 2 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 2 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 3 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 3 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 4 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 4 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 5 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 5 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 6 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 6 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 7 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 7 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 8 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 8 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 9 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 9 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 10 MONTH), '%Y-%m') AS `month`,count(*) as num  from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 10 MONTH), '%Y-%m') and flag=0\n" +
            "UNION SELECT DATE_FORMAT((CURDATE() - INTERVAL 11 MONTH), '%Y-%m') AS `month`,count(*) as num from paper_basic_info where DATE_FORMAT(thesis_date,'%Y-%m')=DATE_FORMAT((CURDATE() - INTERVAL 11 MONTH), '%Y-%m') and flag=0;")
    List<Month> getNums();

    @Select("select * from paper_basic_info where flag=0 order by thesis_date desc limit 0,20")
    List<Paper_Basic_info> selectNewPapers();

    @Select("select * from paper_basic_info order by thesis_date desc")
    List<Paper_Basic_info> selectAll();
}
