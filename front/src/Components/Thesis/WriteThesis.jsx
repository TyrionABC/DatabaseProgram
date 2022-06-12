import React from 'react'
// 引入编辑器组件
import {Input, Space, Form, Select, Col, Row, Cascader, Button, DatePicker, Modal, Table, Tag, Drawer, Upload, message} from 'antd';
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import axios from "axios";
import { AntDesignOutlined, MinusCircleFilled, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useLocation } from "react-router";
import './Thesis.css';
import TextArea from 'antd/lib/input/TextArea';
import {useParams} from "react-router-dom";
import moment from 'moment';
const { SHOW_CHILD } = Cascader;

const {Option}=Select;
const { Column, ColumnGroup } = Table;

export class WriteThesis extends React.Component {
    state = {
        title:'',
        editorState: BraftEditor.createEditorState(null),
        outputHTML: '',
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
        });
    }
    handleTitleChange=(event)=>{
        this.setState({
            title:event.target.value,
        });
        console.log(this.state.title);
    }
    onFinish=(value)=>{
        if(this.state.title === null
            || this.state.title === ""
            || this.state.outputHTML === ""
            || this.state.outputHTML === null) {
            message.warning("标题和内容不能为空!");
            return;
        }
        console.log(value.writer);
        if(value.writer === null || value.writer.length === 0) {
            message.warning("作者栏不能为空!");
            return;
        }
        let directions=[];
        let fa = value.direction;
        fa.map((item)=>{
            directions.push(item[1]);
        })
        let xss = require('xss');
        xss(this.state.outputHTML);
        let submitData = {
            title:this.state.title,
            text:this.state.outputHTML,
            thesisType:value.thesisType,
            directions:directions,
            writers:value.writer,
            publishMeeting:value.publishMeeting,
            publishTime:value.publishTime,
            referIds:this.state.ref,
            flag:this.state.flag,
            publisherId:this.state.publisherId,
            publisher:this.state.publisher,
            overview:value.overview,
        };
        console.log(submitData);
        this.sendThesisSubmit(submitData)
            .then(function(res) { console.log(res) });
    }

    sendThesisSubmit = async (data) => {
        await axios({
            method: 'post',
            url: 'http://localhost:8080/admin/insertPaper',
            data: data,
        }).then(function(res) {
            console.log(res.data);
            if(res.data){
                message.success("提交成功!");
                setTimeout(window.location.reload(), 10000);
            }
            else {message.error("提交失败! 请重试");}
        });
        return false;
    }

    submitForm = async (value)=>{
        if(!value['title'] && !value['directionName'] && !value['thesisType']
            && !value['overview'] && !value['name'] && !value['userName']
            && !value['publishMeeting']) {
            message.warning("搜索条件不能全为空!");
            return;
        }
        console.log(value);
        let that=this;
        await axios({
            method: 'post',
            url: 'http://localhost:8080/admin/select',
            data: value
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
        let list = this.state.ref;
        if(list.indexOf(id) !== -1) {
            message.warning("不能添加相同引用!")
            return;
        }
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
        message.success("已添加" + title);
    }
    beforeUpload = ({fileList}) =>{
        return false;
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
        this.setState({ editorState: editorState, outputHTML: editorState.toHTML() });
    }

    showDrawer = () => {
        this.setState({ visible: true })
    };

    onClose = () => {
        this.setState({ visible: false })
    };

    render () {
        const uploadArmProps = {
            name: 'file',
            //action: `上传文件的接口地址`,
            headers: {
            },// 请求头
            showUploadList: true,
            maxCount: 3,
            onChange: info => {
            if (info.file.status === 'done') {
                console.log(info, "info")
            }
            else if (info.file.status === 'error') {
                 console.log("上传失败")
            }
             },
            beforeUpload:file=>{
                const reader=new FileReader();
                reader.readAsText(file);
                reader.onload=(result)=>{
                    let targetNum=result.target.result;
                    targetNum = targetNum.replace(/\n/g,"<br/>");
                    let tmp =  BraftEditor.createEditorState(targetNum);
                    this.setState({editorState: tmp, outputHTML: tmp.toHTML()});
                    console.log(this.state.outputHTML);
                    // targetNum是文件内容 type为string
                }
                return false;
            }
        };
        function UploadComponent() {
            return <Upload {...uploadArmProps} accept=".txt">
                <Button type="text" onClick={()=>alert("目前仅支持.txt文件并且只有三次上传机会")}
                        icon={<UploadOutlined />}>从本地上传</Button>
            </Upload>
        }
        const { editorState } = this.state;
        const extendControls = [
            'separator',
            {
                key: 'uploadComponent',
                type: 'component',
                component: <UploadComponent />
            }
        ]
        const form = (<div style={{marginTop:20}}>
            <Form
                name="info"
                layout='vertical'
                //labelCol={{span:8,}}
                //wrapperCol={{span:16,}}
                initialValues={{remember:true,}}
                onFinish={this.onFinish}
                //onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="论文类型"
                    name="thesisType"
                    rules={[{required:true},]}
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
                    name="direction"
                    rules={[{required:true},]}>
                    <Cascader allowClear showCheckedStrategy={SHOW_CHILD} options={this.state.direction} multiple />
                </Form.Item>
                <Form.List name="writer" >
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
                                        rules={[{required:true}]}
                                    >
                                        <Input id={name+1} minLength={1} maxLength={50}/>
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={()=>remove(name)} />
                                </Space>
                            ))}
                            <Form.Item label={"添加作者"} rules={[{required:true}]}>
                                <Button type="dashed" onClick={()=>add()} block icon={<PlusOutlined/>}/>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item
                    label="会议"
                    name="publishMeeting"
                    rules={[{required:true},]}>
                    <Input maxLength={50}/>
                </Form.Item>
                <Form.Item
                    label="发表日期"
                    name="publishTime"
                    rules={[{required:true},]}
                >
                    <DatePicker/>
                </Form.Item>
                <Form.Item label={"添加引用"} rules={[{required:true},]}>
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
                <Form.Item 
                label="摘要"
                name="overview">
                    <TextArea allowClear showCount maxLength={100}/>
                </Form.Item>
                <Form.Item
                label="额外文件"
                name="upload"
                action="118.195.171.21">
                    <Upload name="logo" beforeUpload={this.beforeUpload}>
                        <Button icon={<UploadOutlined />}> 点击上传 </Button>
                    </Upload>
                </Form.Item>
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
                                    name="directionName"
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
                                    name="name"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="发布人"
                                    name="userName"
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
                                            <a style={{color:'green'}} onClick={()=>{
                                                this.addRef(record.id, record.title);}}>添加</a>
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
                    <Input placeholder='标题'
                           size={"large"}
                           bordered={false}
                           onChange={this.handleTitleChange}
                           maxLength={50}/>
                </div>
                    <div className="editor-wrapper" style={{backgroundColor:'white' }}>
                        <BraftEditor
                            value={ editorState }
                            onChange={this.handleEditorChange}
                            excludeControls={['emoji', 'link']}
                            extendControls={extendControls}
                            pasteMode={['text']}
                        />
                    </div>
                </Space>
                <div className="bottomElement">
                    <Button type="primary" ghost style={{width: "25%"}} onClick={this.showDrawer}>完成</Button>
                </div>
            </div>
                <Drawer title="提交论文" placement="right" onClose={this.onClose} visible={this.state.visible}>
                    { form }
                </Drawer>
            </>
        )
    }

}

