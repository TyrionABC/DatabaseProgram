package com.example.labbb;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.dao.*;
import com.domain.*;
import com.service.*;
import org.apache.ibatis.javassist.NotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@SpringBootTest
class LabbbApplicationTests {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserService userService;
    @Autowired
    private DirectionMapper directionMapper;
    @Autowired
    private DirectionService directionService;
    @Autowired
    private PaperMapper paperMapper;
    @Autowired
    private PaperService paperService;
    @Autowired
    private WriterService writerService;
    @Autowired
    private PublishMapper publishMapper;
    @Autowired
    private PublishService publishService;
    @Autowired
    private NoteAndFileService noteAndFileService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private WriterMapper writerMapper;
    @Autowired
    private BelongMapper belongMapper;
    @Autowired
    private BelongService belongService;
    @Autowired
    private NoteAndFileMapper noteAndFileMapper;
    @Test
    void contextLoads() {
        List<User> users=userMapper.selectList(null);
        System.out.println(users);
    }
    @Test
    void getUserById(){
        User user=userMapper.selectUserById("13663067562");
        System.out.println(user);
    }
    @Test
    void getUser(){
        User user=userService.selectUserByUserIdAndPassword("1216776075","m1216776075");
        System.out.println(user);
    }
    @Test
    void insertUser(){
        User user=new User();
        user.setUserId("123");
        user.setPermission(true);
        user.setPassword("123456");
        user.setName("1111111");
        userService.insertUser(user);
    }
    @Test
    void deleteUser(){
        userService.deleteUserByUserId("mb");
    }
    @Test
    void selectDirection(){
        Direction direction=directionService.selectDirectionByName("language");
        System.out.println(direction);
    }
    @Test
    void insertDirection(){
        Direction direction=new Direction();
        direction.setDirectionName("chinese");
        direction.setParentDirectionName("language");
        direction.setLevel(2);
        direction.setPath("language-chinese");
        directionService.insertDirection(direction);
    }
    @Test
    void updateDirection() throws NotFoundException {
        Direction direction=new Direction();
        String name="spring";
        direction.setDirectionName("spring");
        direction.setParentDirectionName("cs");
        direction.setLevel(2);
        direction.setPath("cs-spring");
        directionService.updateDirection(name,direction);
    }
    @Test
    void deleteDirection(){
        directionService.deleteDirectionByName("chinese");
    }
    @Test
    void selectAllDirections(){
        System.out.println(directionService.selectAll());
    }
    @Test
    void getPage(){
        //先找才有record
        QueryWrapper<Direction> queryWrapper=new QueryWrapper<>();
        queryWrapper.orderByDesc("direction_name");
        Map<String,Object> pageMap=directionService.selectPage(1,4,queryWrapper);
        System.out.println(pageMap);
    }
    @Test
    void getPaper(){
        System.out.println(paperMapper.selectPaperById("0"));
    }
    @Test
    void getPaperByTitle(){
        System.out.println(paperMapper.selectPaperByTitle("MyBatis简介"));
    }
    @Test
    void insertPaper(){
        Paper_Basic_info paper=new Paper_Basic_info();
        paper.setLiteratureLink("https://www.cnblogs.com");
        paper.setPublisherId("1216776075@qq.com");
        paper.setTitle("前后端概述");
        paper.setThesisType("综述型");
        paper.setText("前后端");
        paper.setFlag(0);
        paper.setLike(0);
        paperService.insertPaper(paper);
    }
    @Test
    void insertWriter(){
        Writer writer = new Writer();
        writer.setWriterName("tyrion");
        writer.setId("22");
        writer.setLevel(1);
        writerService.insert(writer);
    }
    @Test
    void selectPaperByWriter(){
        List<Paper_Basic_info> papers = writerService.selectPapers("tyrion");
        System.out.println(papers);
    }
    @Test
    void selectWriters(){
        System.out.println(writerService.selectWriters("22"));
    }
    @Test
    void selectPapersByPublishInfo(){
        Paper_publish publish=new Paper_publish();
        publish.setPublisher("tyrion");
        publish.setPublisherId("1216776075");
        publish.setPublishMeeting("三和会议");
        System.out.println(publishService.selectByPublishInfo(publish));
        //System.out.println(publishMapper.selectPaperByPublishInfo(publish.getPublisher(),publish.getPublisherId(),publish.getPublishMeeting(),publish.getPublishTime()));
    }
    @Test
    void insertPublish(){
        Paper_publish publish=new Paper_publish();
        publish.setId("6c85aac5-2");
        publish.setPublisher("tyrion");
        publish.setPublisherId("1216776075");
        publish.setPublishMeeting("上海会议");
        publishService.insert(publish);
    }
    @Test
    void insertNote(){
        Note_and_extra_file note_and_extra_file=new Note_and_extra_file();
        //note_and_extra_file.setExtraFile();
        //note_and_extra_file.setNote();
        note_and_extra_file.setId("2");
        note_and_extra_file.setPublisherId("1216776075");
        note_and_extra_file.setOverview("计算机的发展过程");
        noteAndFileService.insert(note_and_extra_file);
    }
    @Test
    void deleteNote(){
        noteAndFileService.delete("0");
    }
    @Test
    void update(){
        Note_and_extra_file note_and_extra_file=new Note_and_extra_file();
        //note_and_extra_file.setExtraFile();
        //note_and_extra_file.setNote();
        note_and_extra_file.setId("2");
        note_and_extra_file.setPublisherId("1216776075");
        note_and_extra_file.setOverview("计算机的种类");
        noteAndFileService.update(note_and_extra_file);
    }
    @Test
    void selectNote(){
        System.out.println(noteAndFileService.select("2"));
    }
    @Test
    void deleteComment(){
        commentService.delete("0932b08f-3");
    }
    @Test
    void insertComment(){
        Comment comment=new Comment();
        comment.setContent("原来如此");
        comment.setUserId("1216776075");
        comment.setId("0c28414e-2");
        comment.setDate(new Date());
        commentService.insert(comment);
    }
    @Test
    void selectMyPapers(){
        System.out.println(paperMapper.getNewPapers());
    }
    @Test
    void selectReply(){
        System.out.println(commentService.getReplies("23412250-a"));
    }
    @Test
    void updatePublish(){
        Paper_publish publish=new Paper_publish();
        publish.setId("6c85aac5-2");
        publish.setPublisher("tyrion");
        publish.setPublisherId("1216776075");
        publish.setPublishMeeting("上海会议");
        publish.setPublishTime(new Date());
        publishService.update(publish);
    }
    @Test
    void getRootComments(){
        System.out.println(commentMapper.selectRoots("0"));
    }
    @Test
    void getReplies(){
        System.out.println(commentMapper.selectReplies("2357e838-c"));
    }
    @Test
    void getMyNotes(){
        System.out.println(noteAndFileService.selectMyNotes("1216776075"));
    }
    @Test
    void getNewPapers(){
        System.out.println(paperService.selectNewPapers());
    }
    @Test
    void getWriters(){
        System.out.println(writerMapper.selectWritersById("6da6d0ed-c"));
    }
    @Test
    void getMyPaper(){
        System.out.println(paperService.getMyPapers("1216776075@qq.com"));
    }
    @Test
    void tt() throws NotFoundException {
        //System.out.println(paperService.getPaperOfMonth());
        //paperService.update(new Paper_Basic_info("0c28414e-2","spring and springboot","理论证明型",null,"1216776075@qq.com",1,"111"));
        //System.out.println(paperMapper.getNums());
        Direction direction = new Direction();
        direction.setDirectionName("222222");
        System.out.println(directionService.updateChildren("2",direction));

        //publishService.update(new Paper_publish("22","延吉会议",new Date(),"1216776075@qq.com","mbt"));
    }
    @Test
    void ttt(){
        Note_and_extra_file note_and_extra_file = new Note_and_extra_file();
//        note_and_extra_file.setNote("男儿当自强");
//        note_and_extra_file.setFlag(1);
//        note_and_extra_file.setPublisherId("1216776075@qq.com");
        note_and_extra_file.setId("05a783b3-9");
        noteAndFileService.delete(note_and_extra_file.getId());
    }



}
