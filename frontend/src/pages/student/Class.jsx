import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, Users as UsersIcon, LogOut, Bell, GraduationCap } from 'lucide-react';
import axios from '../../api/axiosConfig';

const NAV_STUDENT = [
  { key: 'profile',  label: 'Profile',   icon: User,       path: '/student/profile' },
  { key: 'password', label: 'Password',  icon: KeyRound,   path: '/student/password' },
  { key: 'class',    label: 'My Class',  icon: UsersIcon,  path: '/student/class' },
];

const GENDER_STYLE = {
  MALE:   { bg: '#eff6ff', color: '#3b82f6' },
  FEMALE: { bg: '#fdf2f8', color: '#e91e8c' },
  OTHER:  { bg: '#f3f4f6', color: '#6b7280' },
};

const Class = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    if (!studentId) {
      message.error("Session expired. Please login again.");
      navigate('/login');
      return;
    }
    Promise.all([
      axios.get(`/api/v1/students/${studentId}`),
      axios.get('/api/v1/classes/myClass')
    ])
      .then(([meRes, classRes]) => {
        setProfile(meRes.data);
        const mates = classRes.data || [];
        setClassmates(mates.sort((a, b) => String(a.username).localeCompare(String(b.username))));
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

      {/* MAIN */}
      <div style={s.main}>
        <div style={s.topbar}>
          <div style={s.topbarSub}>Academic year 2025–2026</div>
          <button style={s.bellBtn}><Bell size={18} color="#555" /></button>
        </div>

        <div style={s.content}>
          {/* Page Header */}
          <div style={s.pageHeader}>
            <div style={s.headerLeft}>
              <div style={s.headerIcon}>
                <GraduationCap size={24} color="#e91e8c" />
              </div>
              <div>
                <h1 style={s.pageTitle}>Class {profile?.class_name || 'Information'}</h1>
                <p style={s.pageCount}>{classmates.length} classmates enrolled</p>
              </div>
            </div>
            <div style={s.countBadge}>
              <span style={s.countNum}>{classmates.length}</span>
              <span style={s.countLbl}>Students</span>
            </div>
          </div>

          {/* Table Card */}
          <div style={s.tableCard}>
            <div style={s.tableScroll}>
              <table style={s.table}>
                <colgroup>
                  <col style={{ width: '5%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '11%' }} />
                </colgroup>
                <thead>
                  <tr style={s.theadRow}>
                    <th style={{ ...s.th, textAlign: 'center' }}>#</th>
                    <th style={s.th}>Student ID</th>
                    <th style={s.th}>Full Name</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Phone</th>
                    <th style={s.th}>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {classmates.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ ...s.td, textAlign: 'center', padding: '48px', color: '#bbb', fontSize: 14 }}>
                        No classmates found
                      </td>
                    </tr>
                  ) : classmates.map((mate, idx) => {
                    const isMe = mate.id === profile.id;
                    const isHovered = hoveredRow === mate.id;
                    const gStyle = GENDER_STYLE[mate.gender] || GENDER_STYLE.OTHER;
                    return (
                      <tr
                        key={mate.id}
                        onMouseEnter={() => setHoveredRow(mate.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                        style={{
                          ...s.tr,
                          background: isMe ? '#fff0f9' : isHovered ? '#fdf4f9' : '#fff',
                          transition: 'background 0.15s',
                        }}
                      >
                        {/* # */}
                        <td style={{ ...s.td, color: '#ccc', fontSize: 12, fontWeight: 500, textAlign: 'center' }}>
                          {idx + 1}
                        </td>
                        {/* Student ID */}
                        <td style={s.td}>
                          <span style={s.idBadge}>{mate.username}</span>
                        </td>
                        {/* Full Name */}
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                            <span style={{
                              fontWeight: isMe ? 700 : 600,
                              color: isMe ? '#e91e8c' : '#111',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {mate.full_name}
                              {isMe && <span style={s.youTag}>You</span>}
                            </span>
                          </div>
                        </td>
                        {/* Email */}
                        <td style={{ ...s.td, color: '#555', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {mate.email}
                        </td>
                        {/* Phone */}
                        <td style={{ ...s.td, color: '#555', fontSize: 13 }}>
                          {mate.phone || <span style={{ color: '#ddd' }}>—</span>}
                        </td>
                        {/* Gender */}
                        <td style={s.td}>
                          <span style={{ ...s.genderBadge, background: gStyle.bg, color: gStyle.color }}>
                            {mate.gender
                              ? mate.gender.charAt(0) + mate.gender.slice(1).toLowerCase()
                              : '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
    flex: 1, minHeight: 0, padding: '24px 28px',
    boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
    gap: 20, background: '#fdf4f9', overflow: 'hidden',
  },
  pageHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
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
  countBadge: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 12, padding: '10px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  countNum: { fontSize: 22, fontWeight: 800, color: '#e91e8c', lineHeight: 1 },
  countLbl: { fontSize: 11, color: '#aaa', fontWeight: 500, marginTop: 2 },
  tableCard: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 16, flex: 1, minHeight: 0,
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  tableScroll: { flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'auto' },
  table: {
    width: '100%', borderCollapse: 'collapse', fontSize: 13,
    tableLayout: 'fixed', // ✅ Fix căn header vs data
  },
  theadRow: { borderBottom: '1px solid #f0f0f0' },
  th: {
    padding: '13px 16px', textAlign: 'left', verticalAlign: 'middle',
    fontSize: 11, fontWeight: 700, color: '#e91e8c',
    letterSpacing: '0.06em', textTransform: 'uppercase',
    background: '#fff', position: 'sticky', top: 0, zIndex: 1,
    whiteSpace: 'nowrap', overflow: 'hidden',
  },
  tr: { borderBottom: '0.5px solid #f8f8f8' },
  td: {
    padding: '11px 16px', verticalAlign: 'middle',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  idBadge: {
    display: 'inline-block', padding: '3px 9px',
    background: '#f3f4f6', borderRadius: 6,
    fontSize: 12, fontWeight: 600, color: '#555', letterSpacing: '0.02em',
  },
  rowAvatar: {
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700,
  },
  youTag: {
    marginLeft: 7, fontSize: 11, fontWeight: 700,
    color: '#e91e8c', background: '#fce8f3',
    padding: '2px 7px', borderRadius: 20, verticalAlign: 'middle',
  },
  genderBadge: {
    display: 'inline-block', padding: '3px 10px',
    borderRadius: 20, fontSize: 12, fontWeight: 600,
  },
};