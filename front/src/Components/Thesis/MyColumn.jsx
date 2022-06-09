import axios from "axios";
import {Button, Descriptions, PageHeader, Table, Tabs} from "antd";
import React from "react";

export default class MyColumn extends React.Component {
    state = {
        data_1: [],
        data_2: [],
        id: '',
    }

    constructor(props) {
        super(props);
        this.state = { data_1: [], data_2: [], id: props.id }
    }

    componentDidMount() {
        let that = this;
        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/myNotes/true',
            data: { userId: this.state.id },
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                data_1: res.data
            })
        });

        axios({
            method: 'post',
            url: 'http://localhost:8080/admin/myNotes/false',
            data: { userId: this.state.id },
        }).then(function(res) {
            console.log(res.data);
            that.setState({
                data_2: res.data,
            })
        })
    }

    deleteNote = async (id) => {
        await axios.post('http://localhost:8080/admin/deleteNote', { id: id })
            .then(function(res) {
                console.log(res.data);
                if(res.data) {
                    alert("删除成功!");
                }
                else {
                    alert("删除失败!");
                }
            });
        window.location.reload();
    }

    render() {
        const {TabPane} = Tabs;
        function callback(key) {
            console.log(key);
        }
        const columns = [
            {
                title: '论文标题',
                dataIndex: 'title',
                key: 'title',
                width: '45%',
            },
            {
                title: '内容',
                dataIndex: 'note',
                key: 'note',
                width: '45%',
            },
            {
                title: '操作',
                width: '10%',
                render: (_, record) => (
                    <Button type="primary" danger onClick={()=>{
                        this.deleteNote(record.id)
                            .then(function(res) {
                                console.log(res);
                            })
                    }}>
                        删除
                    </Button>
                )
            }
        ];
        const routes = [
            {
                breadcrumbName: '内容管理',
            },
            {
                breadcrumbName: '笔记管理',
            }
        ];
        return <>
            <PageHeader style={{background: '#fff'}} title="我的笔记" breadcrumb={{routes}}>
                <Descriptions>
                    <Descriptions.Item label="统计已发布笔记数">{this.state.data_1.length}</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div className="site-layout-content">
                <Tabs defaultActiveKey="1" onChange={callback} centered>
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