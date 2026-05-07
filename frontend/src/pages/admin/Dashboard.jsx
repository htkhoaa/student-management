import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import {LayoutDashboard, Users, GitBranch, Settings, LogOut, UserPlus, Bell} from 'lucide-react';
import axios from '../../api/axiosConfig';

// ─── Chart column colors ──────────────────────────────────────────────────────
const BAR_COLORS = ['#9f7aea', '#38bdf8', '#f472b6', '#a78bfa', '#fb7185', '#34d399', '#2dd4bf', '#fb923c', '#818cf8'];

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard',     icon: LayoutDashboard, path: '/admin/dashboard' },
  { key: 'students',  label: 'Students',       icon: Users,           path: '/admin/students'  },
  { key: 'classes',   label: 'Classes',        icon: GitBranch,       path: '/admin/classes'   },
  { key: 'settings',  label: 'Settings',       icon: Settings,        path: '/admin/settings'  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  // ── Keep original API call ──────────────────────────────────────────────────
  useEffect(() => {
    axios.get('/api/v1/dashboard/stats')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error("Failed to fetch data from API");
        setLoading(false);
      });
  }, []);

  // ── Keep original greeting function ─────────────────────────────────────────
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const adminInitial = data?.admin_name?.charAt(0).toUpperCase() || 'A';
  const adminName    = data?.admin_name || 'Admin';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={s.shell}>

      {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={s.logoRow} onClick={() => navigate('/admin/dashboard')}>
          <div style={s.logoBadge}>SM</div>
          <span style={s.logoName}>Scholar</span>
        </div>

        {/* Nav - Manage */}
        <p style={s.sectionLabel}>Manage</p>
        {NAV_ITEMS.slice(0, 3).map(({ key, label, icon: Icon, path }) => (
          <button
            key={key}
            onClick={() => { setActiveNav(key); navigate(path); }}
            style={{
              ...s.navItem,
              ...(activeNav === key ? s.navActive : {}),
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}

        {/* Nav - Account */}
        <p style={s.sectionLabel}>Account</p>
        <button
          onClick={() => { setActiveNav('settings'); navigate('/admin/settings'); }}
          style={{ ...s.navItem, ...(activeNav === 'settings' ? s.navActive : {}) }}
        >
          <Settings size={17} />
          Settings
        </button>

        {/* User footer */}
        <div style={s.sidebarFooter}>
          <div style={s.avatar}>{adminInitial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.userName}>{adminName}</div>
            <div style={s.userRole}>Administrator</div>
          </div>
          <LogOut
            size={16}
            color="#aaa"
            style={{ cursor: 'pointer', flexShrink: 0 }}
            onClick={() => { localStorage.clear(); navigate('/login'); }}
          />
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────────────────────────────── */}
      <div style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <div style={s.topbarTitle}>Dashboard</div>
            <div style={s.topbarSub}>Academic year 2025–2026</div>
          </div>
          <button style={s.bellBtn} aria-label="Notifications">
            <Bell size={18} color="#555" />
          </button>
        </div>

        {/* Content */}
        <div style={s.content}>
          {/* Greeting */}
          <div style={s.greetingRow}>
            <div>
              <h1 style={s.greetingTitle}>{getGreeting()}, {adminName}</h1>
              <p style={s.greetingSub}>Here's what's happening across your school today.</p>
            </div>
            <button style={s.btnAdd} onClick={() => navigate('/admin/students/add')}>
              <UserPlus size={15} /> Add student
            </button>
          </div>

          {/* Stat cards — using data from API */}
          <div style={s.statsGrid}>
            <div style={s.statCard}>
              <div style={{ ...s.statIconBox, background: '#fce8f3' }}>
                <Users size={16} color="#e91e8c" />
              </div>
              <div style={s.statLabel}>Total students</div>
              <div style={s.statValue}>{data?.total_students ?? 0}</div>
            </div>

            <div style={s.statCard}>
              <div style={{ ...s.statIconBox, background: '#ede9fe' }}>
                <GitBranch size={16} color="#7c3aed" />
              </div>
              <div style={s.statLabel}>Total classes</div>
              <div style={s.statValue}>{data?.total_classes ?? 0}</div>
            </div>
          </div>

          {/* Class distribution chart — using data from API */}
          <div style={s.chartCard}>
            <div style={s.chartTitle}>Class distribution</div>
            <div style={s.chartSub}>Students enrolled per class</div>
            <div style={{ width: '100%', height: 320, marginTop: 8 }}>
              <ResponsiveContainer>
                <BarChart data={data?.class_distribution || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="class_name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#999', fontSize: 11 }}
                    interval={0}
                    angle={-22}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: '#f9f9f9' }}
                    contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="student_count" radius={[8, 8, 0, 0]} barSize={42}>
                    {(data?.class_distribution || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  shell: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#f9fafb',
    overflow: 'hidden',
  },

  /* Sidebar */
  sidebar: {
    width: 220,
    minWidth: 220,
    background: '#fff',
    borderRight: '0.5px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    left: 0,
    zIndex: 10,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '18px 20px',
    borderBottom: '0.5px solid #e5e7eb',
    cursor: 'pointer',
  },
  logoBadge: {
    width: 36, height: 36,
    borderRadius: 8,
    background: '#e91e8c',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
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
  navActive: {
    background: '#fce8f3',
    color: '#e91e8c',
    fontWeight: 600,
  },

  sidebarFooter: {
    marginTop: 'auto',
    borderTop: '0.5px solid #e5e7eb',
    padding: '14px 20px',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: '#fce8f3',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#e91e8c', flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#111' },
  userRole: { fontSize: 11, color: '#888' },

  /* Main */
  main: {
    flex: 1, marginLeft: 220,
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  topbar: {
    background: '#fff',
    borderBottom: '0.5px solid #e5e7eb',
    padding: '14px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexShrink: 0,
  },
  topbarTitle: { fontSize: 17, fontWeight: 600, color: '#111', margin: 0 },
  topbarSub: { fontSize: 12, color: '#888', marginTop: 2 },
  bellBtn: {
    width: 36, height: 36, borderRadius: '50%',
    border: '0.5px solid #d1d5db',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', background: 'transparent',
  },

  content: { flex: 1, overflowY: 'auto', padding: '36px 40px' },

  greetingRow: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 28, gap: 16,
  },
  greetingTitle: { fontSize: 24, fontWeight: 600, color: '#111', margin: 0 },
  greetingSub: { fontSize: 14, color: '#888', marginTop: 4, marginBottom: 0 },

  btnAdd: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '10px 20px', fontSize: 14,
    border: 'none', borderRadius: 10,
    background: '#e91e8c', color: '#fff',
    cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
  },

  /* Stat cards */
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16, marginBottom: 24,
  },
  statCard: {
    background: '#fff',
    border: '0.5px solid #e5e7eb',
    borderRadius: 14,
    padding: '20px 22px',
    position: 'relative',
  },
  statIconBox: {
    position: 'absolute', top: 20, right: 20,
    width: 34, height: 34, borderRadius: 9,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  statLabel: { fontSize: 13, color: '#888', marginBottom: 10 },
  statValue: { fontSize: 32, fontWeight: 700, color: '#111', marginBottom: 8 },
  statChange: {
    fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
  },

  /* Chart */
  chartCard: {
    background: '#fff',
    border: '0.5px solid #e5e7eb',
    borderRadius: 14, padding: '22px 24px',
  },
  chartTitle: { fontSize: 16, fontWeight: 600, color: '#111', marginBottom: 2 },
  chartSub: { fontSize: 13, color: '#888' },
};