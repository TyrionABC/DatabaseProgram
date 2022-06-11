import React, {useState} from 'react'
import axios from "axios";
import {Col, Row, Comment, Avatar, Button, Modal, Divider, Space, message, PageHeader, Empty, Tooltip} from 'antd'
import {useParams} from "react-router-dom";
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import {CommentOutlined, HeartFilled, HeartTwoTone} from '@ant-design/icons';
import {useLocation} from "react-router";
import TextArea from 'antd/lib/input/TextArea';
import './Thesis.css';

export default function SeeThesis() {
    let { state } = useLocation();
    console.log(state.userid);
    const params = useParams();
    console.log(params);
    const config = {
        content: ' + 1',
        icon: <HeartTwoTone twoToneColor="#D00"/>
    }
    return <>
        <PageHeader
            className="site-page-header"
            onBack={() => window.history.go(-1)}
            title="返回"
            subTitle="论文详情页"
            style={{marginBottom:'16px', background: 'white'}}
            ghost
            extra={[ <Tooltip title="点赞"><Button onClick={()=>{
                axios.get('http://localhost:8080/admin/like/' + params.id)
                    .then(function(res) {
                        message.info(config);
                    })
            }} type='text' danger icon={<HeartFilled />} /></Tooltip> ]}
        />
        <div className="site-layout">
            <Detail id={params.id} userId={state.userid}/>
        </div>
        </>
}

class Detail extends React.Component{
    state={
        text:'',
        title:'',
        publisherId: '',
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
                publisherId: res.data.publisherId,
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
                        <div className="thesis-content">
                            <div style={{textAlign:'center'}}>
                                {this.state.title}
                            </div>
                            <div dangerouslySetInnerHTML={{__html:this.state.text}} style={{marginLeft:100,marginRight:100}} />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="comment-content" >
                            <UserComment id={this.props.id} userId={this.props.userId}/>
                        </div>
                    </Col>
                </Row>
                <Divider> 论文笔记 </Divider>
                <Row>
                    <div className="note-content">
                        <UserNote id={this.props.id} userId={this.props.userId} publisherId={this.state.publisherId} />
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
        isVis:false,
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
                setTimeout(window.location.reload(), 5000);
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
                setTimeout(window.location.reload(), 5000);
            }
            else {
                message.error("评论失败");
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
                setTimeout(window.location.reload(), 5000);
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
        });
        const commentArea = () => {
            if(this.state.comment.length === 0) return <Empty/>;
            return this.state.comment.map((item,item_index)=>{
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
        return (
            <>
                <div className="comment-content-inner">
                    { commentArea() }
                </div>
                <div style={{textAlign:'center'}}>
                    <Button type="text" ghost block onClick={this.addComment} icon={<CommentOutlined/> } style={{marginBottom:50}}>发表评论</Button>
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
        oldNote:'',
        publishedNote:'',
        currentNote: '',
        editorState: BraftEditor.createEditorState(null),
    }
    componentDidMount(){
        let that=this;
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/myNotes/false/',
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
                oldNote:note.note,
                editorState:BraftEditor.createEditorState(note.note),
            })
        });
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
                publishedNote:note.note,
            })
        });
    }
    handleEditorChange=(editorState)=>{
        this.setState({ editorState: editorState, currentNote: editorState.toHTML() });
    }
    submitNote=()=>{
        const note={
            id:this.props.id,
            note:this.state.currentNote,
            flag:0,
            publisherId: this.props.publisherId,
        }
        console.log(note);
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/insertNotes/',
            data:note,
        }).then(function(res) {
            if(res.data){
                message.success("发表成功");
            }
            else {
                message.error("发表失败");
            }
        })
    }
    preserveNote=()=>{
        const note={
            id:this.props.id,
            note:this.state.publishedNote,
            flag:1,
        }
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/insertNotes/',
            data:note,
        }).then(function(res) {
            if(res.data){
                message.success("发表成功");
            }
            else {
                message.error("发表失败");
            }
        })
    }
    render(){
        const {editorState}=this.state.editorState;
        const judge = () => {
            if(!this.state.publishedNote && this.props.userId === this.props.publisherId){
                return(
                    <Row>
                        <Col span={20}>
                            <BraftEditor
                                value={editorState}
                                onChange={this.handleEditorChange}/>
                        </Col>
                        <Col span={4}>
                            <Space>
                                <Button type="primary" onClick={this.submitNote}>发布笔记</Button>
                                <Button type="primary" ghost onClick={this.preserveNote}>保存草稿</Button>
                            </Space>
                        </Col>
                    </Row>
                )
            }
            else if(!this.state.publishedNote) {
                return ( <div style={{padding: '15%'}}>
                    <Empty/>
                </div> )
            }
            else {
                return(
                    <div dangerouslySetInnerHTML={{__html:this.state.publishedNote}}/>
                )
            }
        }
        return(
            <>
                { judge() }
            </>
        );
    }
}