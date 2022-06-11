package com.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.domain.Direction;
import com.service.DirectionService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class DirectionController {
    @Autowired
    private DirectionService directionService;
    //查看所有方向,children中存入父方向
    @CrossOrigin
    @GetMapping("/getAllDirections")
    @ResponseBody
    public JSONArray getAll() {
        List<Direction> parents=directionService.getAllParents();
        JSONArray jsonArray=new JSONArray();
        for(Direction parent:parents){
            JSONObject jsonObject=new JSONObject();
            jsonObject.put("label",parent.getDirectionName());
            jsonObject.put("value",parent.getDirectionName());
            JSONArray children=new JSONArray();
            children.add(jsonObject);
            for (Direction direction:directionService.getDirectionsByParent(parent.getDirectionName())){
                if (direction.getLevel()==1)
                    continue;
                JSONObject jsonObject1=new JSONObject();
                jsonObject1.put("label",direction.getDirectionName());
                jsonObject1.put("value",direction.getDirectionName());
                children.add(jsonObject1);
            }
            jsonObject.put("children",children);
            jsonArray.add(jsonObject);
        }
        return jsonArray;
    }
    //查找某方向,需要传入方向名称
    @CrossOrigin
    @GetMapping("/getDirection/{directionName}")
    @ResponseBody
    public JSONObject editInput(@PathVariable String directionName) {
        JSONObject jsonObject=new JSONObject();
        Direction direction = directionService.selectDirectionByName(directionName);
        jsonObject.put("directionName",direction.getDirectionName());
        jsonObject.put("parentDirectionName",direction.getParentDirectionName());
        jsonObject.put("level",direction.getLevel());
        jsonObject.put("path",direction.getPath());
        return jsonObject;
    }
    //删除某方向,输入directionName，该方向存在则删除，将其所有子方向改为一级方向并返回true；不存在则返回false
    @CrossOrigin
    @PostMapping("/deleteDirection")
    @ResponseBody
    public String deleteDirection(@RequestBody Direction direction) {
        System.out.println(direction);
        directionService.deleteDirectionByName(direction.getDirectionName());
        return "true";
    }
    //新增方向,要在前端校验是否为空,传入方向名directionName和父方向parentDirectionName
    //方向已存在返回false，成功插入则返回true
    //输入directionName,parentDirectionName
    @CrossOrigin
    @PostMapping("/insertDirection")
    @ResponseBody
    public String insert(@RequestBody Direction direction) {
        boolean flag=directionService.insertDirection(direction);
        if (flag)
            return "true";
        else
            return "false";
    }
    //更新方向,要传入方向名和父方向和原方向名
    //输入directionName,parentDirectionName，都不能为空
    @CrossOrigin
    @PostMapping("/updateDirection/{directionName}")
    @ResponseBody
    public String editPost(@PathVariable String directionName,@RequestBody Direction direction) throws NotFoundException {
        Direction direction1=directionService.selectDirectionByName(directionName);
        if (direction1==null){//要更改的对象不存在
            return "false";
        }
        if (direction1.getDirectionName().equals(direction1.getParentDirectionName())&&direction1.getLevel()==1)
            return ""+directionService.updateParent(directionName,direction);//修改父方向且要修改的方向确实是父方向
        else if (!direction1.getDirectionName().equals(direction1.getParentDirectionName())&&direction1.getLevel()==2)
            return ""+directionService.updateChildren(directionName,direction);//修改子方向且要修改的方向确实为子方向
        else
            return "false";
    }

}
