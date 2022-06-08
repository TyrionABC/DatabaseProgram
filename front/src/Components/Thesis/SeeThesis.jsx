import React from 'react'
import axios from "axios";
import {Col, Row, Comment} from 'antd'
export default class SeeThesis extends React.Component{
    state={
        text:'',
        parentComment:[],
    }
    componentDidMount () {
        console.log(this.props);
        // 假设此处从服务端获取html格式的编辑器内容
        let that=this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getText/'+that.props.params.id,
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                text:res.data.text,
                //parentComment:res.data.parentComment,
            })
        });
    }
    render(){
        return(
            <>
                <Row>
                    <Col span={16}>
                        <div>
                            {this.state.text}
                        </div>
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