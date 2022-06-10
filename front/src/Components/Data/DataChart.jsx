import React from "react";
import ReactECharts from 'echarts-for-react';
import myChart from "echarts-for-react";
import '../Thesis/Thesis.css'
import {Descriptions, PageHeader} from "antd";
import axios from "axios";
import {CalculatorOutlined} from "@ant-design/icons";

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

export class GetContentData extends React.Component {
  state = {
    data: [],
    id: '',
  }

  constructor(props) {
    super(props);
    this.state = { data: [], id: props.id };
  }

  componentDidMount() {
    let that = this;
    axios({
      method: 'post',
      url: 'http://localhost:8080/admin/LikeAndDirection',
      data: { userId: this.state.id },
    }).then(function(res) {
      console.log(res.data);
      that.setState({
        data: res.data,
      })
    })
  }

  render() {
    const routes = [
      {
        breadcrumbName: '数据中心',
      },
      {
        breadcrumbName: '内容数据',
      }
    ];
    return <>
      <PageHeader style={{background: '#fff'}} title="近期文章发布趋势" breadcrumb={{routes}}>
        <Descriptions>
          <Descriptions.Item label="更新时间">{CurentTime()}</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div className="site-layout-content">
        <Category data={this.state.data}/>
        <Counting id={this.state.id}/>
      </div>
    </>
  }
}

class Counting extends React.Component {
  state = {
    data: [],
    id: '',
  }

  constructor(props) {
    super(props);
    this.state = { data: [], id: props.id };
  }

  componentDidMount() {
    let that = this;
    axios({
      method: 'post',
      url: 'http://localhost:8080/admin/DayAndPaper',
      data: { userId: this.state.id },
    }).then(function(res) {
      console.log(res.data);
      that.setState({
        data: res.data,
      })
    })
  }

  setDay() {
    let today = new Date();
    let list = [];
    for(let i = 4; i >= 0; i--) {
      let week = (today.getDay() - (4 - i) + 7) % 7;
      let str;
      if (week === 0) {
        str = "星期日";
      } else if (week === 1) {
        str = "星期一";
      } else if (week === 2) {
        str = "星期二";
      } else if (week === 3) {
        str = "星期三";
      } else if (week === 4) {
        str = "星期四";
      } else if (week === 5) {
        str = "星期五";
      } else if (week === 6) {
        str = "星期六";
      }
      list[i] = str;
    }
    return list;
  }

  reverseData = (array) => {
    let list = [];
    for(let i = 4; i >= 0; i--) {
      list.push(array[i]);
    }
    return list;
  }

  render() {
    let data = this.reverseData(this.state.data);
    let day = this.setDay();
    if(day.length === 0) day[0] = '论文为空'
    const options = {
      title: {
        text: "已发布论文数量"
      },
      xAxis: {
        type: 'category',
        data: day,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
    };

    return <ReactECharts option={options} style={{height: 300}} opts={{renderer: 'svg'}}/>
  }
}

const Category = (props) => {
  let dt = props.data;
  let thesisCount = [];
  let likeCount = [];
  let directions = [];
  console.log(dt[0]);
  for(let i = 0; i < dt.length; i++) {
    directions[i] = dt[i]['direction'];
    likeCount[i] = dt[i]['likes'];
    thesisCount[i] = dt[i]['num'];
  }
  const option = {
    title: {
      text: '研究方向'
    },
    tooltip: {},
    legend: {
      data:['我的论文', '我的点赞']
    },
    xAxis: {
      data: directions
    },
    yAxis: {},
    series: [{
      name: '我的论文',
      type: 'bar',
      data: thesisCount,
    },
      {
        name: '我的点赞',
        type: 'bar',
        data: likeCount,
      }]
  };

  return <ReactECharts
          option={option}
          style={{ height: 300 }}
          opts={{ renderer: 'svg' }}
      />
}

export class GetUniversalData extends React.Component {
  state = {
    data: [],
  }

  constructor() {
    super();
    this.state = { data: [] };
  }

  componentDidMount() {
    let that = this;
    axios({
      method: 'post',
      url: 'http://localhost:8080/admin/MonthAndPaper',
      data: '',
    }).then(function(res) {
      console.log(res.data);
      that.setState({
        data: res.data,
      })
    });
  }

  setData() {
    let date = new Date();
    let list = [];
    let month = date.getMonth();
    month++;
    let val = month;
    for(let i = 11; i >= 0; i--) {
      list[i] = "" + val + "月";
      val--;
      if(val === 0) val+=12;
    }
    return list;
  }

  reverseData = (array) => {
    let list = [];
    for(let i = 11; i >= 0; i--) {
      list.push(array[i]);
    }
    return list;
  }

  render() {
    let data = this.reverseData(this.state.data);
    let month = this.setData();
    let option = {
      title: {
        text: '全站文章发布趋势'
      },
      tooltip: {
        trigger: 'axis',

        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        splitLine: {
          show: false
        },
        data: month
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
      },
      series: [
        {
          name: 'Data',
          type: 'line',
          showSymbol: false,
          data: data
        }
      ]
    };

    const routes = [
      {
        breadcrumbName: '数据中心',
      },
      {
        breadcrumbName: '全站数据',
      }
    ];
    return <>
      <PageHeader style={{background: '#fff'}} title="全站文章发布趋势" breadcrumb={{routes}}>
        <Descriptions>
          <Descriptions.Item label="更新时间">{CurentTime()}</Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div className="site-layout-content">
        <ReactECharts option={option} style={{height: 500}}/>
      </div>
    </>
  }
}