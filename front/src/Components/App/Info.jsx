import React from 'react';
import {Button, Form, Input, PageHeader, Select, Tabs } from 'antd';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Option} from "antd/es/mentions";
import '../Thesis/Thesis.css';
import axios from "axios";
import CryptoJS from "crypto-js";

const { TabPane } = Tabs;

function BasicSet(props) {
  const onFinish = (values) => {
    values.userId = props.id;
    console.log('Success:', values);
    axios.post('http://localhost:8080/admin/updateUser', values)
        .then(function (response) {
          console.log(response);
          if(response.data) {
            alert("修改成功!");
            window.location.reload();
          }
          else {
            alert("修改失败!");
          }
        })
        .catch(err => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
      <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
      >

        <Form.Item
            label="用户名"
            name="name"
            rules={[{ message: '请输入用户名', required: true }]}
        >
          <Input placeholder={props.info.name}/>
        </Form.Item>

        <Form.Item name="gender"
                   label="性别"
                   rules={[{message: '请选择性别', required: true}]}>

          <Select
              placeholder={props.info.gender}
              allowClear
          >
            <Option value="男">男</Option>
            <Option value="女">女</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
            label="学校/单位"
            name="school"
            rules={[{ message: '请输入学校/工作地点', required: true }]}
        >
          <Input placeholder={props.info.school}/>
        </Form.Item>

        <Form.Item name="direction"
                   label="主研究方向"
                   rules={[{message: '请选择研究方向', required: true}]}>
          <Select
              placeholder={props.info.direction}
              allowClear
          >
            <Option value="前端">前端</Option>
            <Option value="后端">后端</Option>
            <Option value="Android">Android</Option>
            <Option value="IOS">IOS</Option>
            <Option value="软件测试">软件测试</Option>
            <Option value="人工智能">人工智能</Option>
            <Option value="机器学习">机器学习</Option>
            <Option value="深度学习">深度学习</Option>
            <Option value="数据库">数据库</Option>
            <Option value="网络安全">网络安全</Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
  );
};

function PrivacySet(props) {
  const onFinish = (values) => {
    console.log('Success:', values);
    let jsonVal = {
      userId: props.id,
      password: CryptoJS.MD5(values['newPassword']).toString(),
    }
    axios.post('http://localhost:8080/admin/update', jsonVal)
        .then(function (response) {
          console.log(response);
          if(response.data) {
            alert("修改成功!");
            window.location.reload();
          }
        })
        .catch(err => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const psw = props.info.password;
  return <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 8 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
  >
    <Form.Item
      name="originPassword"
      label="原密码"
      rules={[
        {
          required: true,
          message: '请输入原密码',
        },
        ({getFieldValue}) => ({
          validator(_, value) {
            if(CryptoJS.MD5(getFieldValue('originPassword')).toString() === psw) {
              return Promise.resolve();
            }
            else return Promise.reject(new Error('原密码输入错误'));
          }
        })
      ]}
      hasFeedback
    >
      <Input.Password/>
    </Form.Item>

    <Form.Item
        name="newPassword"
        label="新密码"
        rules={[
          {
            required: true,
            message: '请输入新密码!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if(getFieldValue('newPassword').length <= 8) {
                return Promise.reject(new Error('密码的长度至少为8位'));
              }
              else return Promise.resolve();
            }
          })
        ]}
        hasFeedback
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
        name="confirmPassword"
        label="确认密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请输入确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致!'));
            },
          }),
        ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    </Form.Item>
  </Form>
}

function DoSet(props) {
  return <div className="site-layout-content">
    <Tabs tabPosition={'left'}>
      <TabPane tab="基本设置" key="1">
        <PageHeader title="基本设置"/>
        <BasicSet info={props.info} id={props.id}/>
      </TabPane>
      <TabPane tab="隐私设置" key="2">
        <PageHeader title="修改密码"/>
        <PrivacySet info={props.info} id={props.id}/>
      </TabPane>
    </Tabs>
  </div>
}

export class BasicInfoSet extends React.Component {
  state = {
    id: this.props.id,
    data: []
  }

  constructor(props) {
    super(props);
    this.state = {id: props.id, data: []};
  }

  componentDidMount() {
    let that = this;
    axios({
      method: 'post',
      url: 'http://localhost:8080/admin/getUserDetails',
      data: { userId: this.state.id },
    }).then(function(res) {
      console.log(res.data);
      that.setState({
        data: res.data,
      })
    })
  }

  render() {
    return <DoSet info={this.state.data} id={this.state.id}/>
  }
}