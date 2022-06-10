package com.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dao.CommentMapper;
import com.domain.Comment;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class CommentServiceImp implements CommentService{
    @Autowired
    private CommentMapper commentMapper;
    @Override
    public void insert(Comment comment) {
        String id = UUID.randomUUID().toString().substring(0,10);
        QueryWrapper<Comment> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("comment_id",id);
        while (commentMapper.selectOne(queryWrapper)!=null){
            id=UUID.randomUUID().toString().substring(0,10);
        }
        comment.setDate(new Date(System.currentTimeMillis()));
        comment.setCommentId(id);
        //没有父评论，设置root为id
        if ("".equals(comment.getParentCommentId())){
            comment.setParentCommentId(null);
            comment.setRoot(id);
        }
        System.out.println(comment);
        commentMapper.insert(comment);
    }

    @Override
    public void delete(String commentId) {
        //是根评论则删除所有评论
        if (commentMapper.selectComment(commentId).getRoot().equals(commentId)){
            commentMapper.deleteCommentByRoot(commentId);
        }
        List<Comment> comments=commentMapper.selectCommentsByParent(commentId);
        for(Comment comment:comments){
            commentMapper.updateNull(comment.getCommentId());
        }
        QueryWrapper<Comment> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("comment_id",commentId);
        commentMapper.delete(queryWrapper);
    }

    @Override
    public void update(Comment comment) {
        Comment comment1=commentMapper.selectComment(comment.getCommentId());
        commentMapper.updateById(comment);
    }

//查询论文的所有一级评论
    @Override
    public List<Comment> getRoots(String id) {
        return commentMapper.selectRoots(id);
    }
//查询该评论的所有回复
    @Override
    public List<Comment> getReplies(String commentId) {
        return commentMapper.selectReplies(commentId);
    }

    @Override
    public Comment selectComment(String commentId) {
        return commentMapper.selectComment(commentId);
    }

    @Override
    public List<Comment> selectAll(String id) {
        List<Comment> comments=commentMapper.selectRoots(id);
        return eachComment(comments);
    }
    /**
     * 循环每个顶级的评论节点
     * @param comments
     * @return
     */
    private List<Comment> eachComment(List<Comment> comments) {
        List<Comment> commentsView = new ArrayList<>();
        for (Comment comment : comments) {
            Comment c = new Comment();
            BeanUtils.copyProperties(comment, c);
            c.setReplyComments(commentMapper.selectReplies(c.getCommentId()));
            commentsView.add(c);
        }
        //合并评论的各层子代到第一级子代集合中
        combineChildren(commentsView);
        return commentsView;
    }
    /**
     *
     * @param comments root根节点，blog不为空的对象集合
     * @return
     */
    private void combineChildren(List<Comment> comments) {

        for (Comment comment : comments) {
            List<Comment> replies = comment.getReplyComments();
            for(Comment reply : replies) {
                //循环迭代，找出子代，存放在tempReplies中
                recursively(reply);
            }
            //修改顶级节点的reply集合为迭代处理后的集合
            comment.setReplyComments(tempReplies);
            //清除临时存放区
            tempReplies = new ArrayList<>();
        }
    }
    //存放迭代找出的所有子代的集合
    private List<Comment> tempReplies = new ArrayList<>();
    /**
     * 递归迭代，剥洋葱
     * @param comment 被迭代的对象
     * @return
     */
    private void recursively(Comment comment) {
        tempReplies.add(comment);//顶节点添加到临时存放集合
        comment.setReplyComments(commentMapper.selectReplies(comment.getCommentId()));
        if (comment.getReplyComments().size()>0) {
            List<Comment> replies = comment.getReplyComments();
            for (Comment reply : replies) {
                tempReplies.add(reply);
                if (reply.getReplyComments().size()>0) {
                    recursively(reply);
                }
            }
        }
    }


}
