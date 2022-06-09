import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Space, Table, Input, Button, PageHeader, Descriptions, Tabs, List } from 'antd';
import "rsuite/dist/rsuite.min.css";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import './Thesis.css';
import axios from 'axios';
import SeeThesis from "./SeeThesis";
import {Link} from "react-router-dom";

export class Latest extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    data: '',
    id: '',
  };

  constructor(props) {
    super(props);
    this.state = { id: props.id };
    this.getLatest();
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`查询 ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
            >
              查询
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              重置
            </Button>
            <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  this.setState({
                    searchText: selectedKeys[0],
                    searchedColumn: dataIndex,
                  });
                }}
            >
              过滤
            </Button>
          </Space>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
        record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
        this.state.searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        ) : (
            text
        ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getLatest() {
    axios.get('http://localhost:8080/admin/paper')
        .then(response => {
          response = response.data;
          this.setState ({
            data: response,
          });
        })
        .catch(err => console.log(err));
  }

  render() {
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: '12%',
        ...this.getColumnSearchProps('title'),
        render: (_, record) => (
            <Button type="link">
              <Link to={"/detail/"+record.id} state={{userid: this.state.id}}>
                { record.title }
              </Link>
            </Button>
        )
      },
      {
        title: '作者',
        dataIndex: 'writer',
        key: 'writer',
        width: '12%',
        ...this.getColumnSearchProps('writer'),
      },
      {
        title: '发布日期',
        dataIndex: 'thesisDate',
        key: 'thesisDate',
        width: '12%',
        ...this.getColumnSearchProps('thesisDate'),
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
        width: '8%',
        ...this.getColumnSearchProps('publisher'),
      },
      {
        title: '论文类型',
        dataIndex: 'thesisType',
        key: 'thesisType',
        width: '8%',
        ...this.getColumnSearchProps('thesisType'),
      },
      {
        title: '研究方向',
        dataIndex: 'path',
        key: 'path',
        width: '28%',
        ...this.getColumnSearchProps('path'),
      },
      {
        title: '发布会议',
        dataIndex: 'publishMeeting',
        key: 'publishMeeting',
        width: '12%',
        ...this.getColumnSearchProps('publishMeeting'),
      },
      {
        title: '点赞数',
        dataIndex: 'like',
        key: 'like',
        width: '8%',
        ...this.getColumnSearchProps('like'),
        sorter: (a, b) => a.like - b.like,
        sortDirections: ['descend', 'ascend'],
      },
    ];
    const routes = [
      {
        breadcrumbName: '/首页',
      },
    ];

    function CurentTime() {
      var now = new Date();

      var year = now.getFullYear();       //年
      var month = now.getMonth() + 1;     //月
      var day = now.getDate();            //日

      var hh = now.getHours();            //时
      var mm = now.getMinutes();          //分
      var ss = now.getSeconds();          //秒

      var clock = year + "-";

      if(month < 10)
        clock += "0";

      clock += month + "-";

      if(day < 10)
        clock += "0";

      clock += day + " ";

      if(hh < 10)
        clock += "0";

      clock += hh + ":";
      if (mm < 10) clock += '0';
      clock += mm + ":";

      if(ss < 10) clock += '0';

      clock += ss;
      return(clock);
    }
    console.log(this.state.data);
    return <>
        <PageHeader style={{background: '#fff'}} title="最新文章" breadcrumb={{ routes }}>
          <Descriptions>
            <Descriptions.Item label="更新时间">{ CurentTime() }</Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <Table className="site-layout-content" columns={columns} dataSource={this.state.data} />
      </>
  }
}