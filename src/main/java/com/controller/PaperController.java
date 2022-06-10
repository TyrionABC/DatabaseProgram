package com.controller;

import com.dao.PaperMapper;
import com.domain.*;
import com.service.*;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// data: ['前端', '后端', 'Android', 'IOS', '软件测试', '人工智能', '机器学习', '深度学习', '数据库', '网络安全']

@Controller
@RequestMapping("/admin")
public class PaperController {
    //根据用户id查找所有论文，笔记，
    // 点赞数（论文），
    //修改用户信息
    //近期文章（20）
    //用户单位，研究方向,邮箱是id
    //⽀持按照研究⽅向、论⽂标题、论⽂类型、论⽂摘要模糊查询、作者、发布⼈、
    //会议等条件筛选或查询，以及组合查询。具体实现度⾃⾏决定。
    //列表查询结果⽀持分页、排序
    @Autowired
    private PaperService paperService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private DirectionService directionService;
    @Autowired
    private NoteAndFileService noteAndFileService;
    @Autowired
    private PublishService publishService;
    @Autowired
    private UserService userService;
    @Autowired
    private WriterService writerService;
    @Autowired
    private PaperMapper paperMapper;
    @Autowired
    private BelongService belongService;
    @Autowired
    private ReferenceService referenceService;
    //获取用户笔记
    @CrossOrigin
    @PostMapping("/myNotes/true")
    @ResponseBody
    public JSONArray myNotes(@RequestBody Id userId){
        System.out.println(userId.getUserId());
        List<Note_and_extra_file> allNotes=noteAndFileService.selectMyNotes(userId.getUserId());//所有数据
        JSONArray json = new JSONArray();
        for(Note_and_extra_file note : allNotes){
            if (note.getFlag()==1)
                continue;
            JSONObject jo = new JSONObject();
            jo.put("note", note.getNote());
            jo.put("title",paperMapper.selectPaperById(note.getId()).getTitle());
            jo.put("id",note.getId());
            json.add(jo);
        }
        System.out.println(json);
        return json;
    }
    //获取用户笔记草稿
    @CrossOrigin
    @PostMapping("/myNotes/false")
    @ResponseBody
    public JSONArray myNoteDraft(@RequestBody Id userId){
        System.out.println(userId.getUserId());
        List<Note_and_extra_file> allNotes=noteAndFileService.selectMyNotes(userId.getUserId());//所有数据
        JSONArray json = new JSONArray();
        for(Note_and_extra_file note : allNotes){
            if (note.getFlag()==0)
                continue;
            JSONObject jo = new JSONObject();
            jo.put("note", note.getNote());
            jo.put("title",paperMapper.selectPaperById(note.getId()).getTitle());
            jo.put("id",note.getId());
            json.add(jo);
        }
        System.out.println(json);
        return json;
    }

    //获取用户最近发布的20篇论文,有问题,且时间精确到天即可
    @CrossOrigin
    @GetMapping("/paper")
    @ResponseBody
    public JSONArray paper(){
        List<Paper> allPapers=paperService.selectNewPapers();//所有数据
        System.out.println(allPapers.size());
        JSONArray json = new JSONArray();
        // 需要添加作者、发布人姓名、研究方向、发布会议
        for(Paper paper : allPapers){
            if (paper.getFlag()==1)
                continue;
            JSONObject jo = new JSONObject();
            jo.put("writers",paper.getWriters());
            putIn(paper, jo);
            json.add(jo);
        }
        System.out.println(json.size());
        return json;
    }
    //获取用户发布的论文
    @CrossOrigin
    @PostMapping("/myPaper/true")
    @ResponseBody
    public JSONArray myPaper(@RequestBody Id userId){
        System.out.println(userId.getUserId());
        List<Paper> allPapers=paperService.selectMyPapers(userId.getUserId());//所有数据
        System.out.println(userId);
        JSONArray json = new JSONArray();
        for(Paper paper : allPapers){
            if(paper.getFlag()==1)
                continue;
            JSONObject jo = new JSONObject();
            putIn(paper, jo);
            json.add(jo);
        }
        System.out.println(json);
        return json;
    }
    //获取用户草稿
    @CrossOrigin
    @PostMapping("/myPaper/false")
    @ResponseBody
    public JSONArray myDraft(@RequestBody Id userId){
        //System.out.println(userId.getUserId());
        List<Paper> allPapers=paperService.selectMyPapers(userId.getUserId());//所有数据
        //System.out.println(userId);
        JSONArray json = new JSONArray();
        for(Paper paper : allPapers){
            if (paper.getFlag()==0)
                continue;
            JSONObject jo = new JSONObject();
            putIn(paper, jo);
            jo.put("flag",paper.getFlag());
            json.add(jo);
        }
        System.out.println(json);
        return json;
    }

