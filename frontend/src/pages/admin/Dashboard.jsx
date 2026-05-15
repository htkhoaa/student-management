import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, GitBranch, LogOut, Bell } from 'lucide-react';
import axios from '../../api/axiosConfig';

const BAR_COLORS = ['#9f7aea', '#38bdf8', '#f472b6', '#a78bfa', '#fb7185', '#34d399', '#2dd4bf', '#fb923c', '#818cf8'];

const NAV_MANAGE = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard'},
  { key: 'students' , label: 'Students',  icon: Users,           path: '/admin/student'  },
  { key: 'classes'  , label: 'Classes',   icon: GitBranch,       path: '/admin/class'  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/v1/dashboard/stats')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error('Failed to fetch data from API');
        setLoading(false);
      });
  }, []);

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

      {/* Sidebar - Integrated stable layout */}
      <aside style={s.sidebar}>
        <div style={s.logoRow} onClick={() => navigate('/admin/dashboard')}>
          <div style={s.logoBadge}>SM</div>
          <span style={s.logoName}>Scholar</span>
        </div>

        <p style={s.sectionLabel}>Manage</p>
        {NAV_MANAGE.map(({ key, label, icon: Icon, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            style={{ ...s.navItem, ...(key === 'dashboard' ? s.navActive : {}) }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}

        <div style={s.sidebarFooter}>
          <div style={s.avatar}>{adminInitial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.userName}>{adminName}</div>
            <div style={s.userRole}>Administrator</div>
          </div>
          <LogOut
            size={16} color="#aaa" style={{ cursor: 'pointer', flexShrink: 0 }}
            onClick={() => { localStorage.clear(); navigate('/login'); }}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <div style={s.topbarSub}>Academic year 2025–2026</div>
          </div>
          <button style={s.bellBtn} aria-label="Notifications">
            <Bell size={18} color="#555" />
          </button>
        </div>

        <div style={s.content}>
          <div style={s.greetingRow}>
            <div>
              <h1 style={s.greetingTitle}>{getGreeting()}, {adminName}</h1>
              <p style={s.greetingSub}>Here's what's happening across the school today</p>
            </div>
          </div>

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

          <div style={s.chartCard}>
            <div style={s.chartTitle}>Class distribution</div>
            <div style={s.chartSub}>Students enrolled per class</div>
            <div style={{ width: '100%', height: 300, marginTop: 8 }}>
              <ResponsiveContainer>
                <BarChart data={data?.class_distribution || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="class_name"
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#999', fontSize: 11 }}
                    interval={0} angle={-22} textAnchor="end" height={60}
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

// --- Cleaned Style Constants ---
const s = {
  shell: {
    display: 'flex', height: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#fdf4f9', overflow: 'hidden',
  },
  sidebar: {
    width: 220, minWidth: 220, background: '#fdf4f9',
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
    flex: 1, minHeight: 0, overflowY: 'auto',
    padding: '16px 24px', boxSizing: 'border-box',
    background: '#fdf4f9',
  },
  greetingRow: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 20, gap: 16,
  },
  greetingTitle: { fontSize: 24, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.2'},
  greetingSub: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 0 },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 14, marginBottom: 20,
  },
  statCard: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 14, padding: '18px 20px', position: 'relative',
  },
  statIconBox: {
    position: 'absolute', top: 18, right: 18,
    width: 34, height: 34, borderRadius: 9,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  statLabel: { fontSize: 13, color: '#888', marginBottom: 8 },
  statValue: { fontSize: 30, fontWeight: 700, color: '#111' },
  chartCard: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 14, padding: '20px 22px',
  },
  chartTitle: { fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 2 },
  chartSub: { fontSize: 12, color: '#888' },
};