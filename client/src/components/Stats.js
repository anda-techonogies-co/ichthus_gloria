import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card,Row, Col, Typography, DatePicker, Select } from 'antd';


const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export const Stats = (props) => {

  const { choirStats, children } = props;

  const options = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Attendance',
        type: 'pie',
        radius: '60%',
        data: choirStats
      }
    ],

  };

  return (
    <>
    <Title level={2}>Stats</Title>

    <Row gutter={[16, 16]}>
        <Col span={8}><Card title="Total Members" variant="outlined">1,234</Card></Col>
        <Col span={8}><Card title="Active Members" variant="outlined">42</Card></Col>
        <Col span={8}><Card title="Inactive Members" variant="outlined">$56,789</Card></Col>
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

