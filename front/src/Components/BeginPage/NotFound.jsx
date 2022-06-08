import React from "react";
import {Button, Result} from "antd";
import {MehOutlined} from "@ant-design/icons";

export default class NotFound extends React.Component {
  render() {
    return <Result
        icon={<MehOutlined />}
        title="404 走错了?"
        extra={<Button type="primary" onClick={() => { window.location.href = "/" }}>返回起始页</Button>}
    />
  }
}