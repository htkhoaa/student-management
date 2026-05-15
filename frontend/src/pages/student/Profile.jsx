import React, { useEffect, useState } from 'react';
import { Spin, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, Users as UsersIcon, LogOut, Bell, Mail, Phone, BookOpen, Hash, UserCircle2 } from 'lucide-react';
import axios from '../../api/axiosConfig';

const NAV_STUDENT = [
  { key: 'profile',  label: 'Profile',   icon: User,       path: '/student/profile' },
  { key: 'password', label: 'Password',  icon: KeyRound,   path: '/student/password' },
  { key: 'class',    label: 'My Class',  icon: UsersIcon,  path: '/student/class' },
];

const StudentProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('FEMALE');
  const [isUpdating, setIsUpdating] = useState(false);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) {
      message.error("Session expired. Please login again.");
      navigate('/login');
      return;
    }
    axios.get(`/api/v1/students/${studentId}`)
      .then(res => {
        const data = res.data;
        setProfile(data);
        setPhone(data.phone || '');
        setGender(data.gender || 'FEMALE');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error('Failed to fetch profile data');
        setLoading(false);
      });
  }, [studentId, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    axios.put(`/api/v1/students/${profile.id}`, { ...profile, phone, gender })
      .then(() => {
        message.success('Profile updated successfully');
        setProfile({ ...profile, phone, gender });
      })
      .catch((err) => {
        message.error(err.response?.data?.message || 'Failed to update profile');
      })
      .finally(() => setIsUpdating(false));
  };

  const hasChanges = profile && (phone !== (profile.phone || '') || gender !== profile.gender);
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
            style={{ ...s.navItem, ...(key === 'profile' ? s.navActive : {}) }}
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
          {/* Center Wrapper */}
          <div style={s.centerWrapper}>
            {/* Header */}
            <div style={s.pageHeader}>
              <div style={s.avatarLarge}>{studentInitial}</div>
              <div>
                <h1 style={s.pageTitle}>{getGreeting()}, {profile?.full_name}</h1>
                <p style={s.pageCount}>View and manage your personal information</p>
              </div>
            </div>

            {/* Card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <UserCircle2 size={18} color="#e91e8c" />
                <span style={s.cardTitle}>Personal Information</span>
              </div>

              {/* Read-only info rows */}
              <div style={s.infoGrid}>
                <div style={s.infoItem}>
                  <div style={s.infoIcon}><Hash size={14} color="#e91e8c" /></div>
                  <div>
                    <div style={s.infoLabel}>Student ID</div>
                    <div style={s.infoValue}>{profile?.username || '—'}</div>
                  </div>
                </div>
                <div style={s.infoItem}>
                  <div style={s.infoIcon}><User size={14} color="#e91e8c" /></div>
                  <div>
                    <div style={s.infoLabel}>Full Name</div>
                    <div style={s.infoValue}>{profile?.full_name || '—'}</div>
                  </div>
                </div>
                <div style={s.infoItem}>
                  <div style={s.infoIcon}><Mail size={14} color="#e91e8c" /></div>
                  <div>
                    <div style={s.infoLabel}>Email Address</div>
                    <div style={s.infoValue}>{profile?.email || '—'}</div>
                  </div>
                </div>
                <div style={s.infoItem}>
                  <div style={s.infoIcon}><BookOpen size={14} color="#e91e8c" /></div>
                  <div>
                    <div style={s.infoLabel}>Class</div>
                    <div style={s.infoValue}>{profile?.class_name || '—'}</div>
                  </div>
                </div>
              </div>

              <div style={s.divider} />

              {/* Editable fields */}
              <div style={s.editGrid}>
                <div style={s.field}>
                  <label style={s.label}>
                    <Phone size={13} style={{ marginRight: 6, verticalAlign: -2, color: '#e91e8c' }} />
                    Phone Number
                  </label>
                  <input
                    style={s.input}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>
                    <UserCircle2 size={13} style={{ marginRight: 6, verticalAlign: -2, color: '#e91e8c' }} />
                    Gender
                  </label>
                  <Select
                    style={{ width: '100%', height: 42 }}
                    value={gender}
                    onChange={val => setGender(val)}
                  >
                    <Select.Option value="MALE">Male</Select.Option>
                    <Select.Option value="FEMALE">Female</Select.Option>
                    <Select.Option value="OTHER">Other</Select.Option>
                  </Select>
                </div>
              </div>

              {hasChanges && (
                <div style={s.actionRow}>
                  <button
                    style={{ ...s.btnPrimary, opacity: isUpdating ? 0.7 : 1 }}
                    onClick={handleUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

const s = {
  shell: {
    display: 'flex', height: '100vh', width: '100vw',
    position: 'fixed', top: 0, left: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#fdf4f9', overflow: 'hidden', zIndex: 100,
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
    maxWidth: 800,
    margin: '0 auto',
    width: '100%',
  },
  pageHeader: {
    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
  },
  avatarLarge: {
    width: 52, height: 52, borderRadius: 14, background: '#e91e8c', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 800, fontSize: 22,
    boxShadow: '0 4px 12px rgba(233,30,140,0.25)',
  },
  pageTitle: {
    fontSize: 22, fontWeight: 800, color: '#111827', margin: 0,
    letterSpacing: '-0.02em', lineHeight: 1.2,
  },
  pageCount: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 0 },
  card: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 16, padding: '28px 28px 24px',
    // ✅ Đã xóa maxWidth: 740 vì centerWrapper đã giới hạn rồi
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22,
  },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#111' },
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px',
    marginBottom: 4,
  },
  infoItem: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    background: '#fdf4f9', borderRadius: 10, padding: '12px 14px',
  },
  infoIcon: {
    width: 28, height: 28, borderRadius: 8, background: '#fce8f3', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  infoLabel: { fontSize: 11, color: '#aaa', fontWeight: 500, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' },
  infoValue: { fontSize: 14, fontWeight: 600, color: '#111' },
  divider: {
    borderTop: '0.5px solid #f0f0f0', margin: '20px 0',
  },
  editGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: '#4b5563' },
  input: {
    padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 10,
    fontSize: 14, color: '#111', outline: 'none', background: '#fff',
    transition: 'border-color 0.2s',
  },
  actionRow: {
    marginTop: 24, display: 'flex', justifyContent: 'flex-end',
    paddingTop: 20, borderTop: '0.5px solid #f0f0f0',
  },
  btnPrimary: {
    padding: '10px 28px', fontSize: 14, border: 'none', borderRadius: 10,
    background: '#e91e8c', color: '#fff', cursor: 'pointer', fontWeight: 600,
    transition: 'opacity 0.2s',
  },
};