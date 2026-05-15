import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, Users as UsersIcon, LogOut, Bell } from 'lucide-react';
import axios from '../../api/axiosConfig';

// --- Navigation Configuration for Student ---
const NAV_STUDENT = [
  { key: 'profile',  label: 'Profile',   icon: User,       path: '/student/profile' },
  { key: 'password', label: 'Password',  icon: KeyRound,   path: '/student/password' },
  { key: 'class',    label: 'My Class',  icon: UsersIcon,  path: '/student/class' },
];

const Password = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) {
      message.error("Session expired. Please login again.");
      navigate('/login');
      return;
    }
    // Fetch profile data just to show the correct Name and Avatar in Sidebar
    axios.get(`/api/v1/students/${studentId}`)
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error('Failed to fetch profile data');
        setLoading(false);
      });
  }, [studentId, navigate]); // Fixed dependency: navigate instead of navigate()

  const handleChangePassword = () => {
    setIsUpdating(true);
    axios.put(`/api/v1/auth/password`, {
      username: profile?.username,
      old_password: currentPassword,
      new_password: newPassword
    })
      .then(() => {
        message.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(err => message.error(err.response?.data?.message || 'Failed to change password'))
      .finally(() => setIsUpdating(false));
  };

  // Logic to check if passwords match
  const isMatch = newPassword && newPassword === confirmPassword;
  const canSubmit = currentPassword && newPassword && isMatch;
  const studentInitial = profile?.full_name?.charAt(0).toUpperCase() || 'S';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={s.shell}>
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

      {/* MAIN CONTENT */}
      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <div style={s.topbarSub}>Academic year 2025–2026</div>
          </div>
          <button style={s.bellBtn}>
            <Bell size={18} color="#555" />
          </button>
        </div>

        <div style={s.content}>
          <div style={s.pageHeader}>
            <div>
              <h1 style={s.pageTitle}>Change Password</h1>
              <p style={s.pageCount}>Ensure your account is using a long, random password to stay secure.</p>
            </div>
          </div>

          <div style={{ ...s.card, maxWidth: 800}}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div style={s.field}>
                <label style={s.label}>Current Password</label>
                <input
                  type="password"
                  style={s.input}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>New Password</label>
                <input
                  type="password"
                  style={s.input}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>Confirm New Password</label>
                <input
                  type="password"
                  style={{
                    ...s.input,
                    borderColor: (confirmPassword && !isMatch) ? '#ef4444' : '#d1d5db'
                  }}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
                {/* Warning message if passwords don't match */}
                {confirmPassword && !isMatch && (
                  <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                    New passwords do not match
                  </span>
                )}
              </div>

            </div>

            <div style={s.actionRow}>
              <button
                style={{
                  ...s.btnPrimary,
                  width: '100%',
                  opacity: (!canSubmit || isUpdating) ? 0.5 : 1,
                  cursor: (!canSubmit || isUpdating) ? 'not-allowed' : 'pointer'
                }}
                onClick={handleChangePassword}
                disabled={!canSubmit || isUpdating}
              >
                {isUpdating ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password;

// --- Styles ---
const s = {
  shell: {
    display: 'flex', height: '100vh', width: '100%',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#fdf4f9', overflow: 'hidden',
  },
  sidebar: {
    width: 220, minWidth: 220, background: '#fff',
    borderRight: '0.5px solid #e5e7eb',
    display: 'flex', flexDirection: 'column',
    position: 'fixed', height: '100vh', left: 0, zIndex: 10,
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '18px 20px', borderBottom: '0.5px solid #e5e7eb', cursor: 'pointer',
  },
  logoBadge: {
    width: 36, height: 36, borderRadius: 8, background: '#e91e8c',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
  },
  logoName: {
    fontWeight: 700, fontSize: 14, color: '#111',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
  },
  sectionLabel: {
    fontSize: 11, fontWeight: 600, color: '#bbb',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '16px 20px 4px', margin: 0,
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 20px', width: '100%',
    background: 'transparent', border: 'none',
    cursor: 'pointer', fontSize: 14, color: '#555', textAlign: 'left',
  },
  navActive: { background: '#fce8f3', color: '#e91e8c', fontWeight: 600 },
  sidebarFooter: {
    marginTop: 'auto', borderTop: '0.5px solid #e5e7eb',
    padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%', background: '#fce8f3',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#e91e8c', flexShrink: 0,
  },
  userName: {
    fontSize: 13, fontWeight: 600, color: '#111',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
  },
  userRole: { fontSize: 11, color: '#888' },
  main: {
    flex: 1, marginLeft: 220, height: '100vh',
    display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden',
  },
  topbar: {
    background: '#fff', borderBottom: '0.5px solid #e5e7eb',
    padding: '16px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  },
  topbarSub: { fontSize: 12, color: '#888', marginTop: 2 },
  bellBtn: {
    width: 36, height: 36, borderRadius: '50%',
    border: '0.5px solid #d1d5db',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', background: 'transparent',
  },
  content: {
    flex: 1, minHeight: 0, width: '100%',
    padding: '24px', boxSizing: 'border-box',
    overflowY: 'auto',
    display: 'flex', flexDirection: 'column',
    background: '#fdf4f9',
  },
  pageHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 24, gap: 16,
  },
  pageTitle: { fontSize: 24, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.2'},
  pageCount: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 0 },

  // Custom Profile Styles
  card: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 14, padding: '30px', maxWidth: 800,
  },
  cardTitle: {
    fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 24px 0'
  },
  formGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24,
  },
  field: {
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  label: {
    fontSize: 13, fontWeight: 600, color: '#4b5563',
  },
  inputDisabled: {
    padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8,
    fontSize: 14, background: '#f9fafb', color: '#9ca3af', cursor: 'not-allowed', outline: 'none'
  },
  input: {
    padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8,
    fontSize: 14, color: '#111', outline: 'none', transition: 'border 0.2s'
  },
  actionRow: {
    marginTop: 32, display: 'flex', justifyContent: 'flex-end', paddingTop: 24, borderTop: '1px solid #f0f0f0'
  },
  btnPrimary: {
    padding: '10px 24px', fontSize: 14, border: 'none', borderRadius: 10,
    background: '#e91e8c', color: '#fff', cursor: 'pointer', fontWeight: 600,
    transition: 'opacity 0.2s'
  }
};