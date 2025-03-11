
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Menu,
    Card,
    Row,
    Col,
    Typography,
    Table,
    Button,
    Input
 } from 'antd';

import { useNavigate } from 'react-router-dom';
import { HomeOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

function Dashboard() {
  const [selectedKey, setSelectedKey] = useState('home');
  const [activeMembers, setActiveMembers] = useState([]);
  const [searchText, setSearchText] = useState('');


  const navigate = useNavigate();
  const token = localStorage.token;
  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (selectedKey === 'activeMembers') {
      fetchActiveMembers();
    }
  }, [selectedKey]);

  const fetchActiveMembers = async () => {
    try {
      const response = await api.get('/api/members');
      const activeMembersData = response.data.filter(member => member.active);
      setActiveMembers(activeMembersData);
    } catch (error) {
      console.error('Error fetching active members:', error);
    }
  };


  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };


  const handleEdit = (record) => {
    console.log('Edit:', record);
  };

  const handleDelete = (record) => {
    console.log('Delete:', record);
  };


  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredMembers = activeMembers.filter(member =>
    member.name.toLowerCase().includes(searchText)
  );


  const columns = [
    {
        title: '#',
        dataIndex: 'number',
        key: 'number',
        render: (text, record, index) => index + 1
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
        title: 'Options',
        key: 'options',
        render: (text, record) => (
          <>
            <Button type="primary" onClick={() => handleEdit(record)}>Edit</Button>
            <Button type="primary" danger onClick={() => handleDelete(record)} style={{ marginLeft: 8 }}>Delete</Button>
          </>
        )
      }
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return (
          <>
            <Title level={2}>Dashboard Home</Title>
            <Row gutter={[16, 16]}>
              <Col span={8}><Card title="Total Users" variant="outlined">1,234</Card></Col>
              <Col span={8}><Card title="Active Projects" variant="outlined">42</Card></Col>
              <Col span={8}><Card title="Revenue" variant="outlined">$56,789</Card></Col>
            </Row>
          </>
        );
      case 'activeMembers':
        return (
          <>
            <Title level={2}>Active choir members</Title>
            <Search
                placeholder="Search by name"
                onSearch={handleSearch}
                style={{ marginBottom: 16, width: '30%', float: 'right' }}
             />
            <Table dataSource={activeMembers} columns={columns} rowKey="id"  style={{ width: '70vw' }} />
          </>
        );
      case 'settings':
        return (
          <>
            <Title level={2}>Settings</Title>
            <Card title="User Settings" variant="outlined">
              <Text>Settings Form Placeholder</Text>
            </Card>
          </>
        );
      default:
        return <Title level={2}>Select a menu item</Title>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" collapsible>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} onClick={handleMenuClick}>
          <Menu.Item key="home" icon={<HomeOutlined />}>Home</Menu.Item>
          <Menu.Item key="activeMembers" icon={<BarChartOutlined />}>Active Members</Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>Settings</Menu.Item>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            style={{ left: 20, top: 20, width: '80%' }}
            onClick={handleLogout}
            >
            Logout
            </Button>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', width: '70vw', margin: 'auto' }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
