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

const Class = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [classmates, setClassmates] = useState([]);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) {
      message.error("Session expired. Please login again.");
      navigate('/login');
      return;
    }

    // GỌI 2 API CÙNG LÚC:
    // 1. Lấy thông tin cá nhân (để hiện tên, avatar, tên lớp)
    // 2. Lấy danh sách bạn cùng lớp (API mới tối ưu từ Backend)
    Promise.all([
      axios.get(`/api/v1/students/${studentId}`),
      axios.get('/api/v1/classes/myClass') // <-- Cập nhật endpoint của bạn ở đây
    ])
      .then(([meRes, classRes]) => {
        setProfile(meRes.data);

        // Nhận trực tiếp mảng từ backend không cần filter nữa
        const mates = classRes.data || [];

        // Sắp xếp danh sách theo mã số sinh viên cho đẹp
        const sortedMates = mates.sort((a, b) =>
          String(a.username).localeCompare(String(b.username))
        );

        setClassmates(sortedMates);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load class data');
        setLoading(false);
      });
  }, [studentId, navigate]);

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
            style={{ ...s.navItem, ...(key === 'class' ? s.navActive : {}) }}
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
              <h1 style={s.pageTitle}>Class {profile?.class_name || 'Information'}</h1>
              <p style={s.pageCount}>
                Showing {classmates.length} classmates enrolled in your class
              </p>
            </div>
          </div>

          <div style={s.tableCard}>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={{ ...s.th, width: '15%' }}>STUDENT ID</th>
                    <th style={{ ...s.th, width: '30%' }}>FULL NAME</th>
                    <th style={{ ...s.th, width: '25%' }}>EMAIL</th>
                    <th style={{ ...s.th, width: '15%' }}>PHONE</th>
                    <th style={{ ...s.th, width: '15%' }}>GENDER</th>
                  </tr>
                </thead>
                <tbody>
                  {classmates.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ ...s.td, textAlign: 'center', padding: '40px', color: '#bbb' }}>
                        No classmates found
                      </td>
                    </tr>
                  ) : classmates.map((mate) => (
                    <tr
                      key={mate.id}
                      style={{
                        ...s.tr,
                        background: mate.id === profile.id ? '#fff0f6' : 'transparent' // Highlight nhẹ dòng của chính mình
                      }}
                    >
                      <td style={{ ...s.td, color: '#666', fontSize: 13, fontWeight: 500 }}>
                        {mate.username}
                      </td>
                      <td style={{ ...s.td, maxWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ fontWeight: 600, color: '#111' }}>{mate.full_name}</span>
                        {mate.id === profile.id && (
                          <span style={{ marginLeft: 8, color: '#e91e8c', fontSize: 12, fontWeight: 600 }}>
                            (You)
                          </span>
                        )}
                      </td>
                      <td style={{ ...s.td, color: '#444', maxWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mate.email}
                      </td>
                      <td style={{ ...s.td, color: '#444' }}>
                        {mate.phone || <span style={{ color: '#bbb' }}>N/A</span>}
                      </td>
                      <td style={{ ...s.td, color: '#555' }}>
                        {mate.gender}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Class;

// --- Styles (Giữ nguyên form ép full width, căn trái và chống cuộn ngang) ---
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
    color: '#fff', fontWeight: 700, fontSize: 13,
  },
  logoName: { fontWeight: 700, fontSize: 16, color: '#111' },
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
    fontSize: 13, fontWeight: 700, color: '#e91e8c',
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#111' },
  userRole: { fontSize: 11, color: '#888' },
  main: {
    flex: 1, marginLeft: 220, height: '100vh',
    display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden',
  },
  topbar: {
    background: '#fff', borderBottom: '0.5px solid #e5e7eb',
    padding: '14px 24px',
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
    padding: '16px 24px 26px', boxSizing: 'border-box',
    overflow: 'hidden', gap: 16,
    display: 'flex', flexDirection: 'column',
    background: '#fdf4f9',
  },
  pageHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 16, gap: 16, flexShrink: 0,
  },
  pageTitle: { fontSize: 24, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.2'},
  pageCount: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 0 },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 14, marginBottom: 16, flexShrink: 0,
  },
  statCard: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 14, padding: '16px 20px', position: 'relative',
  },
  statIconBox: {
    position: 'absolute', top: 16, right: 16,
    width: 34, height: 34, borderRadius: 9,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  statLabel: { fontSize: 13, color: '#888', marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: 700, color: '#111' },
  tableCard: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 14, width: '100%',
    flex: 1, minHeight: 0,
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  filterRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', borderBottom: '0.5px solid #f0f0f0',
    flexWrap: 'nowrap',
  },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    border: '0.5px solid #e5e7eb', borderRadius: 8,
    padding: '6px 12px', flex: 1, maxWidth: 280, minWidth: 160,
  },
  searchInput: {
    border: 'none', outline: 'none', fontSize: 13,
    color: '#333', background: 'transparent', width: '100%',
  },
  selectWrap: { position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 },
  select: {
    appearance: 'none', border: '0.5px solid #e5e7eb',
    borderRadius: 8, padding: '6px 28px 6px 12px',
    fontSize: 13, color: '#555', cursor: 'pointer', outline: 'none',
    background: '#fff',
  },
  selectArrow: { position: 'absolute', right: 8, pointerEvents: 'none' },
  pagination: {
    display: 'flex', alignItems: 'center', gap: 4,
    marginLeft: 'auto', flexShrink: 0,
  },
  pageInfo: { fontSize: 12, color: '#888', minWidth: 40, textAlign: 'center' },
  pageBtn: {
    width: 30, height: 30, borderRadius: 7,
    border: '0.5px solid #e5e7eb', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#555', transition: 'background 0.1s',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    padding: '6px 16px', textAlign: 'left', verticalAlign: 'middle',
    fontSize: 12, fontWeight: 600, color: '#e91e8c',
    borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', background: '#fff',
    position: 'sticky', top: 0, zIndex: 1,
  },
  tr: { borderBottom: '0.5px solid #f5f5f5' },
  td: { padding: '5px 16px', verticalAlign: 'middle', textAlign: 'left', whiteSpace: 'nowrap' },
  classNameText: { fontSize: 13, fontWeight: 600, color: '#111' },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
    whiteSpace: 'nowrap', flexShrink: 0,
  },
};