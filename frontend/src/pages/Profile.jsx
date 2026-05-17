import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { Card, Tag, Spin, Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/v1/auth/me')
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  if (!user) return <Result status="403" title="Access Denied" subTitle="Failed to fetch profile." />;

  return (
    <div style={{ padding: '50px' }}>
      <Card title="User Profile (Auth Test)" style={{ width: 400, margin: '0 auto', textAlign: 'center' }}>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Role:</strong> <Tag color="blue">{user.role}</Tag></p>
        <hr />
        <Button type="primary" onClick={() => navigate(-1)}>Go Back</Button>
      </Card>
    </div>
  );
};

export default Profile;
