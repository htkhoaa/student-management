import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, Users as UsersIcon, LogOut, Bell, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import axios from '../../api/axiosConfig';

const NAV_STUDENT = [
  { key: 'profile',  label: 'Profile',   icon: User,       path: '/student/profile' },
  { key: 'password', label: 'Password',  icon: KeyRound,   path: '/student/password' },
  { key: 'class',    label: 'My Class',  icon: UsersIcon,  path: '/student/class' },
];

const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={s.inputWrap}>
        <input
          type={show ? 'text' : 'password'}
          style={s.input}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          style={s.eyeBtn}
          onClick={() => setShow(v => !v)}
          tabIndex={-1}
        >
          {show
            ? <EyeOff size={15} color="#bbb" />
            : <Eye size={15} color="#bbb" />}
        </button>
      </div>
    </div>
  );
};

const Password = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();


  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) {
      messageApi.error("Session expired. Please login again.");
      navigate('/login');
      return;
    }
    axios.get(`/api/v1/students/${studentId}`)
      .then(res => { setProfile(res.data); setLoading(false); })
      .catch(err => {
        console.error(err);
        messageApi.error('Failed to fetch profile data');
        setLoading(false);
      });
  }, [studentId, navigate]);

  const handleChangePassword = () => {
    setIsUpdating(true);
    axios.put(`/api/v1/auth/password`, {
      username: profile?.username,
      old_password: currentPassword,
      new_password: newPassword
    })
      .then(() => {
        messageApi.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(err => messageApi.error(err.response?.data?.message || 'Failed to change password'))
      .finally(() => setIsUpdating(false));
  };

  const isMatch = newPassword && newPassword === confirmPassword;
  const canSubmit = currentPassword && newPassword && isMatch;
  const studentInitial = profile?.full_name?.charAt(0).toUpperCase() || 'S';

  const strength = !newPassword ? 0
    : newPassword.length >= 12 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword) ? 3
    : newPassword.length >= 8 && (/[A-Z]/.test(newPassword) || /[0-9]/.test(newPassword)) ? 2
    : 1;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#22c55e'];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={s.shell}>
      {contextHolder}
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={s.logoRow} onClick={() => navigate('/student/profile')}>
          <div style={s.logoBadge}>{studentInitial}</div>
          <span style={s.logoName}>{profile?.full_name || 'Student'}</span>
        </div>
        <p style={s.sectionLabel}>Account</p>
        {NAV_STUDENT.map(({ key, label, icon: Icon, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            style={{ ...s.navItem, ...(key === 'password' ? s.navActive : {}) }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
        <div style={s.sidebarFooter}>
          <div style={s.avatar}>{studentInitial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.userName}>{profile?.full_name}</div>
            <div style={s.userRole}>Student</div>
          </div>
          <LogOut
            size={16} color="#aaa" style={{ cursor: 'pointer', flexShrink: 0 }}
            onClick={() => { localStorage.clear(); navigate('/login'); }}
          />
        </div>
      </aside>

      {/* MAIN */}
      <div style={s.main}>
        <div style={s.topbar}>
          <div style={s.topbarSub}>Academic year 2025–2026</div>
          <button style={s.bellBtn}><Bell size={18} color="#555" /></button>
        </div>

        <div style={s.content}>
          {/* ✅ Center Wrapper */}
          <div style={s.centerWrapper}>
            {/* Header */}
            <div style={s.pageHeader}>
              <div style={s.headerIcon}>
                <ShieldCheck size={24} color="#e91e8c" />
              </div>
              <div>
                <h1 style={s.pageTitle}>Change Password</h1>
                <p style={s.pageCount}>Ensure your account is using a strong, secure password.</p>
              </div>
            </div>

            <div style={s.card}>
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
              />

              <div style={{ marginTop: 18 }}>
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                {newPassword && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 4, borderRadius: 2,
                          background: i <= strength ? strengthColor[strength] : '#f0f0f0',
                          transition: 'background 0.3s',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: strengthColor[strength] }}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 18 }}>
                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
                {confirmPassword && !isMatch && (
                  <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6, marginBottom: 0 }}>
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && isMatch && (
                  <p style={{ color: '#22c55e', fontSize: 12, marginTop: 6, marginBottom: 0 }}>
                    ✓ Passwords match
                  </p>
                )}
              </div>

              <div style={s.actionRow}>
                <button
                  style={{
                    ...s.btnPrimary,
                    opacity: (!canSubmit || isUpdating) ? 0.45 : 1,
                    cursor: (!canSubmit || isUpdating) ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleChangePassword}
                  disabled={!canSubmit || isUpdating}
                >
                  {isUpdating ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password;

const s = {
  shell: {
    display: 'flex', height: '100vh', width: '100vw',
    position: 'fixed', top: 0, left: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#fdf4f9', overflow: 'hidden'
  },

  sidebar: {
    width: 220, minWidth: 220, flexShrink: 0,
    background: '#fff', borderRight: '0.5px solid #e5e7eb',
    display: 'flex', flexDirection: 'column', height: '100vh',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '18px 20px', borderBottom: '0.5px solid #e5e7eb', cursor: 'pointer',
  },
  logoBadge: {
    width: 36, height: 36, borderRadius: 8, background: '#e91e8c', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 13,
  },
  logoName: {
    fontWeight: 700, fontSize: 14, color: '#111',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: '#bbb', letterSpacing: '0.08em',
    textTransform: 'uppercase', padding: '16px 20px 4px', margin: 0,
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px',
    width: '100%', background: 'transparent', border: 'none',
    cursor: 'pointer', fontSize: 14, color: '#555', textAlign: 'left',
  },
  navActive: { background: '#fce8f3', color: '#e91e8c', fontWeight: 600 },
  sidebarFooter: {
    marginTop: 'auto', borderTop: '0.5px solid #e5e7eb',
    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%', background: '#fce8f3', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#e91e8c',
  },
  userName: {
    fontSize: 13, fontWeight: 600, color: '#111',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  userRole: { fontSize: 11, color: '#888' },
  main: {
    flex: 1, height: '100vh',
    display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden',
  },
  topbar: {
    background: '#fff', borderBottom: '0.5px solid #e5e7eb', padding: '16px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  },
  topbarSub: { fontSize: 12, color: '#888' },
  bellBtn: {
    width: 36, height: 36, borderRadius: '50%', border: '0.5px solid #d1d5db',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', background: 'transparent',
  },
  content: {
    flex: 1, minHeight: 0, padding: '28px 32px', boxSizing: 'border-box',
    overflowY: 'auto', background: '#fdf4f9',
  },
  // ✅ Thêm mới: wrapper căn giữa toàn bộ nội dung
  centerWrapper: {
    maxWidth: 560,
    margin: '0 auto',
    width: '100%',
  },
  pageHeader: {
    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
  },
  headerIcon: {
    width: 52, height: 52, borderRadius: 14, background: '#fce8f3', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(233,30,140,0.15)',
  },
  pageTitle: {
    fontSize: 22, fontWeight: 800, color: '#111827', margin: 0,
    letterSpacing: '-0.02em', lineHeight: 1.2,
  },
  pageCount: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 0 },
  card: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 16, padding: '28px',
    // ✅ Đã xóa maxWidth: 480 vì centerWrapper đã giới hạn rồi
  },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: '#4b5563' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  input: {
    width: '100%', padding: '11px 40px 11px 14px', border: '1px solid #e5e7eb',
    borderRadius: 10, fontSize: 14, color: '#111', outline: 'none',
    background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.2s',
  },
  eyeBtn: {
    position: 'absolute', right: 12, background: 'none', border: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0,
  },
  actionRow: {
    marginTop: 28, paddingTop: 20, borderTop: '0.5px solid #f0f0f0',
  },
  btnPrimary: {
    width: '100%', padding: '12px 0', fontSize: 14, border: 'none', borderRadius: 10,
    background: '#e91e8c', color: '#fff', cursor: 'pointer', fontWeight: 600,
    transition: 'opacity 0.2s',
  },
};