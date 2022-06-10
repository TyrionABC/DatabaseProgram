import React, {useState} from "react";
import {Button, FlexboxGrid, Content, Container, Panel, Form, ButtonToolbar, Schema, ButtonGroup} from "rsuite";
import { message } from "antd";
import "rsuite/dist/rsuite.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './intro.css';
import {useSpring, animated, config} from 'react-spring'
import CryptoJS from 'crypto-js';
import { useNavigate } from "react-router";
import axios from "axios";

function Intro() {
  return <div className="mx-auto w-100 login-center">
      <Navi/>
    </div>
}

function Navi() {
  const [flip, set] = useState(false);
  const fading = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0.3 },
    reset: true,
    reverse: flip,
    delay: 50,
    config: config.molasses,
    onRest: () => set(!flip),
  });

  const [formValue, setValue] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  const formRef = React.useRef();

  const model = Schema.Model({
    name: Schema.Types.StringType().isRequired('请填写用户名').maxLength(12, "用户名最长为12位"),
    email: Schema.Types.StringType().isEmail('请填写正确的邮箱').isRequired("请填写邮箱"),
    password: Schema.Types.StringType().isRequired('请填写密码').minLength(8, "请输入至少8位的密码")
  });

  let data = {
    name: formValue["name"],
    permission: 'allowed',
    email: formValue["email"],
  };

  let navigate = useNavigate();

  function loginHandle() {
    // 密码账号验证， 发送 formValue 数据
    let psw = CryptoJS.MD5(formValue['password']).toString();
    // 验证
    let value = {
        name: formValue['name'],
        userId: formValue['email'],
        password: psw,
      };
    axios.post('http://localhost:8080/admin/login', value)
        .then(function (response) {
          console.log("response: ", response);
          const correct = response['data'];
          if(correct===1) {
            navigate('/app', { replace: true, state: data });
          }
          if(correct===2){
            navigate('/admin',{replace:true, state:data});
          }
          if(correct===0) {
            message.error("密码或用户名错误!");
          }
        })
        .catch(err => console.log(err))
  }

  function password_handle(content) {
    window.location.href = window.location.href + "reset?content=" + content;
  }

  return <Container>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={6}>
            <animated.h1 style={fading} className="fw-bolder">论文In</animated.h1>
            <h4>
              你的论文管理小助手
            </h4>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6}>
            <Panel header={<h3>登陆</h3>} bordered>
              <Form fluid model={model} ref={formRef} onChange={setValue} formValue={formValue}>
                <Form.Group>
                  <Form.ControlLabel>用户名</Form.ControlLabel>
                  <Form.Control name="name"/>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>邮箱</Form.ControlLabel>
                  <Form.Control name="email"/>
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>密码</Form.ControlLabel>
                  <Form.Control name="password" type="password" autoComplete="off" />
                </Form.Group>
                <Form.Group>
                  <ButtonToolbar>
                    <ButtonGroup>
                      <Button appearance="primary" type="submit" onClick={ ()=>loginHandle() }>开始</Button>
                      <Button appearance="ghost" onClick={ ()=>password_handle("register") }>注册</Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
}

export default Intro;