export function UpdateThesis(){
    const params = useParams();
    console.log(params);
    return <Update id={params.id} publisher={params.publisher} />
}
export class Update extends React.Component {

    state = {
        title:'',
        editorState: BraftEditor.createEditorState(null),
        outputHTML: '',
        flag:0,
        isSee:false,
        directions:[],
        arr:[],
        ref:[],
        showRef:[],
        publisher: '',
        publisherId: '',
        visible: false,
        writers:[],
        refers:[],
        initialForm:{},
        direction:[],
    }

    async componentDidMount () {
        let that=this;
        let allDirections=[];
        await axios({
            method: 'get',
            url: 'http://localhost:8080/admin/getAllDirections',
        }).then(function(res) {
            allDirections=res.data;
            that.setState({
                directions:res.data,
            })
        });
        that.setState({
            flag:0,
        });
        axios({
            method:'get',
            url:'http://localhost:8080/admin/getAllInfo/'+that.props.id,
        }).then(function(res){
            console.log(res.data);
            let newShowRef=[];
            let newRef=[];
            for(let i=0;i<res.data.refers.length;i++){
                newShowRef.push(res.data.refers[i].title);
                newRef.push(res.data.refers[i].referenceId);
            }
            let direction=[];
            let directions=res.data.directions;
            for(let i=0; i<allDirections.length;i++){
                allDirections[i].children.map((item)=>{
                    let childDirection=[];
                    for(var j=0;j<directions.length;j++){
                        if(item.value===directions[j]){
                            childDirection.push(allDirections[i].value);
                            childDirection.push(item.value);
                        }
                    }
                    if(childDirection.length!==0){
                        direction.push(childDirection);
                    }
                })
            }
            //console.log(direction);
            let newForm={
                thesisType:res.data.thesisType,
                direction:direction,
                //writer:res.data.writers,
                publishMeeting:res.data.publishMeeting,
                publishTime:moment(res.data.publishTime,'YYYY-MM-DD'),
                overview:res.data.overview,
            }
            that.setState({
                title:res.data.title,
                editorState:BraftEditor.createEditorState(res.data.text),
                writers:res.data.writers,
                publisherId:res.data.publisherId,
                publisher:that.props.publisher,
                refers:res.data.refers,
                ref:newRef,
                showRef:newShowRef,
                initialForm:newForm,
                direction:res.data.directions
            })
        })
    }
    handleTitleChange=(event)=>{
        this.setState({
            title:event.target.value,
        });
        console.log(this.state.title);
    }
    onFinish=(value)=>{
        if(this.state.title === null
            || this.state.title === ""
            || this.state.outputHTML === ""
            || this.state.outputHTML === null) {
            message.warning("标题和内容不能为空!");
            return;
        }
        console.log(value.writer);
        if(value.writer === null || value.writer.length === 0) {
            message.warning("作者栏不能为空!");
            return;
        }
        let direction=value.direction;
        let directions=[];
        direction.map((item)=>{
            directions.push(item[1]);
        })
        let submitData = {
            title:this.state.title,
            text:this.state.outputHTML,
            thesisType:value.thesisType,
            directions:directions,
            writers:value.writer,
            publishMeeting:value.publishMeeting,
            publishTime:value.publishTime,
            referIds:this.state.ref,
            flag:this.state.flag,
            publisherId:this.state.publisherId,
            publisher:this.state.publisher,
            overview:value.overview,
            id:this.props.id,
        };
        console.log(submitData);
        this.sendThesisSubmit(submitData)
            .then(function(res) { console.log(res) });
    }

