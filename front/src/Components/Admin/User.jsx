import React from "react";
import {
    Input,
    Divider,
    Table,
    Space,
    Button,
    Modal,
} from 'antd';
import axios from "axios";
import { GetContentData } from "../Data/DataChart"

const { Search } = Input;
export class UserGovern extends React.Component{
    state = {
        user:[],
        showuser:[],
        id:'',
    }

    constructor(props) {
        super(props);
        this.state = { user:[], show_user:[], id: props.id }
    }

    componentDidMount() {
        let that = this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getAllUsers',
        }).then(function(res) {
            let legal_user=[];
            for(let i=0;i<res.data.length;i++){
                if(res.data[i].flag===0){
                    legal_user.push(res.data[i]);
                }
            }
            that.setState({
                user: res.data,
                showuser:legal_user,
            })
        });
    }
    onSearch=(value)=>{
        let mid=[];
        if(value===''){
            for(let i=0;i<this.state.user.length;i++){
                if(this.state.user[i].flag===0){
                    mid.push(this.state.user[i]);
                }
            }
        }else{
            for(let i=0;i<this.state.user.length;i++){
                if((this.state.user[i].name===value||this.state.user[i].userId===value)&&this.state.user[i].flag===0){
                    mid.push(this.state.user[i]);
                }
            }
        }
        this.setState({
            showuser:mid,
        })
    }
    changeUserPermission =(email) =>{
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/updateAccess',
            data: { userId: email },
        }).then(function(res) {
            console.log(res.data);
        });
        let newuser=[];
        for(let i=0;i<this.state.user.length;i++){
            newuser.push(this.state.user[i]);
            if(newuser[i].userId===email){
                newuser[i].flag=1;
            }
        }
        let mid=[];
        for(let i=0;i<this.state.showuser.length;i++){
            if(this.state.showuser[i].userId!==email){
                mid.push(this.state.showuser[i]);
            }
        }
        this.setState({
            user:newuser,
            showuser:mid,
        })
    }
    lock=(email)=>{
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/deleteUser',
            data: { userId: email },
        }).then(function(res) {
            console.log(res.data);
        });
        let newuser=[];
        for(let i=0;i<this.state.user.length;i++){
            newuser.push(this.state.user[i]);
            if(newuser[i].userId===email){
                newuser[i].flag=1;
            }
        }
        let mid=[];
        for(let i=0;i<this.state.showuser.length;i++){
            if(this.state.showuser[i].userId!==email){
                mid.push(this.state.showuser[i]);
            }
        }
        this.setState({
            user:newuser,
            showuser:mid,
        })
    }
    render(){
        const dataInfo = (userId) => {
            Modal.info({
                title: userId+"的统计数据",
                width: 1000,
                content: (
                    <GetContentData id={userId}/>
                )
            })
        }
        const columns=[
            {
                title: '邮箱',
                dataIndex: 'userId',
                key: 'userId',
                render: (text)=><Button type="text" style={{color:'#3366FF'}}>{text}</Button>,
            },
            {
                title: '用户名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '单位/学校',
                dataIndex: 'school',
                key: 'school',
            },
            {
                title: '操作',
                key: 'action',
                render: (_, record)=>(
                    <Space size="middle">
                        <Button type="text" style={{color:"green"}} onClick={()=>this.changeUserPermission(record.userId)}>修改用户权限</Button>
                        <Button type="text" style={{color:"red"}} onClick={()=>this.lock(record.userId)}>封禁用户</Button>
                        <Button type="text" style={{color: "blue"}} onClick={()=>dataInfo(record.userId)}>查看数据</Button>
                    </Space>
                )
            }
        ];
        return(
        <>
            <div style={{marginTop:20,textAlign:"center"}}>
            <Search placeholder="搜索用户" style={{width:600}} allowClear enterButton onSearch={this.onSearch}/>
            </div>
            <Divider>用户信息</Divider>
            <div>
            <Table columns={columns} dataSource={this.state.showuser} />;
            </div>
        </>
        )
    }
}

export class IllegalUser extends React.Component{
    state = {
        user:[],
        showuser:[],
        id:'',
    }

    constructor(props) {
        super(props);
        this.state = { user:[], show_user:[], id: props.id }
    }

    componentDidMount() {
        let that = this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getAllUsers',
        }).then(function(res) {
            let illegal_user=[];
            for(let i=0;i<res.data.length;i++){
                if(res.data[i].flag===1){
                    illegal_user.push(res.data[i]);
                }
            }
            that.setState({
                user: res.data,
                showuser:illegal_user,
            })
        });
    }
    onSearch=(value)=>{
        let mid=[];
        if(value===''){
            for(let i=0;i<this.state.user.length;i++){
                if(this.state.user[i].flag===1){
                    mid.push(this.state.user[i]);
                }
            }
        }else{
            for(let i=0;i<this.state.user.length;i++){
                if((this.state.user[i].name===value||this.state.user[i].userId===value)&&this.state.user[i].flag===1){
                    mid.push(this.state.user[i]);
                }
            }
        }
        this.setState({
            showuser:mid,
        })
    }
    unlock=(email)=>{
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/recoverUser',
            data: { userId: email },
        }).then(function(res) {
            console.log(res.data);
        });
        let newuser=[];
        for(let i=0;i<this.state.user.length;i++){
            newuser.push(this.state.user[i]);
            if(newuser[i].userId===email){
                newuser[i].flag=0;
            }
        }
        let mid=[];
        for(let i=0;i<this.state.showuser.length;i++){
            if(this.state.showuser[i].userId!==email){
                mid.push(this.state.showuser[i]);
            }
        }
        this.setState({
            user:newuser,
            showuser:mid,
        })
    }
    render(){
        const columns=[
            {
                title: '邮箱',
                dataIndex: 'userId',
                key: 'userId',
                render: (text)=><Button type="text" style={{color:'#3366FF'}}>{text}</Button>,
            },
            {
                title: '用户名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '单位/学校',
                dataIndex: 'school',
                key: 'school',
            },
            {
                title: '操作',
                key: 'action',
                render: (_, record)=>(
                    <Space size="middle">
                        <Button type="text" style={{color:"red"}} onClick={()=>this.unlock(record.userId)}>解除封禁</Button>
                    </Space>
                )
            }
        ];
        return(
        <>
            <div style={{marginTop:20,textAlign:"center"}}>
            <Search placeholder="搜索用户" style={{width:600}} allowClear enterButton onSearch={this.onSearch}/>
            </div>
            <Divider>用户信息</Divider>
            <div>
            <Table columns={columns} dataSource={this.state.showuser} />;
            </div>
        </>
        )
    }
}