    private void putIn(Paper paper, JSONObject jo) {
        jo.put("id", paper.getId());
        //jo.put("literatureLink", paper.getLiteratureLink());
        jo.put("publisherId",paper.getPublisherId());
        jo.put("thesisDate",paper.getThesisDate());
        jo.put("thesisType",paper.getThesisType());
        jo.put("title",paper.getTitle());
        jo.put("like",paper.getLike());
        jo.put("writers",paper.getWriters());
        jo.put("publisher",paper.getPublisher());
        jo.put("path",paper.getPaths());
        jo.put("publishMeeting",paper.getPublishMeeting());
    }

    //查找论文，⽀持按照研究⽅向、论⽂标题、论⽂类型、论⽂摘要模糊查询、作者、发布⼈、会议等条件筛选或查询，以及组合查询
    //列表查询结果⽀持分页、排序
    @CrossOrigin
    @PostMapping("/select")
    @ResponseBody
    public JSONArray select(@RequestBody Query query){
        System.out.println(query.getTitle());
        if ("".equals(query.getDirectionName()))
            query.setDirectionName(null);
        if ("".equals(query.getName()))
            query.setName(null);
        if ("".equals(query.getOverview()))
            query.setOverview(null);
        if ("".equals(query.getPublishMeeting()))
            query.setPublishMeeting(null);
        if ("".equals(query.getThesisType()))
            query.setThesisType(null);
        if ("".equals(query.getTitle()))
            query.setTitle(null);
        if ("".equals(query.getUserName()))
            query.setUserName(null);
        List<Paper> papers=paperService.selectPapersByConditions(query);
        //System.out.println(papers);
        JSONArray json = new JSONArray();
        for(Paper paper : papers){
            if(paper.getFlag()==1)
                continue;
            JSONObject jo = new JSONObject();
            jo.put("id", paper.getId());
            jo.put("literatureLink", paper.getLiteratureLink());
            jo.put("overview",paper.getOverview());
            jo.put("path",paper.getPaths());
            jo.put("publisher",paper.getPublisher());
            jo.put("publisherId",paper.getPublisherId());
            jo.put("publishMeeting",paper.getPublishMeeting());
            jo.put("thesisDate",paper.getThesisDate());
            jo.put("thesisType",paper.getThesisType());
            jo.put("title",paper.getTitle());
            //此处改成数组
            jo.put("writers",paper.getWriters());
            jo.put("like",paper.getLike());
            json.add(jo);
        }
        System.out.println(json);
        return json;
    }
    //删除论文
    @CrossOrigin
    @PostMapping("/deletePaper")
    @ResponseBody
    public String paper(@RequestBody Paper paper){
        System.out.println(paper);
        boolean flag=paperService.deletePaperById(paper.getId());
        if(flag){
            return "true";
        }
        else{
            return "false";
        }
    }
    @CrossOrigin
    @PostMapping("/update")
    @ResponseBody
    public String update(@RequestBody Paper_Basic_info paper){
        return ""+paperService.updatePaper(paper);
    }

