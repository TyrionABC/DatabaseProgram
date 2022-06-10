import React, {useState} from 'react'
import axios from "axios";
import {Col, Row, Comment, Avatar, Button, Modal, message} from 'antd'
import {useParams} from "react-router-dom";
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { CommentOutlined } from '@ant-design/icons';
import {useLocation} from "react-router";
import TextArea from 'antd/lib/input/TextArea';

export default function SeeThesis() {
    let { state } = useLocation();
    console.log(state.userid);
    const params = useParams();
    console.log(params);
    return <Detail id={params.id} userId={state.userid}/>
}

class Detail extends React.Component{
    state={
        text:'',
        title:'',
    }
    componentDidMount () {
        // 假设此处从服务端获取html格式的编辑器内容
        let that=this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getText/'+that.props.id,
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                text:res.data.text,
                title:res.data.title,
                //parentComment:res.data.parentComment,
            })
        });
    }
    render(){
        return(
            <>
                <Row>
                    <Col span={16}>
                        <div style={{textAlign:'center'}}>
                            <h1>{this.state.title}</h1>
                        </div>
                        <div dangerouslySetInnerHTML={{__html:this.state.text}} style={{marginLeft:100,marginRight:100}} />
                    </Col>
                    <Col span={8}>
                        <div style={{border:'dashed'}}>
                            <UserComment id={this.props.id} userId={this.props.userId}/>
                        </div>
                    </Col>
                </Row>
                <Divider > 论文笔记 </Divider>
                <Row>
                    <div>
                        <UserNote id={this.props.id} userId={this.props.userId} />
                    </div>
                </Row>
            </>
        )
    }
}

class UserComment extends React.Component{
    state={
        comment:[],
        isSee:false,
        content:'',
        oldContent:'',
        parentCommentId:'',
        rootId:'',
        updateCommentId:'',
        isVis:false
    }
    componentDidMount () {
        let that=this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/selectAllComments/'+that.props.id,
        }).then(function(res) {
            let mid=res.data;
            mid.sort((a,b)=>a.date>b.date?1:-1);
            that.setState({
                comment:mid,
            })
        });
    }
    handleEditorChange = (event) => {
        this.setState({content:event.target.value});
    }
    handleEditorupdate = (event) =>{
        this.setState({oldContent:event.target.value});
    }
    addComment=()=>{
        this.setState({
            parentCommentId:'',
            isSee:true,
            rootId:'',
        })
    }
    addReply=(parentCommentId,root)=>{
        console.log(parentCommentId);
        this.setState({
            parentCommentId:parentCommentId,
            isSee:true,
            rootId:root
        })
    }
    deleteComment=(commentId)=>{
        const newComment={
            commentId:commentId,
        }
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/deleteComment/',
            data:newComment
        }).then(function(res) {
            console.log(res.data);
            if(res.data){
                message.success("删除成功");
                window.location.reload();
            }
        });
    }
    updateComment=(commentId)=>{
        let that=this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/insertComment/'+commentId,
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                oldContent:res.data,
                isVis:true,
                updateCommentId:commentId
            })
        });
    }
    sumbitComment=()=>{
        const newComment={
            content:this.state.content,
            parentCommentId:this.state.parentCommentId,
            userId:this.props.userId,
            id:this.props.id,
            root:this.state.rootId
        };
        console.log(newComment);
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/insertComment/',
            data:newComment
        }).then(function(res) {
            console.log(res.data);
            if(res.data){
                message.success("评论成功");
                window.location.reload();
            }
        });
    }
    sumbitUpdate=()=>{
        const newComment={
            content:this.state.oldContent,
            commentId:this.state.updateCommentId,
        };
        console.log(newComment);
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/updateComment/',
            data:newComment
        }).then(function(res) {
            console.log(res.data);
            if(res.data){
                message.success("修改成功");
                window.location.reload();
            }
        });
    }
    render(){
        let actions=[];
        this.state.comment.map((item,index)=>{
            if(item.publisherId===this.props.userId){
                actions[index]=[<span onClick={()=>{this.addReply(item.commentId,item.root)}}>回复</span>,
                <span onClick={()=>{this.deleteComment(item.commentId)}}>删除</span>,
                <span onClick={()=>{this.updateComment(item.commentId)}}>修改</span>];
            }else{
                actions[index]=[<span onClick={()=>{this.addReply(item.commentId,item.root)}}>回复</span>];
            }
        })
        return (
            <>
                <div>
                    {
                        this.state.comment.map((item,item_index)=>{
                            if(item.parentUserName==='')
                                return(
                                    <Comment 
                                    key={item_index}
                                    actions={actions[item_index]}
                                    author={item.userName}
                                    avatar={<Avatar src="https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />}
                                    content={item.content}
                                    datetime={item.date}
                                    style={{marginLeft:30}}>
                                        {
                                            this.state.comment.map((ikey,key_index)=>{
                                                if(ikey.root===item.root&&ikey.parentUserName!=='')
                                                    return(
                                                        <Comment
                                                        key={key_index}
                                                        actions={actions[key_index]}
                                                        author={(ikey.userName)+" 回复 "+(ikey.parentUserName)}
                                                        avatar={<Avatar src="https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />}
                                                        content={ikey.content}
                                                        datetime={ikey.date} >
                                                        </Comment>
                                                    )
                                            })
                                        }
                                    </Comment>
                                )
                            }
                        )
                    }
                </div>
                <div style={{textAlign:'center'}}>
                    <Button type="primary" onClick={this.addComment} icon={<CommentOutlined/> } style={{marginBottom:50}}>发表评论</Button>
                    <Modal 
                    title='评论编辑器' 
                    centered 
                    visible={this.state.isSee}
                    onCancel={()=>{this.setState({isSee:false})}}
                    footer={[
                        <Button type="primary" onClick={this.sumbitComment} style={{marginBottom:20}}>发表</Button>,
                        <Button onClick={()=>{this.setState({isSee:false})}}>取消</Button>
                    ]}
                    width="50%">
                        <TextArea
                            showCount
                            maxLength={50}
                            style={{width:'90%',height:'80%'}}
                            onChange={this.handleEditorChange}
                        />
                    </Modal>
                    <Modal 
                    title='评论修改器' 
                    centered 
                    visible={this.state.isVis}
                    onCancel={()=>{this.setState({isVis:false})}}
                    footer={[
                        <Button type="primary" onClick={this.sumbitUpdate} style={{marginBottom:20}}>修改</Button>,
                        <Button onClick={()=>{this.setState({isVis:false})}}>取消</Button>
                    ]}
                    width="50%"
                    destroyOnClose>
                        <TextArea
                            showCount
                            maxLength={50}
                            style={{width:'90%',height:'80%'}}
                            onChange={this.handleEditorupdate}
                            value={this.state.oldContent}
                        />
                    </Modal>
                </div>
            </>
        )
    }
}

export class UserNote extends React.Component{
    state={
        note:'',
        editorState: BraftEditor.createEditorState(null),
    }
    componentDidMount(){
        let that=this;
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/myNotes/true/',
            data:{userId:that.props.userId},
        }).then(function(res) {
            const notes=res.data;
            let note={};
            for(var i=0;i<notes.length;i++){
                if(notes[i].id===that.props.id){
                    note=notes[i];
                }
            }
            that.setState({
                note:note,
            })
        });
    }
    render(){
        return(
            <>
            </>
        );
    }
}