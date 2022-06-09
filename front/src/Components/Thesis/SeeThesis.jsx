import React from 'react'
import axios from "axios";
import {Col, Row, Comment, Avatar} from 'antd'
import {useParams} from "react-router-dom";

export default function SeeThesis() {
    const params = useParams();
    console.log(params);
    return <Detail id={params.id}/>
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
    render(){
        let actions=[];
        this.state.comment.map((item,index)=>{
            if(item.publisherId===this.props.userId){
                actions[index]=[<span>回复</span>,<span>删除</span>];
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
                                                        author={(key.userName)+" 回复 " +(key.parentUserName)}
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
            </>
        )
    }
}