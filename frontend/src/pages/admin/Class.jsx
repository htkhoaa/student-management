import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GitBranch, Settings,
  LogOut, Bell, Search, ChevronDown, ChevronLeft, ChevronRight, Calculator
} from 'lucide-react';
import axios from '../../api/axiosConfig';

const NAV_MANAGE = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { key: 'students',  label: 'Students',  icon: Users,            path: '/admin/student'  },
  { key: 'classes',   label: 'Classes',   icon: GitBranch,        path: '/admin/class'   },
];

const PAGE_SIZE = 8;

const AdminClass = () => {
  const navigate = useNavigate();

  const [classes, setClasses]       = useState([]);
  const [adminName, setAdminName]   = useState('Admin');
  const [loading, setLoading]       = useState(true);

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClasses, setTotalClasses]   = useState(0);
  const [distribution, setDistribution]   = useState([]);

  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage]                 = useState(1);

  useEffect(() => {
    Promise.all([
      axios.get('/api/v1/classes?limit=1000'),
      axios.get('/api/v1/dashboard/stats'),
    ])
      .then(([clsRes, statsRes]) => {
        const classList = clsRes.data || [];
        const stats = statsRes.data || {};
        const dist = stats.class_distribution || [];

        const mergedClasses = classList.map(cls => {
          const match = dist.find(d => d.class_name === cls.name);
          return {
            ...cls,
            student_count: match ? match.student_count : (cls.student_count || 0)
          };
        });

        setClasses(mergedClasses);
        setAdminName(stats.admin_name || 'Admin');
        setTotalClasses(stats.total_classes || mergedClasses.length || 0);
        setTotalStudents(stats.total_students || 0);
        setDistribution(dist);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error('Failed to fetch data from server');
        setLoading(false);
      });
  }, []);

  const avgPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  const filtered = classes.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.id?.toString().includes(q);
    const matchStatus = !filterStatus || String(c.is_active) === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const adminInitial = adminName.charAt(0).toUpperCase();

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={s.shell}>
      {/* SIDEBAR */}
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
            style={{ ...s.navItem, ...(key === 'classes' ? s.navActive : {}) }}
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

      {/* MAIN CONTENT */}
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
          <div style={s.pageHeader}>
            <div>
              <h1 style={s.pageTitle}>Classes</h1>
              <p style={s.pageCount}>Showing {filtered.length} of {totalClasses} total classes</p>
            </div>
          </div>

          <div style={s.statsGrid}>
            <div style={s.statCard}>
              <div style={{ ...s.statIconBox, background: '#ede9fe' }}>
                <GitBranch size={16} color="#7c3aed" />
              </div>
              <div style={s.statLabel}>Total classes</div>
              <div style={s.statValue}>{totalClasses}</div>
            </div>
            <div style={s.statCard}>
              <div style={{ ...s.statIconBox, background: '#fce8f3' }}>
                <Users size={16} color="#e91e8c" />
              </div>
              <div style={s.statLabel}>Total students</div>
              <div style={s.statValue}>{totalStudents}</div>
            </div>
            <div style={s.statCard}>
              <div style={{ ...s.statIconBox, background: '#e0f2fe' }}>
                <Calculator size={16} color="#0284c7" />
              </div>
              <div style={s.statLabel}>Avg per class</div>
              <div style={s.statValue}>{avgPerClass}</div>
            </div>
          </div>

          <div style={s.tableCard}>
            <div style={s.filterRow}>
              <div style={s.searchBox}>
                <Search size={15} color="#bbb" />
                <input
                  style={s.searchInput}
                  placeholder="Search class name..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>

              <div style={s.selectWrap}>
                <select
                  style={s.select}
                  value={filterStatus}
                  onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                >
                  <option value="">All statuses</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <ChevronDown size={14} color="#999" style={s.selectArrow} />
              </div>

              <div style={s.pagination}>
                <span style={s.pageInfo}>{page} / {totalPages}</span>
                <button
                  style={{ ...s.pageBtn, opacity: page <= 1 ? 0.35 : 1 }}
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  style={{ ...s.pageBtn, opacity: page >= totalPages ? 0.35 : 1 }}
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={{ ...s.th, width: '40px' }}><input type="checkbox" /></th>
                    <th style={{ ...s.th, width: '15%' }}>CLASS ID</th>
                    <th style={{ ...s.th, width: '35%' }}>CLASS NAME</th>
                    <th style={{ ...s.th, width: '20%' }}>STUDENTS</th>
                    <th style={{ ...s.th, width: '15%' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ ...s.td, textAlign: 'center', padding: '40px', color: '#bbb' }}>
                        No classes found
                      </td>
                    </tr>
                  ) : paginated.map((cls) => (
                    <tr key={cls.id} style={s.tr}>
                      <td style={s.td}><input type="checkbox" /></td>
                      <td style={{ ...s.td, color: '#666', fontSize: 12 }}>{cls.id}</td>
                      <td style={s.td}>
                        <span style={s.classNameText}>{cls.name}</span>
                      </td>
                      <td style={{ ...s.td, fontSize: 13, color: '#444' }}>
                        {cls.student_count || 0} students
                      </td>
                      <td style={s.td}>
                        <span style={{
                          ...s.statusBadge,
                          background: cls.is_active !== false ? '#dcfce7' : '#fee2e2',
                          color:      cls.is_active !== false ? '#16a34a' : '#dc2626',
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                            background: cls.is_active !== false ? '#16a34a' : '#dc2626',
                          }} />
                          {cls.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
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

const s = {
  shell: {
    display: 'flex',
    height: '100vh',
    width: '100vw',         // ← full viewport width
    position: 'fixed',      // ← thoát khỏi layout cha
    top: 0,
    left: 0,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#fdf4f9',
    overflow: 'hidden',
    zIndex: 100,
  },
  sidebar: {
    width: 220,
    minWidth: 220,
    flexShrink: 0,           // ← không bị co lại
    background: '#fff',
    borderRight: '0.5px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
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
    flex: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
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
  pageTitle: { fontSize: 24, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.2' },
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

export default AdminClass;