import React from "react";

import {
    Layout,
    Menu,
    Avatar,
    Input,
    Form,
    Table,
    Tag,
    Space,
    Modal,
    Descriptions,
    PageHeader,
    Button,
    message,
  } from 'antd';

import {
    UserOutlined,
    FileSearchOutlined,
    ReadOutlined,
    CommentOutlined,
    SmileOutlined,
    MehOutlined,
    ZoomOutOutlined
  } from '@ant-design/icons';

import create from 'zustand';
import axios from "axios"; 
  
import './Admin.css';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router";
import {UserGovern,IllegalUser} from "./User";
import { Direction } from "./Direction";
import {GovernThesis} from "./GovernThesis"
//import { SearchThesis } from "./SearchThesis";

const useStore = create(set => ({
    id: 101010,
    name: '',
    state: 'unallowed',
    email: '',
    contentNum: 0,
    isFocus:false,
    image: "https://images.pexels.com/photos/4428279/pexels-photo-4428279.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    changeContentNum: (num) => set(state => ({ contentNum: num })),
    changeState: (state) => set(state => ({ state: state })),
    changeName: (name) => set(state => ({ name: name })),
    changeEmail: (email) => set(state => ({ email: email })),
  }));

const Admin = () => {
  let { state } = useLocation();
  if(state === null) window.location.replace("/");
  let permission = state['permission'];
  let Username = state['name'];
  if(permission !== 'allowed' || Username.length === 0) {
    window.location.replace("/");
  }
  let mail = state['email'];

  // 根据email获取用户信息

  const emailChange = useStore(state => state.changeEmail);
  emailChange(mail);
  const change = useStore(state => state.changeState);
  change(permission);
  const nameChange = useStore(state => state.changeName);
  nameChange(Username);
  return <AdminMainContent mail={mail}/>;
}
const { Content, Footer, Sider } = Layout;

function deleteThesis(id){
  let paper={
      id:id
  }
  axios({
      method: 'post',
      url: 'http://localhost:8080/admin/deletePaper',
      data:paper
  }).then(function(res) {
      if(res.data){
          message.success("添加成功");
          setTimeout(window.location.reload(), 10000);
      }
  });
}
function SearchThesis(props) {
  const data = props.lists;
  const userid = useStore(state=>state.email);
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
        <Column title="标题" dataIndex="title" key="title" />
        <Column title="第一作者" dataIndex="writers" key="writers"
          render={(_, record)=>(
              <div>
                { record.writers[0] }
              </div>
          )}
        />
        <Column
            title="研究方向"
            dataIndex="path"
            key="path"
            render={(_, record) => (
                record.path.map((item, index)=>(
                    <Tag key={item}>
                      {item}
                    </Tag>
                ))
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
              <a style={{color:'red'}} onClick={()=>deleteThesis(record.id)}>删除</a>
          )}
      />
    </Table>
    </>
}
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('用户管理', 'sub1', <UserOutlined />,[
    getItem('正常用户', '1', <SmileOutlined />),
    getItem('违规用户', '2', <MehOutlined />)
  ]),
  getItem('研究方向管理', '3', <FileSearchOutlined />),
  getItem('论文&评论管理', '4', <ReadOutlined /> ),
  getItem('搜索论文','5',<ZoomOutOutlined />),
];

let contents = [<UserGovern />, <IllegalUser />, <Direction />];
function setContent(id) {
  contents[3] = <GovernThesis id={id}/>;
}

function AdminName() {
    const url = useStore(state => state.image);
    const name = useStore(state => state.name);
    return <>
      <Avatar size={'large'} src={url} style={{margin: 5}}/>
      <br/>
      <Link to="/" id="logInfo" style={{color: 'white'}}>signed as: {name}</Link>
    </>
}
class AdminMainContent extends React.Component {
    state = {
      collapsed: false,
      num: 1,
      isFocus: false,
      id: this.props.mail,
      username: this.props.name,
      loaded: false,
      result: '',
      clicked: false,
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
      this.setState({num: key.key});
      if (key.key === '5') {
        this.setState({ isFocus: !this.state.isFocus });
      }
    }
    onFinish = async (values) => {
      if(!values['title'] && !values['directionName'] && !values['thesisType']
          && !values['overview'] && !values['name'] && !values['userName']
          && !values['publishMeeting']) {
        message.warning("搜索条件不能全为空!");
        setTimeout(window.location.reload(), 10000);
      }
      console.log('Success:', values);
      // 请求论文列表, 接收论文列表
      let that = this;
      await axios.post('http://localhost:8080/admin/select', values)
          .then(function (response) {
            console.log(response);
            that.setState({ result: response.data, loaded: true });
          })
          .catch(err => console.log(err));
    };
  
    render() {
      const { collapsed, num, isFocus } = this.state;
      setContent(this.state.id);
      contents[4] = <SearchThesis lists={this.state.result}/> 
      return (
          <>
          <Layout
              style={{
                minHeight: '100vh',
              }}
          >
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
              <div className="content">
                <AdminName/>
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
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
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
                    <Button type="primary" htmlType="submit" onClick={()=>{ this.setState({
                      clicked: true,
                      loaded: false,
                    }) }}>
                      查询
                    </Button>
                  </Form.Item>
                </Form>
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
          </>
      );
    }
  }
  
export default Admin;