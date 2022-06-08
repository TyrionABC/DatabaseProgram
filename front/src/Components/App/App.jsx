import React, {lazy, useState, Suspense} from 'react';
import {
  Layout,
  Menu,
  Affix,
  Button,
  Tooltip,
  Avatar,
  Input,
  Form,
  Table,
  Tag,
  Space,
  Modal,
  Descriptions,
  PageHeader
} from 'antd';
import {
  SearchOutlined,
  BarChartOutlined,
  CloudOutlined,
  CopyOutlined,
  UserOutlined,
  PlusOutlined
} from '@ant-design/icons';
import create from 'zustand';
import { GetContentData, GetUniversalData } from "../Data/DataChart";
import { Latest } from "../Thesis/Thesis";
import MyThesis from "../Thesis/MyThesis";
import MyColumn from "../Thesis/MyColumn";
import { BasicInfoSet } from "./Info";
import './App.css';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import {WriteThesis} from "../Thesis/WriteThesis";

const useStore = create(set => ({
  name: '',
  state: 'unallowed',
  email: '',
  contentNum: 0,
  changeContentNum: (num) => set(state => ({ contentNum: num })),
  changeState: (state) => set(state => ({ state: state })),
  changeName: (name) => set(state => ({ name: name })),
  changeEmail: (email) => set(state => ({ email: email })),
}));

function App() {
  let { state } = useLocation();
  if(state === null) window.location.replace("/");
  let permission = state['permission'];
  let username = state['name'];
  if(permission !== 'allowed' || username.length === 0) {
    window.location.replace("/");
  }
  let mail = state['email'];
  const emailChange = useStore(state => state.changeEmail);
  emailChange(mail);
  const change = useStore(state => state.changeState);
  change(permission);
  const nameChange = useStore(state => state.changeName);
  nameChange(username);
  return <MainContent name={username} mail={mail}/>;
}

const { Content, Footer, Sider } = Layout;

const BottomPart = () => {
  return <Affix offsetBottom={10}>
    <Tooltip title="新文章">
      <Button type="primary" ghost shape="circle" icon={<PlusOutlined />}
              size="large" style={{ position: "absolute", bottom: 80, right: 80}}
              />
    </Tooltip>
  </Affix>
}

function Name() {
  const name = useStore(state => state.name);
  return <>
    <Avatar size={'large'}
            src="https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            style={{margin: 5}}/>
    <br/>
    <Link to="/" id="logInfo" style={{color: 'white'}}>signed as: {name}</Link>
  </>
}

function SearchResult(props) {
  const data = props.lists;
  const { Column, ColumnGroup } = Table;
  const routes = [
    {
      breadcrumbName: '文章搜索',
    },
    {
      breadcrumbName: '搜索结果',
    }
  ];
  console.log(data);
  let arr = data;
  return <>
    <PageHeader style={{background: '#fff'}} title="搜索结果" breadcrumb={{ routes }}>
      <Descriptions>
        <Descriptions.Item label="搜索结果总数">{ arr.length }</Descriptions.Item>
      </Descriptions>
    </PageHeader>
    <Table dataSource={arr}>
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
          render={() => (
              <Space size="middle">
                <a>查看</a>
              </Space>
          )}
      />
    </Table>
    </>
}

let contents = [];

const InnerForm = () => {
  const onFinish = (values) => {
    if(!values['title'] && !values['path'] && !values['thesisType']
        && !values['overview'] && !values['writerName'] && !values['publisher']
        && !values['publishMeeting']) alert("搜索条件不能全为空!");
    console.log('Success:', values);
    // 请求论文列表, 接收论文列表
    axios.post('http://localhost:8080/admin/select', values)
        .then(function (response) {
          console.log(response);
          let pass;
          if(response.data.length === 0)
            pass = [];
          else pass = response.data;
          contents[7] = <SearchResult lists={pass}/>;
        })
        .catch(err => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
      <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
            name="writer"
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
  );
}

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

function Info() {
  let name = useStore(state=>state.name);
  let email = useStore(state=>state.email);
  return {
    publisher: name,
    publisherId: email,
  }
}

const items = [
  getItem('首页', '1', <CloudOutlined />),
  getItem('内容管理', 'sub1', <CopyOutlined />, [
    getItem('文章管理', '2'),
    getItem('笔记管理', '3'),
  ]),
  getItem('数据中心', 'sub2', <BarChartOutlined />, [
    getItem('内容数据', '4'),
    getItem('全站数据', '5'),
  ]),
  getItem('个人中心', 'sub3', <UserOutlined />, [
    getItem('写文章', '6'),
    getItem('信息设置', '7'),
  ]),
  getItem('文章搜索', '8', <SearchOutlined />),
];

function setContent(id, name) {
  contents[0] = <Latest/>;
  contents[1] = <MyThesis id={id}/>;
  contents[2] = <MyColumn id={id}/>;
  contents[3] = <GetContentData id={id}/>;
  contents[4] = <GetUniversalData/>;
  contents[5] = <WriteThesis id={id} name={name}/>;
  contents[6] = <BasicInfoSet id={id}/>;
}

class MainContent extends React.Component {
  state = {
    collapsed: false,
    num: 1,
    isFocus: false,
    id: this.props.mail,
    username: this.props.name,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    let ele = document.getElementById('logInfo');
    if(collapsed) ele.style.display='none';
    else ele.style.removeProperty('display');
    this.setState({
      collapsed,
    });
  };

  onClick = (key) => {
    console.log(key);
    this.setState({num: key.key});
    if(key.key === '6') {
      this.setState({
        collapsed: true,
      });
      let ele = document.getElementById('logInfo');
      ele.style.display='none';
    }
    else if (key.key === '8') {
      this.setState({ isFocus: !this.state.isFocus });
    }
  }

  quickNew = () => {
    this.setState({
      collapsed: true,
      num: 6,
    });
    let ele = document.getElementById('logInfo');
    ele.style.display='none';
  }

  render() {
    const { collapsed, num, isFocus } = this.state;
    setContent(this.state.id, this.state.username);
    return (
        <>
        <Layout
            style={{
              minHeight: '100vh',
            }}
        >
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="content">
              <Name/>
            </div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={this.onClick}/>
          </Sider>
          <Layout className="site-layout" menu>
            <Content
                style={{
                  margin: '8px 16px',
                }}
            >
                { contents[num - 1] }
              <Modal
                  title="论文查询"
                  centered
                  visible={isFocus}
                  onOk={() => this.setState({ isFocus: !isFocus })}
                  onCancel={() => this.setState({ isFocus: !isFocus })}
                  width={1000}
              >
                <InnerForm />
              </Modal>
            </Content>
            <Footer
                style={{
                  textAlign: 'center',
                }}
            >
              论文In ©2022 Created by ECNUer
            </Footer>
          </Layout>
        </Layout>
          <Affix offsetBottom={10}>
            <Tooltip title="新文章">
              <Button type="primary" ghost shape="circle" icon={<PlusOutlined />}
                      size="large" style={{ position: "absolute", bottom: 80, right: 80}}
                      onClick={this.quickNew}/>
            </Tooltip>
          </Affix>
        </>
    );
  }
}

export default App;