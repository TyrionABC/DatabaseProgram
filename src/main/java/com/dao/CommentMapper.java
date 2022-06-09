package com.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.domain.Comment;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {
    @Select("select * from comment where parent_comment_id is null and id=#{id}")
    List<Comment> selectRoots(String id);
    @Select("select * from comment where parent_comment_id=#{commentId}")
    List<Comment> selectReplies(String commentId);
    @Delete("delete from comment where id=#{paperId}")
    void deleteByPaperId(String paperId);
    @Select("select * from comment where parent_comment_id=#{id}")
    List<Comment> selectCommentsByParent(String id);
    @Select("select * from comment where comment_id=#{commentId}")
    Comment selectComment(String commentId);

    @Update("update comment set parent_comment_id=null where comment_id=#{commentId}")
    void updateNull(String commentId);

    @Delete("delete from comment where root=#{root}")
    void deleteCommentByRoot(String root);
}
