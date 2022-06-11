import axios from "axios";
import {Button, Descriptions, PageHeader, Skeleton, Table, Tabs, message} from "antd";
import React from "react";
import Modal from "antd/es/modal/Modal";
import {Link} from "react-router-dom";

export default class MyColumn extends React.Component {
    state = {
        data_1: [],
        data_2: [],
        loaded_1: false,
        loaded_2: false,
        id: '',
        dirs: '',
        location: "1",
    }

    constructor(props) {
        super(props);
        this.state = { data_1: [], data_2: [], id: props.id, isVisible_1: false, isVisible_2: false,
        location: "1"}
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
                data_1: res.data,
                loaded_1: true,
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
                loaded_2: true,
            })
        })
    }

    deleteNote = (id) => {
        axios.post('http://localhost:8080/admin/deleteNotes', { id: id })
            .then(function(res) {
                console.log(res.data);
                if(res.data) {
                    message.success("删除成功!");
                    setTimeout(window.location.reload(), 10000);
                }
                else {
                    message.error("删除失败!");
                }
            });
    }
    callback = (key) => {
        this.setState({location: key});
        console.log(key);
    }

    render() {
        const {TabPane} = Tabs;

        const columns = [
            {
                title: '论文标题',
                dataIndex: 'title',
                key: 'title',
                width: '45%',
                render: (_, record) => (
                    this.state.location === "2" ?
                        <>{ record.title }</>
                        :
                        <Button type="link">
                            <Link to={"/detail/"+record.id} state={{
                                userid: this.state.id,
                                directions: record.path,
                            }}>
                                { record.title }
                            </Link>
                        </Button>
                )
            },
            {
                title: '内容',
                dataIndex: 'note',
                key: 'note',
                width: '45%',
                render: (_, record) => (
                    <div style={{maxHeight: '150px', maxWidth: '500px', overflow: 'scroll'}}>
                        <div dangerouslySetInnerHTML={{__html: record.note}}/>
                    </div>

                )
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