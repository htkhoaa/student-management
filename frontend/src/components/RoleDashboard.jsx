import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Space } from 'antd';

const { Title } = Typography;

const RoleDashboard = ({ role }) => {
  const navigate = useNavigate();

  const config = {
    ADMIN: {
      icon: '🎉',
      title: 'Admin Portal',
      desc: 'Welcome, Administrator. You can manage students here.',
    },
    STUDENT: {
      icon: '🎓',
      title: 'Student Profile',
      desc: 'Welcome, Student. You can view your grades here.',
    },
  };

  const content = config[role] || config.STUDENT;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title>{content.icon} {content.title}</Title>
      <p>{content.desc}</p>

      <Space>
        <Button type="default" onClick={() => navigate('/profile')}>
          View Profile (Test Auth)
        </Button>
        <Button type="primary" danger onClick={handleLogout}>
          Log out
        </Button>
      </Space>
    </div>
  );
};

export default RoleDashboard;