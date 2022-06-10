import React  from "react";
import {Button, Schema, Form, FlexboxGrid, ButtonToolbar } from "rsuite";
import { message } from "antd";
import "rsuite/dist/rsuite.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import CryptoJS from "crypto-js";
import axios from 'axios';

const code = Math.random().toString().slice(-6);

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('请填写此字段'),
  email: StringType()
      .isEmail('请填写正确的邮箱')
      .isRequired('请填写此字段'),
  password: StringType().isRequired('请填写此字段').minLength('8'),
  verifyPassword: StringType()
      .addRule((value, data) => {
        if (value !== data.password) {
          return false;
        }
        return true;
      }, '两次输入的密码不一致')
      .isRequired('请填写此字段'),
});

const TextField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
      <Form.Group controlId={`${name}-4`} ref={ref}>
        <Form.ControlLabel>{label} </Form.ControlLabel>
        <Form.Control name={name} accepter={accepter} {...rest} />
      </Form.Group>
  );
});

function getQueryVariable(variable)
{
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] === variable){return pair[1];}
  }
  return false;
}

const Reset = () => {
  let target = getQueryVariable("content");
  if(target === "reset") target = "忘记密码";
  else if(target === "register") target = "新用户注册";
  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    name: '',
    email: '',
    password: '',
    verifyPassword: '',
    verifyCode: ''
  });

  function correctCode() {
    if(formValue['verifyCode'].legnth < 6 || code === formValue['verifyCode']) return true;
    else return false;
  }

  const handleSubmit = () => {
    if (!formRef.current.check() || !correctCode()) {
      console.error('Form Error');
      message.error("输入有误!");
      return;
    }
    let psw = CryptoJS.MD5(formValue['password']).toString(); // AES 加密
    let value = {
      userId: formValue['email'],
      password: psw,
      name: formValue['name'],
    }
    axios.post('http://localhost:8080/admin/register', value)
        .then(function (response) {
          console.log('response: ', response);
          const success = response['data'];
          if (success) {
            message.success("操作成功!");
            window.history.go(-1);
          } else {
            message.error("操作失败, 请重试!");
          }
        })
        .catch(err => console.log(err));
  };

  const handleCheckEmail = (e) => {
    if(!formRef.current.check()) {
      message.error("输入有误!");
      return;
    }
    e.preventDefault();
    let btn = document.getElementById('verify');
    let time = 60;
    let t;
    function changebtn() {
      if(time > 0) {
        btn.disabled = true;
        btn.innerText = time + '秒后重试';
        time = time - 1;
      }
      else {
        btn.disabled = false;
        btn.innerText = '发送验证码';
        clearInterval(t);
      }
    }
    t = setInterval(changebtn, 1000);
    const emailjs = require('emailjs-com');
    emailjs.init('dCuY5YQJSTmrg2Q2l');
    let params = {
      message: code,
      to_mail: formValue['email'],
      to_name: formValue['name']
    }
    emailjs.send("service_t6mvxxp", "template_kr1di1f", params)
        .then(function (response) {
          console.log('success');
        }, function (error) {
          console.log('failed');
          message.error('发送失败');
        });
  };

  return (
      <div className="w-50 h-50 mx-auto mt-5">
      <FlexboxGrid>
        <FlexboxGrid.Item  className="mt-5 mx-auto">
          <Form
              ref={formRef}
              onChange={setFormValue}
              onCheck={setFormError}
              formValue={formValue}
              model={model}
          >
            <h3 className="mb-5">{ target }</h3>
            <TextField name="name" label="用户名" />
            <TextField name="email" label="邮箱" />
            <TextField name="password" label="密码" type="password" autoComplete="off" />
            <TextField
                name="verifyPassword"
                label="验证密码"
                type="password"
                autoComplete="off"
            />
            <TextField name="verifyCode" label="验证码" autoComplete="off" />

            <ButtonToolbar>
              <Button appearance="primary" onClick={handleSubmit}>
                提交
              </Button>
              <Button onClick={handleCheckEmail} id='verify'>发送验证码</Button>
            </ButtonToolbar>
          </Form>
        </FlexboxGrid.Item>

      </FlexboxGrid>
      </div>
  );
};

export default Reset;