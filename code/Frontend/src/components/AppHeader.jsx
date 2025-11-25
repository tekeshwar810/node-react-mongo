import React, { useState } from 'react';
import { Layout, Button, Modal, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/userService';
const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();

  const [profileVisible, setProfileVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/login', { replace: true });
  };

  const userDataRaw = localStorage.getItem('userData');
  let username = '';
  try {
    const parsed = JSON.parse(userDataRaw);
    username = parsed?.username || parsed?.name || '';
  } catch (e) {
    username = userDataRaw || '';
  }

  const openProfile = () => setProfileVisible(true);

  const handleProfileSave = async (values) => {
    const payload = { ...values };
    const res = await updateProfile(payload);
    if (res.success) {
      // update localStorage userData
      try {
        const raw = localStorage.getItem('userData');
        const parsed = raw ? JSON.parse(raw) : {};
        const updated = { ...parsed, name: res.data.name || values.name, username: res.data.username || values.username, mobile: res.data.mobile || values.mobile };
        localStorage.setItem('userData', JSON.stringify(updated));
      } catch (e) {}
      message.success('Profile updated');
      setProfileVisible(false);
    } else {
      message.error(res.message || 'Update failed');
    }
  };

  return (
    <Header style={{ display: 'flex', alignItems: 'justify-between', justifyContent: 'space-between', padding: '0 24px' }}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginRight: 24 }}>
        <Link to="/companey" style={{ color: 'inherit' }}>
          MyStore
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {username ? <div style={{ color: '#fff' }}> <span style={{padding:"0px 5px"}}>Welcome</span>{username}</div> : null}
        <Button onClick={openProfile} type="default">
          Profile
        </Button>
        <Button onClick={handleLogout} type="primary">
          Logout
        </Button>
      </div>

      <Modal
        title="Edit Profile"
        open={profileVisible}
        onCancel={() => setProfileVisible(false)}
        footer={null}
      >
        <Form
          initialValues={{
            name: (JSON.parse(localStorage.getItem('userData') || '{}')).name || '',
            username: (JSON.parse(localStorage.getItem('userData') || '{}')).username || '',
            mobile: (JSON.parse(localStorage.getItem('userData') || '{}')).mobile || '',
          }}
          layout="vertical"
          onFinish={handleProfileSave}
        >
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Username">
            <Input />
          </Form.Item>
          {/* <Form.Item name="mobile" label="Mobile">
            <Input />
          </Form.Item> */}
          <Form.Item name="password" label="Password">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
};

export default AppHeader;
