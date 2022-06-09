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

import java.text.SimpleDateFormat;
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
    //comment加root字段
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
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  // 设置日期格式
        String strTime = simpleDateFormat.format(comment1.getDate());
        jsonObject.put("date",strTime);
        if (comment1.getParentCommentId()==null)
            jsonObject.put("parentCommentId","");
        else
            jsonObject.put("parentCommentId",comment1.getParentCommentId());
        jsonObject.put("userName",userMapper.selectUserById(comment1.getUserId()).getName());
        jsonObject.put("publisherId",comment1.getUserId());
        jsonObject.put("root",comment1.getRoot());
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
    //更改评论,commentId,content,userId,id//
    @CrossOrigin
    @ResponseBody
    @PostMapping("/updateComment")
    public String updateComment(@RequestBody Comment comment){
        commentService.update(comment);
        return "true";
    }
    //添加评论,需要parentId,content,userId,id,root//
    @CrossOrigin
    @ResponseBody
    @PostMapping("/insertComment")
    public String insert(@RequestBody Comment comment){
        commentService.insert(comment);
        return "true";
    }
    //查询单条评论内容//
    @CrossOrigin
    @ResponseBody
    @GetMapping("/insertComment/{id}")
    public String selectOne(@PathVariable String id){
        return commentService.selectComment(id).getContent();
    }

}
