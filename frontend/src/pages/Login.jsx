import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Call dummy API from Backend (port 8000)
      const response = await axios.post('http://localhost:8000/login', values);

      // Save token in LocalStorage
      localStorage.setItem('token', response.data.access_token);

      message.success('Login successfully!');
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Connecting failed to server!';
      message.error(errorMsg);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', background: '#f0f2f5'
    }}>
      <Card style={{ width: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>STUDENT MGMT</Title>
          <span style={{ color: '#8c8c8c' }}>Login to access system</span>
        </div>

        <Form name="login_form" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username is required!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username (admin)" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password is required!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password (123456)" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;