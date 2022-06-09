package com.service;

import com.domain.Comment;

import java.util.List;

public interface CommentService {
    void insert(Comment comment);
    void delete(String commentId);
    void update(Comment comment);
    List<Comment> selectAll(String id);
    List<Comment> getRoots(String id);
    List<Comment> getReplies(String commentId);
    Comment selectComment(String commentId);
}
