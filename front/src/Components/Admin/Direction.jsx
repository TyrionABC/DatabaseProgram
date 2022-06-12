import React from "react";
import { Input, 
    Divider,
    Table,
    Button,
    Space,
    Modal,
    message}from 'antd';
import { BulbFilled, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
export class Direction extends React.Component{
    state={
        allDirections:[],
        isSee:false,
        directionName:'',
        parentName:'',
        isVis:false,
        label:'',
        updateDirectionName:'',
        updateParentName:'',
        initialValue:'',
    }
    componentDidMount(){
        let that=this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getAllDirections',
        }).then(function(res) {
            let directions=res.data;
            let newDirections=[];
            for(var i=0;i<directions.length;i++){
                let parent={
                    key:i,
                    label:directions[i].label,
                    children:[],
                }
                directions[i].children.map((item,index)=>{
                    let child={
                        key:i+directions.length+index,
                        label:item.label,
                    }
                    parent.children.push(child);
                })
                newDirections.push(parent);
            }
            console.log(newDirections);
            that.setState({
                allDirections:newDirections,
            })
        });
    }
    addDirection=()=>{
        this.setState({
            isSee:true,
        })
    }
    deleteDirection=(label)=>{
        const direction={
            directionName:label
        }
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/deleteDirection',
            data:direction
        }).then(function(res) {
            if(res.data){
                message.success("删除成功");
                setTimeout(window.location.reload(), 10000);
            }
        });
    }
    updateDirection=(label)=>{
        let parentName='';
        for(var i=0;i<this.state.allDirections.length;i++){
            this.state.allDirections[i].children.map((item)=>{
                if(item.label===label){
                    parentName=this.state.allDirections[i].label;
                }
            })
        }
        this.setState({
            isVis:true,
            label:label,
            initialValue:parentName,
            updateParentName:parentName
        })
    }
    handleDirectionUpdate=(event)=>{
        this.setState({
            updateDirectionName:event.target.value,
        })
    }
    handleParentUpdate=(event)=>{
        this.setState({
            updateParentName:event.target.value,
        })
    }
    submitUpdate=()=>{
        let parentName=this.state.updateParentName;
        if(parentName===''){
            parentName=this.state.updateDirectionName;
        }
        const direction={
            directionName:this.state.updateDirectionName,
            parentDirectionName:parentName,
        }
        console.log(direction);
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/updateDirection/'+this.state.label,
            data:direction
        }).then(function(res) {
            if(res.data){
                message.success("修改成功");
                setTimeout(window.location.reload(), 10000);
            }else{
                message.error("内容错误，无法修改，请检查您的内容");
            }
        });
    }
    submitDirection=()=>{
        let parentName=this.state.parentName;
        if(parentName===''){
            parentName=this.state.directionName;
        }
        const direction={
            directionName:this.state.directionName,
            parentDirectionName:parentName,
        }
        console.log(direction);
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/insertDirection',
            data:direction
        }).then(function(res) {
            if(res.data){
                message.success("添加成功");
                setTimeout(window.location.reload(), 10000);
            }
        });
    }
    handleDirectionChange=(event)=>{
        this.setState({
            directionName:event.target.value,
        })
    }
    handleParentChange=(event)=>{
        this.setState({
            parentName:event.target.value,
        })
    }
    render(){
        const columns=[{
            title:'研究方向名',
            dataIndex:'label',
            key:'label'
        },{
            title:'操作',
            key:'action',
            render:(_, record)=>(
                <Space>
                    <a style={{color:'red'}} onClick={()=>this.deleteDirection(record.label)}>删除方向</a>
                    <a style={{color:'green'}} onClick={()=>this.updateDirection(record.label)}>修改方向</a>
                </Space>
            )
        }]
        return(
            <>
                <div style={{textAlign:'center'}}>
                    <Button type='primary' onClick={this.addDirection}>增加研究方向</Button>
                </div>
                <Divider>现有研究方向</Divider>
                <Table
                columns={columns}
                dataSource={this.state.allDirections} />
                <Modal
                title='添加研究方向'
                centered
                visible={this.state.isSee}
                onCancel={()=>this.setState({isSee:false})}
                width="50%"
                footer={[
                    <Button type="primary" onClick={this.submitDirection} style={{marginBottom:20}}>添加</Button>,
                    <Button onClick={()=>{this.setState({isSee:false})}}>取消</Button>
                ]}>
                    <p>研究方向名字:</p>
                    <Input style={{width:400}} onChange={this.handleDirectionChange}/>
                    <p>父方向名字:</p>
                    <Input placeholder="如果没父方向，不用填写" style={{width:400}} onChange={this.handleParentChange}/>
                </Modal>
                <Modal
                title='修改研究方向'
                centered
                visible={this.state.isVis}
                onCancel={()=>this.setState({isVis:false})}
                width="50%"
                footer={[
                    <Button type="primary" onClick={this.submitUpdate} style={{marginBottom:20}}>修改</Button>,
                    <Button onClick={()=>{this.setState({isVis:false})}}>取消</Button>
                ]}
                destroyOnClose>
                    <p>研究方向名字:</p>
                    <Input style={{width:400}} onChange={this.handleDirectionUpdate}/>
                    <p>父方向名字:</p>
                    <Input placeholder="如果没父方向，不用填写" style={{width:400}} onChange={this.handleParentUpdate} defaultValue={this.state.initialValue}/>
                </Modal>
            </>
        )
    }
}