import React from 'react';
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
  PageHeader,
  Skeleton,
    message,
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
import { useLocation } from "react-router";
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

class Name extends React.Component {
  state = {
    id: this.props.id,
    data: [],
  }

  componentDidMount() {
    let that = this;
    axios({
      method: 'post',
      url: 'http://localhost:8080/admin/getUserDetails',
      data: { userId: this.state.id },
    }).then(function(res) {
      that.setState({
        data: res.data,
      })
    })
  }

  render() {
    return <>
      <Avatar size={'large'}
              src="https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              style={{margin: 5}}/>
      <br/>
      <Link to="/" id="logInfo" style={{color: 'white'}}>signed as: {this.state.data.name}</Link>
    </>
  }
}

function SearchResult(props) {
  const data = props.lists;
  const userid = useStore(state=>state.email);
  const { Column, ColumnGroup } = Table;
  const routes = [
    {
      breadcrumbName: '????????????',
    },
    {
      breadcrumbName: '????????????',
    }
  ];
  let arr = data;
  return <>
    <PageHeader style={{background: '#fff'}} title="????????????" breadcrumb={{ routes }}>
      <Descriptions>
        <Descriptions.Item label="??????????????????">{ arr.length }</Descriptions.Item>
      </Descriptions>
    </PageHeader>
    <Table dataSource={arr}>
      <ColumnGroup title="????????????">
        <Column title="??????" dataIndex="title" key="title" />
        <Column title="????????????" dataIndex="writers" key="writers"
          render={(_, record)=>(
              <div>
                { record.writers[0] }
              </div>
          )}
        />
        <Column
            title="????????????"
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
        <Column title="??????" dataIndex="thesisType" key="thesisType" />
      </ColumnGroup>
      <ColumnGroup title="??????">
        <Column title="?????????" dataIndex="publisher" key="publisher" />
        <Column title="????????????" dataIndex="publishMeeting" key="publishMeeting" />
      </ColumnGroup>
      <Column
          title="??????"
          key="action"
          render={(value, record, index) => (
              <Space size="middle">
                <Button type="link">
                  <Link to={"/detail/"+record.id} state={{
                    userid: userid,
                    directions: record.path,
                  }}>??????</Link>
                </Button>
              </Space>
          )}
      />
    </Table>
    </>
}

let contents = [];

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('??????', '1', <CloudOutlined />),
  getItem('????????????', 'sub1', <CopyOutlined />, [
    getItem('????????????', '2'),
    getItem('????????????', '3'),
  ]),
  getItem('????????????', 'sub2', <BarChartOutlined />, [
    getItem('????????????', '4'),
    getItem('????????????', '5'),
  ]),
  getItem('????????????', 'sub3', <UserOutlined />, [
    getItem('?????????', '6'),
    getItem('????????????', '7'),
  ]),
  getItem('????????????', '8', <SearchOutlined />),
];

function setContent(id, name) {
  contents[0] = <Latest id={id}/>;
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
    loaded: false,
    result: '',
    clicked: false,
  };

  onCollapse = (collapsed) => {
    let ele = document.getElementById('logInfo');
    if(collapsed) ele.style.display='none';
    else ele.style.removeProperty('display');
    this.setState({
      collapsed,
    });
  };

  onClick = (key) => {
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

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  onFinish = async (values) => {
    if(!values['title'] && !values['directionName'] && !values['thesisType']
        && !values['overview'] && !values['name'] && !values['userName']
        && !values['publishMeeting']) {
      message.warning("???????????????????????????!");
      setTimeout(window.location.reload(), 10000);
    }
    // ??????????????????, ??????????????????
    let that = this;
    await axios.post('http://localhost:8080/admin/select', values)
        .then(function (response) {
          that.setState({ result: response.data, loaded: true });
        })
        .catch(err => console.log(err));
  };

  render() {
    const MySkeleton = () => {
      return <>
        <Skeleton active/>
        <Skeleton active/>
        <Skeleton active/>
        <Skeleton active/>
        <Skeleton active/>
      </>
    }
    const { collapsed, num, isFocus } = this.state;
    setContent(this.state.id, this.state.username);
    if(this.state.clicked) {
      this.state.loaded ? contents[7] = <SearchResult lists={this.state.result}/>
          : contents[7] = <MySkeleton/>;
    }

    return (
        <>
        <Layout
            style={{
              minHeight: '100vh',
            }}
        >
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="content">
              <Name id={this.state.id}/>
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
                  title="????????????"
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
                      label="????????????"
                      name="title"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                      label="????????????"
                      name="directionName"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                      label="????????????"
                      name="thesisType"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                      label="????????????"
                      name="overview"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                      label="??????"
                      name="name"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                      label="?????????"
                      name="userName"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                      label="??????"
                      name="publishMeeting"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" onClick={()=>{ this.setState({
                      clicked: true,
                      loaded: false,
                    }) }}>
                      ??????
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
              ??????In ??2022 Created by ECNUer
            </Footer>
          </Layout>
        </Layout>
          <Affix offsetBottom={10}>
            <Tooltip title="?????????">
              <Button type="primary" shape="circle" icon={<PlusOutlined />}
                      size="large" style={{ position: "absolute", bottom: 80, right: 80}}
                      onClick={this.quickNew}/>
            </Tooltip>
          </Affix>
        </>
    );
  }
}

export default App;