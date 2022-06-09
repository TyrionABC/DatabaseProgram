package com.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@TableName("comment")
public class Comment {
    @TableId
    @TableField("comment_id")
    private String commentId;
    @TableField("parent_comment_id")
    private String parentCommentId;

    private Date date;
    @TableField("user_id")
    private String userId;

    private String id;

    private String content;
    @TableField("root")
    private String root;
    @TableField(exist = false)
    private List<Comment> replyComments = new ArrayList<>();

    public List<Comment> getReplyComments() {
        return replyComments;
    }

    public void setReplyComments(List<Comment> replyComments) {
        this.replyComments = replyComments;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "commentId='" + commentId + '\'' +
                ", parentCommentId='" + parentCommentId + '\'' +
                ", date=" + date +
                ", userId='" + userId + '\'' +
                ", id='" + id + '\'' +
                ", content='" + content + '\'' +
                ", root='" + root + '\'' +
                ", replyComments=" + replyComments +
                '}';
    }

    public String getRoot() {
        return root;
    }

    public void setRoot(String root) {
        this.root = root;
    }

    public String getCommentId() {
        return commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public String getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(String parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}