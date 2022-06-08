import React from 'react'
// 引入编辑器组件
import {Input, Space, Form, Select, Col, Row, Cascader, Button, DatePicker, Modal, Table, Tag, Drawer} from 'antd';
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import axios from "axios";
import { AntDesignOutlined, MinusCircleFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation } from "react-router";
import './Thesis.css';

const {Option}=Select;
const { Column, ColumnGroup } = Table;

export class WriteThesis extends React.Component {

    state = {
        title:'',
        editorState: BraftEditor.createEditorState(null),
        flag:'',
        isSee:false,
        direction:[],
        arr:[],
        ref:[],
        showRef:[],
        publisher: this.props.name,
        publisherId: this.props.id,
        visible: false,
    }

    componentDidMount () {
        // 假设此处从服务端获取html格式的编辑器内容
        let that=this;
        axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getAllDirections',
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                direction:res.data,
            })
        });
        const htmlContent = [];
        //await fetchEditorContent()
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
        that.setState({
            flag:0,
            editorState: BraftEditor.createEditorState(htmlContent),
        });
    }
    handleTitleChange=(value)=>{
        this.setState({
            title:value,
        });
        console.log(value);
    }
    onFinish=(value)=>{
        const htmlContent=this.state.editorState.toHTML();
        let submitData = {
            title:this.state.title,
            text:htmlContent,
            thesisType:value.thesisType,
            direction:value.direction,
            writers:value.writer,
            publishMeeting:value.publishMeeting,
            publishTime:value.publishTime,
            referIds:this.state.ref,
            flag:this.state.flag,
            publisherId:this.state.publisherId,
            publisher:this.state.publisher
        };
        console.log(submitData);
        /*axios({
            method: 'post',
            url: 'http://localhost:8080/admin/input',
            data: submitData,
        }).then(function(res) {
            console.log(res.data);
            if(res.data)alert("success");
            else alert("fail");
        });*/
    }
    submitForm =(value)=>{
        if(!value['title'] && !value['path'] && !value['thesisType']
            && !value['overview'] && !value['writerName'] && !value['publisher']
            && !value['publishMeeting']) {
            alert("搜索条件不能全为空!");
            return;
        }
        console.log(value);
        let that=this;
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/select',
            data:value
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                arr: res.data,
            })
        });
    }
    addReference = () =>{
        this.setState({
            isSee:true,
        })
    }
    addRef = (id, title) => {
        let a=[];
        for(var i=0;i<this.state.ref.length;i++){
            a.push(this.state.ref[i]);
        }
        a.push(id);
        let b=[];
        for(var i=0;i<this.state.showRef.length;i++){
            b.push(this.state.showRef[i]);
        }
        b.push(title);
        this.setState({
            ref:a,
            showRef:b
        })
    }
    submitContent = () => {
        this.setState({
            flag:0,
        })
    }
    submitFlag = () => {
        this.setState({
            flag:1
        })
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState });
    }

    showDrawer = () => {
        this.setState({ visible: true })
    };

    onClose = () => {
        this.setState({ visible: false })
    };

    render () {
        /*const direction=[{
            label:'人工智能',
            value:'人工智能',
            children:[
                {label:'深度学习',value:'深度学习'},
                {label:'人机对弈',value:'人机对弈'},
                {label:'机器学习',value:'机器学习'}
            ]
        },{
            label:'语言',
            value:'语言',
            children:[
                {label:'中文',value:'中文'},
                {label:'英文',value:'英文'}
            ]
        }];*/
        const { editorState } = this.state;

        const form = (<div style={{marginTop:20}}>
            <Form
                name="info"
                layout='vertical'
                //labelCol={{span:8,}}
                //wrapperCol={{span:16,}}
                initialValues={{remeber:true,}}
                onFinish={this.onFinish}
                //onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="论文类型"
                    name="thesisType"
                >
                    <Select allowClear >
                        <Option value="理论证明型">理论证明型</Option>
                        <Option value="综述性">综述性</Option>
                        <Option value="实验型">实验型</Option>
                        <Option value="工具型">工具型</Option>
                        <Option value="数据集型">数据集型</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="研究方向"
                    name="direction">
                    <Cascader allowClear options={this.state.direction} multiple />
                </Form.Item>
                <Form.List name="writer">
                    {(fields,{add, remove})=>(
                        <>
                            {fields.map(({key, name,...restField})=>(
                                <Space
                                    key={key}
                                    style={{display:'flex'}}
                                    align="baseline"
                                >
                                    <Form.Item
                                        label={"第"+(name+1)+"作者"}
                                        {...restField}
                                        name={name}
                                    >
                                        <Input id={name+1} />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={()=>remove(name)} />
                                </Space>
                            ))}
                            <Form.Item label={"添加作者"}>
                                <Button type="dashed" onClick={()=>add()} block icon={<PlusOutlined/>}/>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item
                    label="会议"
                    name="publishMeeting">
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="发表日期"
                    name="publishTime"
                >
                    <DatePicker/>
                </Form.Item>
                <Form.Item label={"添加引用"}>
                    <Button type="dashed" onClick={this.addReference} block icon={<PlusOutlined/>}/>
                </Form.Item>
                {
                    this.state.showRef.map((item, index)=>(
                        <Space style={{display:'flex'}} align="baseline">
                            <Form.Item
                                label={"引用"+(index+1)}>
                                <Input value={item} readOnly/>
                            </Form.Item>
                        </Space>
                    ))
                }
                <Modal
                    title="引用查询"
                    centered
                    visible={this.state.isSee}
                    onOk={()=>this.setState({isSee:false})}
                    onCancel={()=>this.setState({isSee:false})}
                    width="90%"
                    destroyOnClose>
                    <Row>
                        <Col span={8}>
                            <div className="centering">
                            <Form
                                name="basic"
                                labelCol={{ span: 4 }}
                                initialValues={{ remember: true }}
                                preserve={false}
                                onFinish={this.submitForm}
                                style={{margin: 5}}
                                //onFinishFailed={}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="论文标题"
                                    name="title"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="研究方向"
                                    name="path"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="论文类型"
                                    name="thesisType"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="论文摘要"
                                    name="overview"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="作者"
                                    name="writerName"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="发布人"
                                    name="publisher"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="会议"
                                    name="publishMeeting"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </Form.Item>
                            </Form>
                            </div>
                        </Col>
                        <Col span={16}>
                            <div className="centering">
                            <Table dataSource={this.state.arr} style={{margin: 5}}>
                                <ColumnGroup title="基本信息">
                                    <Column title="ID" dataIndex="id" key="id" />
                                    <Column title="标题" dataIndex="title" key="title" />
                                    <Column title="作者" dataIndex="writerName" key="writerName" />
                                    <Column
                                        title="研究方向"
                                        dataIndex="path"
                                        key="path"
                                        render={(tag => (
                                                <Tag color="blue" key={tag}>
                                                    {tag}
                                                </Tag>
                                            )
                                        )}
                                    />
                                    <Column title="类型" dataIndex="thesisType" key="thesisType" />
                                </ColumnGroup>
                                <ColumnGroup title="发布">
                                    <Column title="发布人" dataIndex="publisher" key="publisher" />
                                    <Column title="发布会议" dataIndex="publishMeeting" key="publishMeeting" />
                                </ColumnGroup>
                                <Column
                                    title="操作"
                                    key="action"
                                    render={(_,record) => (
                                        <Space size="middle">
                                            <a style={{color:'green'}} onClick={()=>this.addRef(record.id, record.title)}>添加</ a>
                                        </Space>
                                    )}
                                />
                            </Table>
                            </div>
                        </Col>
                    </Row>
                </Modal>
                <br/>
                <Form.Item>
                    <Button block ghost type="primary" htmlType="submit" onClick={this.submitFlag}>
                        保存草稿
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit" onClick={this.submitContent}>
                        提交论文
                    </Button>
                </Form.Item>
            </Form>
        </div>);

        return (
            <>
            <div className="site-layout-content">
                <Space direction='vertical' size="middle">
                <div style={{marginTop:20}}>
                    <Input placeholder='标题' size={"large"} bordered={false} onChange={this.handleTitleChange}/>
                </div>
                    <div className="my-component" style={{backgroundColor:'white' }}>
                    <BraftEditor
                        value={editorState}
                        onChange={this.handleEditorChange}
                    />
                </div>
                </Space>
                <div className="bottomElement">
                    <Button type="primary" style={{width: "25%"}} onClick={this.showDrawer}>完成</Button>
                </div>
            </div>
                <Drawer title="提交论文" placement="right" onClose={this.onClose} visible={this.state.visible}>
                    { form }
                </Drawer>
            </>
        )
    }

}

export class UpdateThesis extends React.Component {

    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    }

    componentDidMount () {
        // 假设此处从服务端获取html格式的编辑器内容
        const htmlContent = [];
        /*axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getText?id='+props.id,
        }).then(function(res) {
            console.log(res.data);
            htmlContent=res.data.text;
        });*/
        //await fetchEditorContent()
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
        this.setState({
            editorState: BraftEditor.createEditorState(htmlContent)
        })
    }

    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        //const result = await saveEditorContent(htmlContent)
        /*axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getText?id='+props.id,
        }).then(function(res) {
            console.log(res.data);
            htmlContent=res.data.text;
        });*/
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }

    render () {

        const { editorState } = this.state
        return (
            <div className="my-component">
                <BraftEditor
                    value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                />
            </div>
        )

    }

}