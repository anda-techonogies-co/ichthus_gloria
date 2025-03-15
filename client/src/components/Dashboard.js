
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Menu,
    Typography,
    Table,
    Button,
    Input,
    Modal,
    DatePicker,
    Checkbox,
    Select,
    Row,
    Col,
    Space,
    Form,
    message
 } from 'antd';

import {useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  BarChartOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  PlusOutlined,
  EditOutlined,
}from '@ant-design/icons';
import moment from 'moment';

import * as emoji from 'node-emoji'
import axios from 'axios';
import { Stats } from './Stats';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

function Dashboard() {
  const [selectedKey, setSelectedKey] = useState('home');
  const [activeMembers, setActiveMembers] = useState([]);
  const [choirSessions, setChoirSessions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [selectSessionType, setSelectSessionType] = useState('');
  const [editSessionType, setEditSessionType] = useState('');
  const [editMemberId, setEditMemberId] = useState(null);
  const [editMemberAttended, setEditMemberAttended] = useState(null);
  const [editAttendanceModalVisible, setEditAttendanceModalVisible] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [editSessionDate, setEditSessionDate] = useState(null);
  const [loading, setLoading] = useState(false)

  const [choirStats, setChoirStats] = useState({})

  const [messageApi, contextHolder] = message.useMessage();


  const [searchText, setSearchText] = useState('');

  const [sessionAttendeeSearchText, setSessionAttendeeSearchText] = useState('');

  const errorMsg = (msg) =>{
    messageApi.open({
      type: 'error',
      content: msg
    })
  }

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
    }else if(selectedKey === 'choirSessions'){
      fetchChoirSessions()
    }
  }, [selectedKey]);

  useEffect(() => {
    if (isModalVisible) {
      const initialSelection = activeMembers.reduce((acc, member) => {
        acc[member._id] = true;
        return acc;
      }, {});
      setSelectedMembers(initialSelection);
    }
  }, [isModalVisible, activeMembers]);


  useEffect(()=>{
    getChoirStats();
  },[])

  const getChoirStats = async () =>{
    const response = await api.get('/api/stats');
    setChoirStats(response.data);
  }

  const fetchActiveMembers = async () => {
    try {
      const response = await api.get('/api/members');
      const activeMembersData = response.data.filter(member => {
        return member.active && member.isAdmin === false;
      });
      setActiveMembers(activeMembersData);
    } catch (error) {
      console.error('Error fetching active members:', error);
    }
  };

  const fetchChoirSessions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/choir-sessions');
      const choirSessionData = response.data;
      setChoirSessions(choirSessionData);
    } catch (error) {
      console.error('Error fetching active members:', error);
    }finally{
      setLoading(false);

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

  const handleSessionAttendeeSearch = (value) => {
    setSessionAttendeeSearchText(value.toLowerCase());
  };

  const showModal = async () => {
    await fetchActiveMembers();
    setIsModalVisible(!isModalVisible);
  };

  const handleCancel = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSelectedDate = (value) => {
    setSelectedDate(value);
  };

  const handleEditSessionDate = (value) => {
    setEditSessionDate(value);
  };

  const toggleMemberSelection = (id) => {
    setSelectedMembers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


  const handleSelectSessionType = (value) => {
    setSelectSessionType(value);
  };

  const handleEditSessionType = (value) => {
    setEditSessionType(value);
  };

  const handleEditMemberAttended= (value) => {
    setEditMemberAttended(value);
  };

  let filteredMembers = activeMembers.filter(member =>
    member.name.toLowerCase().includes(searchText)
  );

  let transformedChoirSessionData = choirSessions.flatMap(session =>
    session.members.map(member => ({
      key: member._id,
      member: member.member,
      sessionType: session.sessionType,
      sessionDate: session.sessionDate,
      memberAttended: member.hasAttended
    }))
  );

  const filteredTransformedSessionData = transformedChoirSessionData.filter(({ member }) => {
    if (!member || !member.name) return false;
    return member.name.toLowerCase().includes(sessionAttendeeSearchText.toLowerCase());
  });

  const showEditSessionModal = async () => {

    setEditModalVisible(!editModalVisible);

    let {sessionDate, sessionType} = choirSessions[0]

    setEditSessionDate(sessionDate ? moment(sessionDate) : null);
    setEditSessionType(sessionType);

  };

  const showEditAttendanceModal = (record) => {
    setEditAttendanceModalVisible(true);
    setMemberName(record.member.name);
    setEditMemberAttended(record.memberAttended);
    setEditMemberId(() => record.member._id);
  };

  const submitEditedSession = async () =>{

    const sessionId = choirSessions[0]?._id;

    const data = {
      sessionDate: editSessionDate,
      sessionType: editSessionType,
      memberId: editMemberId,
      hasAttended: editMemberAttended
    }
    try {
      await api.patch(`/api/choir-sessions/${sessionId}`, {data});

      if(editModalVisible){
        setEditModalVisible(!editModalVisible);
      }

      if(editAttendanceModalVisible){
        setEditAttendanceModalVisible(!editAttendanceModalVisible);
      }


      await fetchChoirSessions();
    } catch (error) {
      console.log(error)
    }
  }

  const closeEditModal = async () => {
    setEditModalVisible(!editModalVisible);
  };

  const closeEditAttendanceModal = async () => {
    setEditAttendanceModalVisible(!editAttendanceModalVisible);
  };


  const submitNewSession = async () => {

    if (!selectSessionType || selectedMembers.length === 0 || !selectedDate) {
      console.log("Please select a session type, a date, and at least one member.");
      return;
    }

    const formattedDate = selectedDate.format('YYYY-MM-DD');

    const data = {
      sessionType: selectSessionType,
      sessionDate: formattedDate,
      members: Object.keys(selectedMembers).map(memberId => ({
        member: memberId,
        hasAttended: selectedMembers[memberId]
      }))
    };


    try {
      const response = await api.post('/api/choir-sessions', {data});

      if (response.status !== 201) {
        throw new Error('Failed to create session');
      }

      handleCancel();
      await fetchChoirSessions()

      // Reset modal inputs
      setSelectSessionType(null);
      setSelectedMembers([]);
      setSelectedDate(null);
      setIsModalVisible(false);

    } catch (error) {
      console.log('error here',error);
      console.log("Something went wrong!");
    }
  };


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



  const choirSessionColumns = [
    {
      title: 'Member Name',
      dataIndex: 'member',
      key: 'member',
      render: (member) => member?.name || 'Unknown'
    },
    {
      title: 'Session Type',
      dataIndex: 'sessionType',
      key: 'sessionType',
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    },
    {
      title: 'Session Date',
      dataIndex: 'sessionDate',
      key: 'sessionDate',
      render: (text) => {

        if (!text) return 'No Date';

        const date = new Date(text);
        if (isNaN(date)) return 'Invalid Date';

        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);

      }
    },
    {
      title: 'Attended',
      dataIndex: 'memberAttended',
      key: 'memberAttended',
      render: (attended) => attended ? '✅' : '❌'
    },
    {
      title: 'Options',
      key: 'options',
      render: (text, record) => (
        <>
          <Button type="primary" onClick={() => showEditAttendanceModal(record)}>Edit</Button>
        </>
      )
    }
  ];

  const choirData = {
    choirStats,
    startDate,
    endDate,
    sessionType,
  }

  const renderContent = () => {

    switch (selectedKey) {
      case 'home':
        return (
          <Stats>
             <Row gutter={17}>
                <Col span={6}>
                  <RangePicker
                      placeholder="Select date"
                      style={{ width: '100%', marginBottom: 16 }}
                      // value={selectedDate}
                      // onChange={handleSelectedDate}
                      />
                  </Col>
                  <Col span={6}>
                      <Select
                          // value={selectSessionType}
                          placeholder="Session type"
                          // onChange={handleSelectSessionType}
                          options={[
                          { value: 'rehearsal', label: 'Rehearsal' },
                          { value: 'prayer', label: 'Prayer' }
                          ]}
                          style={{width: '100%',  marginBottom: 16}}
                    />
                  </Col>
              </Row>
          </Stats>
        )


      case 'activeMembers':
        return (
          <>
            <Title level={2}>Active choir members</Title>
            <Search
                placeholder="Search member"
                onSearch={handleSearch}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: '30%', float: 'right' }}
             />
            <Table dataSource={filteredMembers} columns={columns} rowKey="id"  style={{ width: '70vw' }} />
          </>
        );
      case 'choirSessions':
        return (
          <>
            <Title level={2}>Choir Session</Title>
            <Search
                  placeholder="Search member"
                  onSearch={handleSessionAttendeeSearch}
                  value={sessionAttendeeSearchText}
                  onChange={(e) => setSessionAttendeeSearchText(e.target.value)}
                  style={{ marginBottom: 16, width: '30%', float: 'right' }}
                />
             <Space >
              <Button
                  variant="solid"
                  color="green"
                  onClick={showModal}
                  icon={<PlusOutlined />}
                  >
                    Add session
                  </Button>

              <Button
                  type="primary"
                  onClick={showEditSessionModal}
                  icon={<EditOutlined />}
                  >
                    Edit session
                  </Button>
             </Space>

            <Table
                dataSource={filteredTransformedSessionData}
                columns={choirSessionColumns}
                rowKey="id"
                style={{ width: '70vw' }}
                loading={loading}
                />

            <Modal
                title="Add Session"
                open={isModalVisible}
                onOk={submitNewSession}
                onCancel={handleCancel}
                width={650}
                >
              <Select
                value={selectSessionType}
                placeholder="Session type"
                onChange={handleSelectSessionType}
                options={[
                  { value: 'rehearsal', label: 'Rehearsal' },
                  { value: 'prayer', label: 'Prayer' }
                ]}
                style={{width: '100%',  marginBottom: 16}}

              />
              <DatePicker
                  placeholder="Select date"
                  style={{ width: '100%', marginBottom: 16 }}
                  value={selectedDate}
                  onChange={handleSelectedDate}
                />
                <Search
                  placeholder="Search member"
                  onSearch={handleSearch}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ marginBottom: 16, width: '100%', float: 'right' }}
                />

              <Text style={{margin:'20px 0px', fontWeight: 'bold' }}>Attendance list</Text>

              <div style={{ maxHeight: '250px', overflowY: 'auto', marginTop:'19px' }}>
                {filteredMembers.map(member => (
                  <div key={member._id} style={{marginBottom: '10px'}}>
                    <Checkbox checked={!!selectedMembers[member._id]}
                      onChange={() => toggleMemberSelection(member._id)}>{member.name}</Checkbox>
                  </div>
                ))}
              </div>
            </Modal>

              {/* Edit session general info */}
            <Modal
                  title="Edit Session"
                  open={editModalVisible}
                  onOk={submitEditedSession}
                  onCancel={closeEditModal}
                  >
                    <DatePicker
                      style={{ width: '100%', marginBottom: 16 }}
                      value={editSessionDate}
                      onChange={handleEditSessionDate}
                  />

                <Select
                  placeholder="Session type"
                  value={editSessionType}
                  onChange={handleEditSessionType}
                  options={[
                    { value: 'rehearsal', label: 'Rehearsal' },
                    { value: 'prayer', label: 'Prayer' }
                  ]}
                  style={{width: '100%',  marginBottom: 16}}

                />

              </Modal>

            {/* Edit member attendance */}
            <Modal
                title="Edit member attendance "
                open={editAttendanceModalVisible}
                onOk={submitEditedSession}
                onCancel={closeEditAttendanceModal}
                >
                <Form>
                  <Form.Item label="Name" labelCol={{span: 24}}>
                      <Input
                        value={memberName}
                        contentEditable={false}
                        />
                    </Form.Item>

                    <Form.Item label="Attended" labelCol={{span: 24}}>
                        <Select
                        value={editMemberAttended}
                        onChange={handleEditMemberAttended}
                        options={[
                          { value: true, label: 'Yes' },
                          { value: false, label: 'No' }
                        ]}
                        style={{width: '100%',  marginBottom: 16}}

                      />
                    </Form.Item>
                </Form>
              </Modal>
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
          <Menu.Item key="choirSessions" icon={<ScheduleOutlined />}>Choir sessions</Menu.Item>
          <Menu.Item
            type="default"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            >
            Logout
            </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', width: '70vw', margin: 'auto' }}>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
