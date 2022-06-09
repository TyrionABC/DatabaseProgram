import React, {useState} from 'react'
import axios from "axios";
import {Col, Row, Comment, Avatar, Button, Modal} from 'antd'
import {useParams} from "react-router-dom";
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { CommentOutlined } from '@ant-design/icons';
import {useLocation} from "react-router";

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
                            <UserComment id={this.props.id} />
                        </div>
                    </Col>
                </Row>
            </>
        )
    }
}

class UserComment extends React.Component{
    state={
        comment:[],
        isSee:false,
        editorState: BraftEditor.createEditorState(null),
        outputHTML: '',
        parentCommentId:''
    }
    componentDidMount () {
        let that=this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/selectAllComments/'+that.props.id,
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                comment:res.data,
            })
        });
    }
    handleEditorChange = (editorState) => {
        this.setState({ editorState: editorState, outputHTML: editorState.toHTML() });
    }
    addComment=()=>{
        this.setState({
            parentCommentId:'',
            isSee:true,
        })
    }
    addReply=(parentCommentId)=>{
        this.setState({
            parentCommentId:parentCommentId,
            isSee:'true',
        })
    }
    render(){
        let actions=[];
        const {editorState}=this.state;
        this.state.comment.map((item,index)=>{
            if(item.publisherId===this.props.userId){
                actions[index]=[<span onClick={()=>{this.addReply(item.parentCommentId)}}>回复</span>,<span>删除</span>,<span>修改</span>];
            }else{
                actions[index]=[<span>回复</span>];
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
                                    actions={actions[item_index]}
                                    author={item.userName}
                                    avatar={<Avatar src="https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />}
                                    content={item.content}>
                                        {
                                            this.state.comment.map((key,key_index)=>{
                                                if(key.parentUserName!=='')
                                                    return(
                                                        <Comment
                                                        actions={actions[key_index]}
                                                        author={(key.userName)+" 回复 "+(key.parentUserName)}
                                                        avatar={<Avatar src="https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />}
                                                        content={key.content}>
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
                    onOk={()=>this.setState({isSee:false})}
                    onCancel={()=>this.setState({isSee:false})}
                    width="90%">
                        <BraftEditor
                            value={ editorState }
                            onChange={this.handleEditorChange}
                        />
                    </Modal>
                </div>
            </>
        )
    }
}