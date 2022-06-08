import React from 'react'
import axios from "axios";
import {Col, Row, Comment} from 'antd'
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
        parentComment:[],
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
                            {
                                
                            }
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
        children:[],
        actions:[],
    }
    componentDidMount () {
        // 假设此处从服务端获取html格式的编辑器内容
        let that=this;
        axios({
            method: 'get',
            //url: 'http://localhost:8080/admin/getAllDirections',
            data:that.props.id
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                comment:res.data,
            })
        });
    }
    render(){
        return (
            <>
                <div>
                    <Comment 
                    actions={[<span> 回复评论 </span>]}
                    author={<a>{}</a>}></Comment>
                </div>
            </>
        )
    }
}