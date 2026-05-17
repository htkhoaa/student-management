import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GitBranch, Settings,
  LogOut, Bell, UserPlus, Search, Eye, Pencil, Trash2, ChevronDown,
} from 'lucide-react';
import axios from '../../api/axiosConfig';

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_MANAGE = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { key: 'students',  label: 'Students',  icon: Users,            path: '/admin/students'  },
  { key: 'classes',   label: 'Classes',   icon: GitBranch,        path: '/admin/classes'   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();

const AVATAR_COLORS = [
  '#f472b6','#fb7185','#a78bfa','#38bdf8','#34d399',
  '#fb923c','#818cf8','#2dd4bf','#9f7aea',
];
const avatarColor = (id = '') =>
  AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

// ─── Component ────────────────────────────────────────────────────────────────
const StudentsPage = () => {
  const navigate = useNavigate();

  // API state
  const [students, setStudents]     = useState([]);
  const [classes,  setClasses]      = useState([]);
  const [adminName, setAdminName]   = useState('Admin');
  const [loading, setLoading]       = useState(true);

  // Filter / search state
  const [search,      setSearch]      = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus,setFilterStatus]= useState('');

  // ── API calls ───────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      axios.get('/api/v1/students'),
      axios.get('/api/v1/classes'),
      axios.get('/api/v1/dashboard/stats'),
    ])
      .then(([stuRes, clsRes, statsRes]) => {
        setStudents(stuRes.data || []);
        setClasses(clsRes.data  || []);
        setAdminName(statsRes.data?.admin_name || 'Admin');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error('Failed to fetch students');
        setLoading(false);
      });
  }, []);

  // ── Filtered list ────────────────────────────────────────────────────────────
  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.full_name?.toLowerCase().includes(q) ||
      s.student_id?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q);
    const matchClass  = !filterClass  || s.class_name === filterClass;
    const matchStatus = !filterStatus || s.status     === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const adminInitial = adminName.charAt(0).toUpperCase();

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    if (!window.confirm('Delete this student?')) return;
    axios.delete(`/api/v1/students/${id}`)
      .then(() => setStudents(prev => prev.filter(s => s.student_id !== id)))
      .catch(() => message.error('Delete failed'));
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={s.shell}>

      {/* ── SIDEBAR ──────────────────────────────────────────────────────────── */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={s.logoRow} onClick={() => navigate('/admin/dashboard')}>
          <div style={s.logoBadge}>SM</div>
          <span style={s.logoName}>Scholar</span>
        </div>

        {/* Manage */}
        <p style={s.sectionLabel}>Manage</p>
        {NAV_MANAGE.map(({ key, label, icon: Icon, path }) => (
          <button
            key={key}
            onClick={() => navigate(path)}
            style={{ ...s.navItem, ...(key === 'students' ? s.navActive : {}) }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}

        {/* Account */}
        <p style={s.sectionLabel}>Account</p>
        <button style={s.navItem} onClick={() => navigate('/admin/settings')}>
          <Settings size={17} />
          Settings
        </button>

        {/* Footer */}
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

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <div style={s.main}>
        {/* Topbar */}
        <div style={s.topbar}>
          <div>
            <div style={s.topbarTitle}>Students</div>
            <div style={s.topbarSub}>Academic year 2024–2025</div>
          </div>
          <button style={s.bellBtn} aria-label="Notifications">
            <Bell size={18} color="#555" />
          </button>
        </div>

        {/* Content */}
        <div style={s.content}>
          {/* Page header */}
          <div style={s.pageHeader}>
            <div>
              <h1 style={s.pageTitle}>Students</h1>
              <p style={s.pageCount}>{filtered.length} of {students.length} students</p>
            </div>
            <button style={s.btnRegister} onClick={() => navigate('/admin/students/add')}>
              <UserPlus size={15} /> Register student
            </button>
          </div>

          {/* Table card */}
          <div style={s.tableCard}>
            {/* Filters */}
            <div style={s.filterRow}>
              {/* Search */}
              <div style={s.searchBox}>
                <Search size={15} color="#bbb" style={{ flexShrink: 0 }} />
                <input
                  style={s.searchInput}
                  placeholder="Search by name, ID, email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Class filter */}
              <div style={s.selectWrap}>
                <select
                  style={s.select}
                  value={filterClass}
                  onChange={e => setFilterClass(e.target.value)}
                >
                  <option value="">All classes</option>
                  {classes.map(c => (
                    <option key={c.class_name} value={c.class_name}>{c.class_name}</option>
                  ))}
                </select>
                <ChevronDown size={14} color="#999" style={s.selectArrow} />
              </div>

              {/* Status filter */}
              <div style={s.selectWrap}>
                <select
                  style={s.select}
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown size={14} color="#999" style={s.selectArrow} />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={{ ...s.th, width: 36 }}>
                      <input type="checkbox" style={{ cursor: 'pointer' }} />
                    </th>
                    <th style={s.th}>ID ↕</th>
                    <th style={s.th}>Name ↑</th>
                    <th style={s.th}>Class ↕</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Status ↕</th>
                    <th style={s.th}>Gender</th>
                    <th style={s.th}>Phone</th>
                    <th style={{ ...s.th, width: 90 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: '#bbb', fontSize: 14 }}>
                        No students found
                      </td>
                    </tr>
                  ) : filtered.map((stu) => (
                    <tr key={stu.student_id} style={s.tr}>
                      {/* Checkbox */}
                      <td style={s.td}>
                        <input type="checkbox" style={{ cursor: 'pointer' }} />
                      </td>

                      {/* ID */}
                      <td style={{ ...s.td, color: '#555', fontSize: 13 }}>{stu.student_id}</td>

                      {/* Name + avatar */}
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            ...s.stuAvatar,
                            background: avatarColor(stu.student_id),
                          }}>
                            {getInitials(stu.full_name)}
                          </div>
                          <div>
                            <div style={s.stuName}>{stu.full_name}</div>
                            <div style={s.stuSub}>
                              {stu.gender} · {stu.date_of_birth}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class badge */}
                      <td style={s.td}>
                        <span style={{
                          ...s.classBadge,
                          background: avatarColor(stu.class_name || '') + '22',
                          color: avatarColor(stu.class_name || ''),
                        }}>
                          {stu.class_name}
                        </span>
                      </td>

                      {/* Email */}
                      <td style={{ ...s.td, fontSize: 13, color: '#444' }}>{stu.email}</td>

                      {/* Status */}
                      <td style={s.td}>
                        <span style={{
                          ...s.statusBadge,
                          background: stu.status === 'Active' ? '#dcfce7' : '#fee2e2',
                          color:      stu.status === 'Active' ? '#16a34a' : '#dc2626',
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: stu.status === 'Active' ? '#16a34a' : '#dc2626',
                            display: 'inline-block',
                          }} />
                          {stu.status}
                        </span>
                      </td>

                      {/* Gender */}
                      <td style={{ ...s.td, fontSize: 13, color: '#555' }}>{stu.gender}</td>

                      {/* Phone */}
                      <td style={{ ...s.td, fontSize: 13, color: '#555' }}>{stu.phone}</td>

                      {/* Actions */}
                      <td style={s.td}>
                        <div style={s.actions}>
                          <button style={s.actionBtn} title="View"
                            onClick={() => navigate(`/admin/students/${stu.student_id}`)}>
                            <Eye size={15} color="#aaa" />
                          </button>
                          <button style={s.actionBtn} title="Edit"
                            onClick={() => navigate(`/admin/students/${stu.student_id}/edit`)}>
                            <Pencil size={15} color="#aaa" />
                          </button>
                          <button style={s.actionBtn} title="Delete"
                            onClick={() => handleDelete(stu.student_id)}>
                            <Trash2 size={15} color="#f87171" />
                          </button>
                        </div>
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

export default StudentsPage;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  shell: {
    display: 'flex', height: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#f9fafb', overflow: 'hidden',
  },

  /* Sidebar — dùng lại y hệt Dashboard */
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
    fontSize: 13, fontWeight: 700, color: '#e91e8c', flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#111' },
  userRole: { fontSize: 11, color: '#888' },

  /* Main */
  main: { flex: 1, marginLeft: 220, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: {
    background: '#fff', borderBottom: '0.5px solid #e5e7eb',
    padding: '14px 40px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', flexShrink: 0,
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

  /* Page header */
  pageHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 24, gap: 16,
  },
  pageTitle: { fontSize: 24, fontWeight: 700, color: '#111', margin: 0 },
  pageCount: { fontSize: 13, color: '#888', marginTop: 4, marginBottom: 0 },
  btnRegister: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '10px 20px', fontSize: 14,
    border: 'none', borderRadius: 10,
    background: '#e91e8c', color: '#fff',
    cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
  },

  /* Table card */
  tableCard: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 14, overflow: 'hidden',
  },

  /* Filters */
  filterRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '16px 20px', borderBottom: '0.5px solid #f0f0f0',
  },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    border: '0.5px solid #e5e7eb', borderRadius: 8,
    padding: '8px 12px', flex: 1, maxWidth: 320, background: '#fff',
  },
  searchInput: {
    border: 'none', outline: 'none', fontSize: 13,
    color: '#333', background: 'transparent', width: '100%',
  },
  selectWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  select: {
    appearance: 'none', border: '0.5px solid #e5e7eb',
    borderRadius: 8, padding: '8px 32px 8px 12px',
    fontSize: 13, color: '#555', background: '#fff',
    cursor: 'pointer', outline: 'none',
  },
  selectArrow: { position: 'absolute', right: 10, pointerEvents: 'none' },

  /* Table */
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    padding: '12px 16px', textAlign: 'left',
    fontSize: 12, fontWeight: 600, color: '#e91e8c',
    borderBottom: '0.5px solid #f0f0f0', whiteSpace: 'nowrap',
    background: '#fff',
  },
  tr: { borderBottom: '0.5px solid #f9f9f9', transition: 'background 0.1s' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },

  /* Row elements */
  stuAvatar: {
    width: 34, height: 34, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
  },
  stuName: { fontSize: 13, fontWeight: 600, color: '#111' },
  stuSub: { fontSize: 11, color: '#aaa', marginTop: 1 },
  classBadge: {
    display: 'inline-block', padding: '3px 10px',
    borderRadius: 6, fontSize: 12, fontWeight: 600,
  },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
  },
  actions: { display: 'flex', alignItems: 'center', gap: 4 },
  actionBtn: {
    width: 28, height: 28, borderRadius: 6,
    border: 'none', background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  },
};