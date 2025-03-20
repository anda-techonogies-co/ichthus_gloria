import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card,Row, Col, Typography, DatePicker, Select } from 'antd';


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const Stats = (props) => {

  const { choirStats, children } = props;
  const { attendanceStats, allMembers } = choirStats || {};

  const options = {
    tooltip: { trigger: 'item' },
    color: ['#1BA355','#B92821'],
    series: [
      {
        name: 'Attendance',
        type: 'pie',
        radius: '60%',
        data:  attendanceStats?.length && attendanceStats
      }
    ],

  };

  return (
    <>
    <Title level={2}>Stats</Title>

    <Row gutter={[16, 16]}>
        <Col span={8}><Card title="Total Members" variant="outlined">{allMembers?.totalMembers}</Card></Col>
        <Col span={8}><Card title="Active Members" variant="outlined">{allMembers?.activeMembers}</Card></Col>
        <Col span={8}><Card title="Inactive Members" variant="outlined">{allMembers?.inactiveMembers}</Card></Col>
    </Row>
    <Card title="Attendance" style={{marginTop: '100px'}}>
        {children}
        <Row>
            <Col span={12}>
                <ReactECharts option={options} />
            </Col>
        </Row>
    </Card>
    </>
  );
};

