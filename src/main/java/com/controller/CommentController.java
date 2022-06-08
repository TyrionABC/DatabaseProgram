package com.controller;

import com.dao.CommentMapper;
import com.dao.UserMapper;
import com.domain.Comment;
import com.service.CommentService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class CommentController {
    @Autowired
    private CommentService commentService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private CommentMapper commentMapper;
    //获取该文章所有评论,根评论的父亲评论也要传
    @CrossOrigin
    @ResponseBody
    @GetMapping("/selectAllComments/{paperId}")
    public JSONArray getAll(@PathVariable String paperId){
        JSONArray jsonArray=new JSONArray();
        List<Comment> comments=commentService.selectAll(paperId);
        for(Comment comment1:comments){
            if (comment1.getParentCommentId()!=null){
                continue;
            }
            putInComment(jsonArray, comment1);
            if (comment1.getParentCommentId()==null){
                for (Comment comment:comment1.getReplyComments()){
                    putInComment(jsonArray, comment);
                }
            }
        }
        return jsonArray;
    }

    private void putInComment(JSONArray jsonArray, Comment comment1) {
        JSONObject jsonObject=new JSONObject();
        jsonObject.put("commentId",comment1.getCommentId());
        jsonObject.put("content",comment1.getContent());
        jsonObject.put("date",comment1.getDate().toString());
        if (comment1.getParentCommentId()==null)
            jsonObject.put("parentCommentId","");
        else
            jsonObject.put("parentCommentId",comment1.getParentCommentId());
        jsonObject.put("userName",userMapper.selectUserById(comment1.getUserId()).getName());
        if (comment1.getParentCommentId()==null)
            jsonObject.put("parentUserName","");
        else
            jsonObject.put("parentUserName",userMapper.selectUserById(commentMapper.selectComment(comment1.getParentCommentId()).getUserId()).getName());
        jsonArray.add(jsonObject);
    }

    //删除评论
    @CrossOrigin
    @ResponseBody
    @PostMapping("/deleteComment")
    public String deleteComment(@RequestBody Comment comment){
        commentService.delete(comment.getCommentId());
        return "true";
    }
    //更改评论
    @CrossOrigin
    @ResponseBody
    @PostMapping("/updateComment")
    public String updateComment(@RequestBody Comment comment){
        commentService.update(comment);
        return "true";
    }
    //添加评论
    @CrossOrigin
    @ResponseBody
    @PostMapping("/insertComment")
    public String insert(@RequestBody Comment comment){
        //System.out.println(comment);
        commentService.insert(comment);
        return "true";
    }

}
