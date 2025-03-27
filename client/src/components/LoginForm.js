import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Form, Input, Button, Typography, notification, Card, Row, Col } from 'antd';

const { Title, Text } = Typography;

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const handleSubmit = async (values) => {
    const { email, password } = values;
    setLoading(true);
    setError('');

    try {
      const {data} = await api.post('/api/v1/auth/login', { email, password });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMsg);
      notification.error({
        message: 'Login Error',
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: '100vh', backgroundColor: '#f5f5f5' }}>
      <Col xs={24} sm={20} md={12} lg={8} xl={6}>
        <Card variant={"outlined"} style={{ borderRadius: 8, padding: 24, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
          {error && <Text type="danger">{error}</Text>}

          <Form name="login" initialValues={{ remember: true }} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                 iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
            </Form.Item>

            {/* <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#" style={{ color: '#1890ff' }}>Forgot password?</a>
            </Row> */}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form.Item>
          </Form>

          {/* <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text>Don't have an account? <a href="/signup" style={{ color: '#1890ff' }}>Sign up</a></Text>
          </div> */}
        </Card>
      </Col>
    </Row>
  );
}

export default LoginForm;