    sendThesisSubmit = async (data) => {
        await axios({
            method: 'post',
            url: 'http://localhost:8080/admin/updatePaper/'+this.props.id,
            data: data,
        }).then(function(res) {
            console.log(res.data);
            if(res.data){
                message.success("提交成功!");
                setTimeout(window.history.go(-1), 10000);
            }
            else {message.error("提交失败! 请重试");}
        });
        return false;
        //console.log(data);
    }

    submitForm = async (value)=>{
        if(!value['title'] && !value['directionName'] && !value['thesisType']
            && !value['overview'] && !value['name'] && !value['userName']
            && !value['publishMeeting']) {
            message.warning("搜索条件不能全为空!");
            return;
        }
        console.log(value);
        let that=this;
        await axios({
            method: 'post',
            url: 'http://localhost:8080/admin/select',
            data: value
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
        let list = this.state.ref;
        if(list.indexOf(id) !== -1) {
            message.warning("不能添加相同引用!")
            return;
        }
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
        message.success("已添加" + title);
    }
    deleteRef = ( index )=>{
        let newShowRef=[].concat(this.state.showRef);
        console.log(this.state.showRef);
        newShowRef.splice(index,1);
        let newRef=[].concat(this.state.ref);
        newRef.splice(index,1);
        this.setState({
            showRef:newShowRef,
            ref:newRef,
        })
    }
    beforeUpload = ({fileList}) =>{
        return false;
    }
    submitContent = () => {
        this.setState({
            flag:0,
        })
        console.log(this.state.type);
    }
    submitFlag = () => {
        this.setState({
            flag:1
        })
    }

    handleEditorChange = (editorState) => {
        this.setState({ editorState: editorState, outputHTML: editorState.toHTML() });
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
                //initialValues={{remember:true,}}
                onFinish={this.onFinish}
                //onFinishFailed={onFinishFailed}
                autoComplete="off" 
                initialValues={this.state.initialForm}
            >
                <Form.Item
                    label="论文类型"
                    name="thesisType"
                    rules={[{required:false},]}
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
                    name="direction"
                    rules={[{required:false},]}>
                    <Cascader allowClear showCheckedStrategy={SHOW_CHILD} options={this.state.directions} multiple/>
                </Form.Item>
                <Form.List name="writer" initialValue={this.state.writers} >
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
                                        rules={[{required:true}]}
                                    >
                                        <Input id={name+1} minLength={1} maxLength={50}/>
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={()=>remove(name)} />
                                </Space>
                            ))}
                            <Form.Item label={"添加作者"} rules={[{required:true}]}>
                                <Button type="dashed" onClick={()=>add()} block icon={<PlusOutlined/>}/>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item
                    label="会议"
                    name="publishMeeting"
                    rules={[{required:false},]}>
                    <Input defaultValue={this.state.publishMeeting} maxLength={50}/>
                </Form.Item>
                <Form.Item
                    label="发表日期"
                    name="publishTime"
                    rules={[{required:false},]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item label={"添加引用"} rules={[{required:true},]}>
                    <Button type="dashed" onClick={this.addReference} block icon={<PlusOutlined/>}/>
                </Form.Item>  
                {
                    this.state.showRef.map((item, index)=>(
                        <>
                        <Space style={{display:'flex'}} align="baseline">
                            <Form.Item
                                label={"引用"+(index+1)}>
                                <Input defaultValue={item} readOnly/>
                            </Form.Item>
                            <Form.Item>
                            <MinusCircleOutlined onClick={()=>this.deleteRef(index)} />
                            </Form.Item>
                        </Space>
                        </>
                    ))
                }
                <Form.Item 
                label="摘要"
                name="overview">
                    <TextArea allowClear showCount maxLength={100} />
                </Form.Item>
                <Form.Item
                label="额外文件"
                name="upload"
                action="118.195.171.21">
                    <Upload name="logo" beforeUpload={this.beforeUpload}>
                        <Button icon={<UploadOutlined />}> 点击上传 </Button>
                    </Upload>
                </Form.Item>
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
                                    name="directionName"
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
                                    name="name"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="发布人"
                                    name="userName"
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
                                            <a style={{color:'green'}} onClick={()=>{
                                                this.addRef(record.id, record.title);}}>添加</a>
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
                    <Input placeholder='标题'
                           size={"large"}
                           bordered={false}
                           onChange={this.handleTitleChange}
                           maxLength={50}
                           value={this.state.title}/>
                </div>
                    <div className="editor-wrapper" style={{backgroundColor:'white' }}>
                        <BraftEditor
                            value={ editorState }
                            onChange={this.handleEditorChange}
                        />
                    </div>
                </Space>
                <div className="bottomElement">
                    <Button type="primary" ghost style={{width: "25%"}} onClick={this.showDrawer}>完成</Button>
                </div>
            </div>
                <Drawer title="提交论文" placement="right" onClose={this.onClose} visible={this.state.visible}>
                    { form }
                </Drawer>
            </>
        )
    }

}