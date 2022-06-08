import axios from "axios";
import {Button, Descriptions, PageHeader, Table, Tabs} from "antd";
import React from "react";

export default class MyThesis extends React.Component {
    state = {
        data_1: [],
        data_2: [],
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
            console.log(res.data);
            that.setState({
                data_1: res.data
            })
        });

        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/myPaper/false',
            data: { userId: this.state.id },
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                data_2: res.data
            })
        });
    }

    callback = (key) => {
        this.setState({ location: key });
        console.log(key);
    }

    render() {
        const {TabPane} = Tabs;
        console.log(this.state);
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
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: '10%',
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: '10%',
                render: (_, record) => (
                    this.state.location === '2' ?
                        <Button type="link" onClick={()=>{ window.location.href="/detail/" + record.id }}>
                            { record.title }
                        </Button> :
                        <Button type="link" onClick={()=>{ window.location.href="/edit/" + record.id }}>
                            { record.title }
                        </Button>
                )
            },
            {
                title: '作者',
                dataIndex: 'writer',
                key: 'writer',
                width: '10%',
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
                        <Table className="site-layout-content" columns={columns} dataSource={this.state.data_2}/>
                    </TabPane>
                    <TabPane tab="已发布" key="2">
                        <Table className="site-layout-content" columns={columns} dataSource={this.state.data_1}/>
                    </TabPane>
                </Tabs>
            </div>
        </>
    }
}