    //点赞
    @CrossOrigin
    @GetMapping("/like/{paperId}")
    @ResponseBody
    public String like(@PathVariable String paperId){
        return paperService.likePaper(paperId).toString();
    }
    // data: ['前端', '后端', 'Android', 'IOS', '软件测试', '人工智能', '机器学习', '深度学习', '数据库', '网络安全']
    //获取每个方向的我的论文的数目和点赞数
    @CrossOrigin
    @PostMapping("/LikeAndDirection")
    @ResponseBody
    public JSONArray getLikesAndDirection(@RequestBody Id userId){
        List<MyPaper> myPapers=paperMapper.selectMyPaper(userId.getUserId());
        JSONArray jsonArray=new JSONArray();
        for (MyPaper myPaper:myPapers){
            JSONObject jsonObject=new JSONObject();
            jsonObject.put("direction",myPaper.getDirection());
            jsonObject.put("likes",myPaper.getLikes());
            jsonObject.put("num",myPaper.getNum());
            jsonArray.add(jsonObject);
        }
        return jsonArray;
    }
    //全站从当月往前十二个月以来，每个月发表的论文数目
    @CrossOrigin
    @PostMapping("/MonthAndPaper")
    @ResponseBody
    public JSONArray getPapersOfMonth(){
        List<Integer> nums=paperService.getPaperOfMonth();
        JSONArray jsonArray=new JSONArray();
        int flag=0;
        for (Integer num:nums){
            jsonArray.add(num);
            flag++;
            if (flag>11)
                break;
        }
        return jsonArray;
    }
    //用户从当天往前推一星期每天发表的论文数目
    @CrossOrigin
    @PostMapping("/DayAndPaper")
    @ResponseBody
    public JSONArray getPapersOfDay(@RequestBody Id userId){
        System.out.println(userId);
        List<Integer> nums=paperService.getPaperOfDay(userId.getUserId());
        JSONArray jsonArray=new JSONArray();
        int flag=0;
        for (Integer num:nums){
            jsonArray.add(num);
            flag++;
            if (flag>6)
                break;
        }
        return jsonArray;
    }
    //获取文章内容
    @CrossOrigin
    @GetMapping("getText/{paperId}")
    @ResponseBody
    public JSONObject getText(@PathVariable String paperId){
        JSONObject jsonObject=new JSONObject();
        Paper_Basic_info paper=paperService.selectPaperById(paperId);
        System.out.println(paper);
        List<Direction> directions=directionService.getPaperDirection(paperId);
        int i=0;
        for (Direction direction:directions){
            jsonObject.put("direction"+i++,direction.getPath());
        }
        jsonObject.put("id",paper.getId());
        jsonObject.put("title",paper.getTitle());
        jsonObject.put("thesisType",paper.getThesisType());
        jsonObject.put("thesisDate",paper.getThesisDate().toString());
        jsonObject.put("literatureLink",paper.getLiteratureLink());
        jsonObject.put("publisherId",paper.getPublisherId());
        jsonObject.put("likes",paper.getLike());
        jsonObject.put("text",paper.getText());
        return jsonObject;
    }
//    //通过id，获取论文全部信息
    @CrossOrigin
    @GetMapping("getAllInfo/{paperId}")
    @ResponseBody
    public JSONObject getAllInfo(@PathVariable String paperId){
        JSONObject jsonObject=new JSONObject();
        Paper_Basic_info paper=paperService.selectPaperById(paperId);
        Paper_publish publish=publishService.selectByPaperId(paperId);
        List<Direction> directions=directionService.getPaperDirection(paperId);
        String[] str=new String[directions.size()];
        int i=0;
        for (Direction direction:directions){
            str[i++]=direction.getDirectionName();
        }

        jsonObject.put("directions",str);
        jsonObject.put("title",paper.getTitle());
        jsonObject.put("thesisType",paper.getThesisType());
        jsonObject.put("literatureLink",paper.getLiteratureLink());
        jsonObject.put("publisherId",paper.getPublisherId());
        jsonObject.put("text",paper.getText());
        jsonObject.put("publishMeeting",publish.getPublishMeeting());
        jsonObject.put("publishTime",publish.getPublishTime().toString());
        List<Reference> references=referenceService.getAllById(paperId);
        JSONArray jsonArray=new JSONArray();
        for (Reference reference:references){
            JSONObject jsonObject1=new JSONObject();
            jsonObject1.put("referenceId",reference.getReferPaperId());
            jsonObject1.put("title",paperService.selectPaperById(reference.getId()).getTitle());
            jsonArray.add(jsonObject1);
        }
        jsonObject.put("refers",jsonArray);
        List<Writer> writers=writerService.selectWriters(paperId);
        str=new String[writers.size()];
        i=0;
        for (Writer writer:writers){
            str[i++]=writer.getWriterName();
        }
        jsonObject.put("writers",str);
        ////
        jsonObject.put("overview",noteAndFileService.select(paperId).getOverview());
        ////
        return jsonObject;
    }
    //插入论文,传入子方向，基本信息，发布信息，索引，作者信息
    @CrossOrigin
    @PostMapping("/insertPaper")
    @ResponseBody
    public String putin(@RequestBody AllInfo allInfo){
        //储存基本信息
        String id=paperService.insertPaper(new Paper_Basic_info(allInfo.getTitle(),allInfo.getThesisType(),
                allInfo.getLiteratureLink(),allInfo.getPublisherId(),allInfo.getFlag(),allInfo.getText()));
        System.out.println(id);
        System.out.println(allInfo);
        //存储方向信息
        for (String direction:allInfo.getDirections()){
            belongService.insertBelong(new Belong(direction,id));
        }
        //存储发布信息
        publishService.insert(new Paper_publish(id,allInfo.getPublishMeeting(),
                allInfo.getPublishTime(),allInfo.getPublisherId(),allInfo.getPublisher()));
        //储存索引信息
        if (allInfo.getReferIds().size()!=0){
            for (String referId:allInfo.getReferIds()){
                referenceService.insertReference(new Reference(id,referId));
            }
        }
        //存储作者信息
        int i=1;
        for (String writer:allInfo.getWriters()){
            System.out.println(writer);
            writerService.insert(new Writer(id,writer,i++));
        }
        //插入笔记
        if (allInfo.getOverview()!=null){
            Note_and_extra_file note_and_extra_file = new Note_and_extra_file();
            note_and_extra_file.setOverview(allInfo.getOverview());
            note_and_extra_file.setPublisherId(allInfo.getPublisherId());
            note_and_extra_file.setFlag(1);
            noteAndFileService.insert(note_and_extra_file);
        }
        return "true";
    }
    //修改论文,传入id,传入子方向，基本信息，发布信息，索引，作者信息
    @CrossOrigin
    @PostMapping("/updatePaper/{id}")
    @ResponseBody
    public String update(@RequestBody AllInfo allInfo){
        //修改基本信息
        String id=allInfo.getId();
        paperService.update(new Paper_Basic_info(id,allInfo.getTitle(),allInfo.getThesisType(),
                allInfo.getLiteratureLink(),allInfo.getPublisherId(),allInfo.getFlag(),allInfo.getText()));
        System.out.println(allInfo+" "+id);
        //修改方向信息
        belongService.update(id,allInfo.getDirections());
        //修改发布信息
        publishService.update(new Paper_publish(id,allInfo.getPublishMeeting(),
                allInfo.getPublishTime(),allInfo.getPublisherId(),allInfo.getPublisher()));
        //修改索引信息
        referenceService.update(id,allInfo.getReferIds());
        //修改摘要
        Note_and_extra_file note_and_extra_file = new Note_and_extra_file();
        note_and_extra_file.setOverview(allInfo.getOverview());
        note_and_extra_file.setPublisherId(allInfo.getPublisherId());
        noteAndFileService.update(note_and_extra_file);
        ///////
        return "true";
    }
    //删除笔记
    @CrossOrigin
    @PostMapping("/deleteNotes")
    @ResponseBody
    public String deleteNotes(@RequestBody Note_and_extra_file note){
        noteAndFileService.delete(note.getId());
        return "true";
    }
    //写笔记
    @CrossOrigin
    @PostMapping("/insertNotes")
    @ResponseBody
    public String insertNotes(@RequestBody Note_and_extra_file note){
        noteAndFileService.insert(note);
        return "true";
    }
    //改笔记
    @CrossOrigin
    @PostMapping("/updateNotes")
    @ResponseBody
    public String updateNotes(@RequestBody Note_and_extra_file note){
        noteAndFileService.update(note);
        return "true";
    }


}
