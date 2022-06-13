import axios from "axios";
import {Button, Descriptions, PageHeader, Skeleton, Table, Tabs, message, Tag, Collapse, List} from "antd";
import React from "react";
import {Link} from "react-router-dom";

export default class MyThesis extends React.Component {
    state = {
        data_1: [],
        data_2: [],
        loaded_1: false,
        loaded_2: false,
        id: '',
        location: 1,
    }

    constructor(props) {
        super(props);
        this.state = { data_1: [], data_2: [], id: props.id }
    }

    componentDidMount() {
        let that = this;
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/myPaper/true',
            data: { userId: this.state.id },
        }).then(function(res) {
            that.setState({
                data_1: res.data,
                loaded_1: true,
            })
        });

        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/myPaper/false',
            data: { userId: this.state.id },
        }).then(function(res) {
            that.setState({
                data_2: res.data,
                loaded_2: true,
            })
        });
    }

    callback = (key) => {
        this.setState({ location: key });
    }

    deleteThesis = (id) => {
        axios.post('http://localhost:8080/admin/deletePaper', { id: id })
            .then(function(res) {
                if(res.data) {
                    message.success("删除成功!");
                    setTimeout(window.location.reload(), 10000);
                }
                else {
                    message.error("删除失败!");
                }
            });
    }

    render() {
        const {TabPane} = Tabs;
        const { Panel } = Collapse;
        const routes = [
            {
                breadcrumbName: '内容管理',
            },
            {
                breadcrumbName: '文章管理',
            }
        ];
        const columns = [
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: '10%',
                render: (_, record) => (
                    this.state.location === '2' ?
                        <Button type="link">
                            <Link to={"/detail/"+record.id} state={{
                                userid: this.state.id,
                                directions: record.path,
                            }}>
                                { record.title }
                            </Link>
                        </Button> :
                        <Button type="link">
                            <Link to={"/edit/"+record.id+"/"+record.publisher} state={{userid: this.state.id}}>
                                { record.title }
                            </Link>
                        </Button>
                )
            },
            {
                title: '作者',
                dataIndex: 'writers',
                key: 'writers',
                width: '10%',
                render: (_, record) => (
                    <Collapse ghost>
                        <Panel header="作者列表" key='1'>
                            <List
                                size="small"
                                dataSource={record.writers}
                                renderItem={(item) => <List.Item>{item}</List.Item>}
                            />
                        </Panel>
                    </Collapse>
                )
            },
            {
                title: '发布日期',
                dataIndex: 'thesisDate',
                key: 'thesisDate',
                width: '10%',
                sorter: (a, b) => {
                    let ta = new Date(a.thesisDate).getTime();
                    let tb = new Date(b.thesisDate).getTime();
                    return ta - tb;
                },
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '发布人',
                dataIndex: 'publisher',
                key: 'publisher',
                width: '10%',
            },
            {
                title: '论文类型',
                dataIndex: 'thesisType',
                key: 'thesisType',
                width: '10%',
            },
            {
                title: '研究方向',
                dataIndex: 'path',
                key: 'path',
                width: '10%',
                render: (_, record) => (
                    record.path.map((item, index)=>(
                        <Tag key={item} style={{marginBottom: 2}}>
                            {item}
                        </Tag>
                    ))
                )
            },
            {
                title: '发布会议',
                dataIndex: 'publishMeeting',
                key: 'publishMeeting',
                width: '10%',
            },
            {
                title: '点赞数',
                dataIndex: 'like',
                key: 'like',
                width: '10%',
                sorter: (a, b) => a.like - b.like,
                sortDirections: ['descend', 'ascend'],
            },
            {
                title: '操作',
                width: '10%',
                render: (_, record) => (
                    <Button type="primary" danger onClick={()=>{
                        this.deleteThesis(record.id)
                            .then(function(res) {
                                console.log(res);
                            })}}>
                        删除
                    </Button>
                )
            }
        ];
        return <>
            <PageHeader style={{background: '#fff'}} title="我的文章" breadcrumb={{routes}}>
                <Descriptions>
                    <Descriptions.Item label="统计已发布文章数">{this.state.data_1.length}</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div className="site-layout-content">
                <Tabs defaultActiveKey="1" onChange={this.callback} centered>
                    <TabPane tab="草稿箱" key="1">
                        {this.state.loaded_2?<Table className="site-layout-content" columns={columns} dataSource={this.state.data_2}/>
                            : <Skeleton active/>}
                    </TabPane>
                    <TabPane tab="已发布" key="2">
                        {this.state.loaded_1?<Table className="site-layout-content" columns={columns} dataSource={this.state.data_1}/>
                            : <Skeleton active/>}
                    </TabPane>
                </Tabs>
            </div>
        </>
    }
}