package com.controller;

import com.dao.UserMapper;
import com.domain.Id;
import com.domain.User;
import com.service.UserService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Objects;

@Controller
@RequestMapping("/admin")
public class UserController {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserService userService;
    @CrossOrigin
    @GetMapping
    public String loginPage(){
        return "admin/login";
    }
    @CrossOrigin
    @GetMapping("/register")
    public String register(){
        return "admin/register";
    }
    //登录
    @CrossOrigin
    @PostMapping("/login")
    @ResponseBody
    public String Login(@RequestBody User user1,HttpSession session){
        User user=userService.selectUserByUserIdAndPassword(user1.getUserId(),user1.getPassword());
        if(user == null || !Objects.equals(user.getName(), user1.getName())) {
            return "0";
        }
        System.out.println(user);
        if (user.getFlag()==0&& user.getPermission()){
            user.setPassword(null);
            session.setAttribute("user", user);
            return "2";
        } else if(user.getFlag()==0&& !user.getPermission()){
            return "1";
        }
        return "0";
    }
    //注册，新增用户
    @CrossOrigin
    @PostMapping("/register")
    @ResponseBody
    public String Register(@RequestBody User user1,HttpSession session,RedirectAttributes attributes){
        if(userService.selectUserById(user1.getUserId())!=null){
            attributes.addFlashAttribute("message", "该userId已经存在");
            return "false";
            //重定向到控制器的某方法
        }
        else {
            System.out.println(session.getAttribute("user"));
            User user=new User();
            System.out.println(user1);
            user.setName(user1.getName());
            user.setUserId(user1.getUserId());
            user.setPassword(user1.getPassword());
            user.setPermission(false);
            user.setFlag(0);
            userService.insertUser(user);
            return "true";
        }
    }

    //登出
    @CrossOrigin
    @GetMapping("/logout")
    public String Logout(HttpSession session){
        session.removeAttribute("user");
        return "redirect:/users";
    }
    //用户更新信息
    @CrossOrigin
    @PostMapping("/updateUser")
    @ResponseBody
    public String updateInfo(@RequestBody User user1){
        System.out.println(user1);
        userService.updateUser(user1);
        return "true";
    }
    //获取用户信息
    @CrossOrigin
    @PostMapping("/getUserDetails")
    @ResponseBody
    public JSONObject getUserDetails(@RequestBody Id userId){
        JSONObject jsonObject=new JSONObject();
        User user=userService.selectUserById(userId.getUserId());
        jsonObject.put("direction",user.getDirection());
        jsonObject.put("gender",user.getGender());
        jsonObject.put("name",user.getName());
        jsonObject.put("password",user.getPassword());
        jsonObject.put("school",user.getSchool());
        return jsonObject;
    }
    //获取所有用户(非管理员)信息
    @CrossOrigin
    @GetMapping("/getAllUsers")
    @ResponseBody
    public JSONArray getAllUsers(){
        JSONArray array=new JSONArray();
        List<User> users=userService.getAll();
        for(User user:users){
            if(user.getPermission())
                continue;
            JSONObject jsonObject=new JSONObject();
            jsonObject.put("userId",user.getUserId());
            jsonObject.put("direction",user.getDirection());
            jsonObject.put("gender",user.getGender());
            jsonObject.put("name",user.getName());
            jsonObject.put("password",user.getPassword());
            jsonObject.put("school",user.getSchool());
            jsonObject.put("flag",user.getFlag());
            array.add(jsonObject);
        }
        return array;
    }
    //根据邮箱和用户名查找用户信息
    @CrossOrigin
    @PostMapping("/getUsers")
    @ResponseBody
    public JSONArray getUser(@RequestBody User user){
        JSONArray jsonArray=new JSONArray();
        List<User> users=userService.getUsers(user);
        for(User user1:users){
            JSONObject jsonObject=new JSONObject();
            jsonObject.put("userId",user1.getUserId());
            jsonObject.put("direction",user1.getDirection());
            jsonObject.put("gender",user1.getGender());
            jsonObject.put("name",user1.getName());
            jsonObject.put("password",user1.getPassword());
            jsonObject.put("school",user1.getSchool());
            jsonArray.add(jsonObject);
        }
        return jsonArray;
    }
    //逻辑删除某用户
    @CrossOrigin
    @PostMapping("deleteUser")
    @ResponseBody
    public String deleteUser(@RequestBody Id userId){
        userService.deleteUserByUserId(userId.getUserId());
        return "true";
    }
    @CrossOrigin
    @PostMapping("recoverUser")
    @ResponseBody
    public String recoverUser(@RequestBody Id userId){
        userMapper.updateUserFlag(userId.getUserId());
        return "true";
    }
    //修改用户超级权限,使其权限改变，调用一次则变为与原来相反的权限
    @CrossOrigin
    @PostMapping("updateAccess")
    @ResponseBody
    public String improveUser(@RequestBody Id userId){
        userService.updateAccess(userId.getUserId());
        return "true";
    }
    //管理员登录
    @CrossOrigin
    @PostMapping("/adminLogin")
    @ResponseBody
    public String adminLogin(@RequestBody User user1,HttpSession session){
        User user=userService.selectUserByUserIdAndPassword(user1.getUserId(),user1.getPassword());
        System.out.println(user);
        if (user != null&&user.getPermission()){
            user.setPassword(null);
            session.setAttribute("user", user);
            return "true";
        } else{
            return "false";
        }
    }
    //查询权限
    @CrossOrigin
    @GetMapping("/getPermission/{userId}")
    @ResponseBody
    public String getPermission(@PathVariable String userId){
        User user=userService.selectUserById(userId);
        if (user==null)
            return "false";
        else{
            if (user.getPermission())
                return 1+"";
            else
                return 0+"";
        }
    }
}
