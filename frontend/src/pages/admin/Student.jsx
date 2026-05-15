import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GitBranch,
  LogOut, Bell, UserPlus, Search, Eye, Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight,
} from 'lucide-react';
import axios from '../../api/axiosConfig';
import StudentModal from "../../components/StudentModal.jsx";
import StudentDetailsModal from "../../components/StudentDetailModal.jsx";
import { Modal as AntdModal } from 'antd';

const NAV_MANAGE = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { key: 'students',  label: 'Students',  icon: Users,            path: '/admin/student'  },
  { key: 'classes',   label: 'Classes',   icon: GitBranch,        path: '/admin/class'   },
];

const AVATAR_COLORS = [
  '#f472b6','#fb7185','#a78bfa','#38bdf8','#34d399',
  '#fb923c','#818cf8','#2dd4bf','#9f7aea',
];

const avatarColor = (id = '') =>
  AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

const PAGE_SIZE = 10;

const StudentTable = () => {
  const navigate = useNavigate();

  const [students, setStudents]   = useState([]);
  const [classes,  setClasses]    = useState([]);
  const [adminName, setAdminName] = useState('Admin');
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);

  const [search,       setSearch]       = useState('');
  const [filterClass,  setFilterClass]  = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage]                 = useState(1);

  const [isModalOpen,   setIsModalOpen]   = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ✅ fetchData dùng useCallback để có thể dùng trong useRef
  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      axios.get('/api/v1/students?limit=1000'),
      axios.get('/api/v1/classes'),
      axios.get('/api/v1/dashboard/stats'),
    ])
      .then(([stuRes, clsRes, statsRes]) => {
        const rawStudents = stuRes.data.items || [];
        setStudents(rawStudents.sort((a, b) => String(a.username).localeCompare(String(b.username))));
        setTotal(stuRes.data.total || 0);
        setClasses(clsRes.data || []);
        setAdminName(statsRes.data?.admin_name || 'Admin');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        message.error('Failed to fetch data from server');
        setLoading(false);
      });
  }, []);

  // ✅ Ref luôn giữ bản mới nhất của fetchData — tránh stale closure trong AntdModal
  const fetchDataRef = useRef(fetchData);
  useEffect(() => { fetchDataRef.current = fetchData; }, [fetchData]);

  // Fetch lần đầu khi mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.full_name?.toLowerCase().includes(q) ||
      s.username?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q);
    const matchClass  = !filterClass  || s.class_name === filterClass;
    const matchStatus = !filterStatus || String(s.is_active) === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleView = (id) => {
    axios.get(`/api/v1/students/${id}`)
      .then(res => {
        setSelectedStudent(res.data);
        setIsDetailsOpen(true);
      })
      .catch(() => message.error("Could not load student details"))
      .finally(() => setLoading(false));
  };

  const handleEdit = (stu) => {
    setSelectedStudent(stu);
    setIsModalOpen(true);
  };

  const handleDelete = (id, fullName, isActive) => {
    if (!isActive) {
      AntdModal.confirm({
        title: `Reactivate ${fullName}?`,
        content: 'This student is currently inactive. Do you want to reactivate their account?',
        okText: 'Yes, Reactivate',
        okType: 'primary',
        cancelText: 'Cancel',
        onOk() {
          return axios.put(`/api/v1/students/${id}`, { is_active: true })
            .then(() => {
              message.success(`Reactivated ${fullName} successfully`);
              fetchDataRef.current(); // ✅ gọi qua ref, không bị stale closure
            })
            .catch(() => message.error("Failed to reactivate student"));
        },
      });
    } else {
      AntdModal.confirm({
        title: `Deactivate ${fullName}?`,
        content: 'This action will change the student status to Inactive.',
        okText: 'Yes, Deactivate',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk() {
          return axios.delete(`/api/v1/students/${id}`)
            .then(() => {
              message.success(`Deactivated ${fullName} successfully`);
              fetchDataRef.current(); // ✅ gọi qua ref
            })
            .catch(() => message.error("Failed to deactivate student"));
        },
      });
    }
  };

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
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
            style={{ ...s.navItem, ...(key === 'students' ? s.navActive : {}) }}
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
          <button style={s.bellBtn}>
            <Bell size={18} color="#555" />
          </button>
        </div>

        <div style={s.content}>
          <div style={s.pageHeader}>
            <div>
              <h1 style={s.pageTitle}>Student</h1>
              <p style={s.pageCount}>Showing {filtered.length} of {total} total students</p>
            </div>
            <button style={s.btnRegister} onClick={handleAddStudent}>
              <UserPlus size={15} /> Add student
            </button>
          </div>

          <div style={s.tableCard}>
            <div style={s.filterRow}>
              <div style={s.searchBox}>
                <Search size={15} color="#bbb" />
                <input
                  style={s.searchInput}
                  placeholder="Search name, username, email..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>

              <div style={s.selectWrap}>
                <select style={s.select} value={filterClass} onChange={handleFilterChange(setFilterClass)}>
                  <option value="">All classes</option>
                  {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <ChevronDown size={14} color="#999" style={s.selectArrow} />
              </div>

              <div style={s.selectWrap}>
                <select style={s.select} value={filterStatus} onChange={handleFilterChange(setFilterStatus)}>
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

            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={{ ...s.th, width: '40px' }}><input type="checkbox" /></th>
                    <th style={{ ...s.th, width: '13%' }}>ID</th>
                    <th style={{ ...s.th, width: '22%' }}>NAME</th>
                    <th style={{ ...s.th, width: '10%' }}>CLASS</th>
                    <th style={{ ...s.th, width: '22%' }}>EMAIL</th>
                    <th style={{ ...s.th, width: '11%' }}>STATUS</th>
                    <th style={{ ...s.th, width: '9%' }}>GENDER</th>
                    <th style={{ ...s.th, width: '100px', textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ ...s.td, textAlign: 'center', padding: '40px', color: '#bbb' }}>
                        No students found
                      </td>
                    </tr>
                  ) : paginated.map((stu) => (
                    <tr key={stu.id} style={s.tr}>
                      <td style={s.td}><input type="checkbox" /></td>
                      <td style={{ ...s.td, color: '#666', fontSize: 12 }}>{stu.username}</td>
                      <td style={{ ...s.td, maxWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={s.stuName}>{stu.full_name}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{
                          ...s.classBadge,
                          background: avatarColor(stu.class_name || '') + '22',
                          color: avatarColor(stu.class_name || ''),
                        }}>{stu.class_name}</span>
                      </td>
                      <td style={{ ...s.td, fontSize: 13, color: '#444', maxWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {stu.email}
                      </td>
                      <td style={s.td}>
                        <span style={{
                          ...s.statusBadge,
                          background: stu.is_active ? '#dcfce7' : '#fee2e2',
                          color:      stu.is_active ? '#16a34a' : '#dc2626',
                        }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                            background: stu.is_active ? '#16a34a' : '#dc2626',
                          }} />
                          {stu.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontSize: 13, color: '#555' }}>{stu.gender}</td>
                      <td style={{ ...s.td, width: '100px', minWidth: '100px' }}>
                        <div style={s.actions}>
                          <button style={s.actionBtn} title="View" onClick={() => handleView(stu.id)}>
                            <Eye size={15} color="#bbb" />
                          </button>
                          <button style={s.actionBtn} title="Edit" onClick={() => handleEdit(stu)}>
                            <Pencil size={15} color="#bbb" />
                          </button>
                          <button
                            style={s.actionBtn}
                            title={stu.is_active ? 'Deactivate' : 'Reactivate'}
                            onClick={() => handleDelete(stu.id, stu.full_name, stu.is_active)}
                          >
                            <Trash2 size={15} color={stu.is_active ? "#fca5a5" : "#86efac"} />
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

      <StudentModal
        visible={isModalOpen}
        initialData={selectedStudent}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchDataRef.current(); // ✅ dùng ref thay cho setRefreshKey
        }}
      />

      <StudentDetailsModal
        visible={isDetailsOpen}
        data={selectedStudent}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};

export default StudentTable;

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
    flex: 1, height: '100vh',
    display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden',
  },
  topbar: {
    background: '#fff', borderBottom: '0.5px solid #e5e7eb', padding: '16px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  },
  topbarSub: { fontSize: 12, color: '#888', marginTop: 2 },
  bellBtn: {
    width: 36, height: 36, borderRadius: '50%', border: '0.5px solid #d1d5db',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', background: 'transparent',
  },
  content: {
    flex: 1, minHeight: 0, width: '100%',
    padding: '16px 24px', boxSizing: 'border-box',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    background: '#fdf4f9',
  },
  pageHeader: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 12, gap: 16,
  },
  pageTitle: { fontSize: 24, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.2' },
  pageCount: { fontSize: 12, color: '#888', marginTop: 3 },
  btnRegister: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '8px 16px', fontSize: 13, border: 'none', borderRadius: 10,
    background: '#e91e8c', color: '#fff', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
  },
  tableCard: {
    background: '#fff', border: '0.5px solid #e5e7eb',
    borderRadius: 14, width: '100%', flex: 1, minHeight: 0,
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  filterRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', borderBottom: '0.5px solid #f0f0f0', flexWrap: 'nowrap',
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
    fontSize: 13, color: '#555', cursor: 'pointer', outline: 'none', background: '#fff',
  },
  selectArrow: { position: 'absolute', right: 8, pointerEvents: 'none' },
  pagination: { display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto', flexShrink: 0 },
  pageInfo: { fontSize: 12, color: '#888', minWidth: 40, textAlign: 'center' },
  pageBtn: {
    width: 30, height: 30, borderRadius: 7, border: '0.5px solid #e5e7eb', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#555', transition: 'background 0.1s',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13, tableLayout: 'fixed', minWidth: 780 },
  th: {
    padding: '9px 16px', textAlign: 'left', verticalAlign: 'middle',
    fontSize: 12, fontWeight: 600, color: '#e91e8c',
    borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap', background: '#fff',
  },
  tr: { borderBottom: '0.5px solid #f5f5f5' },
  td: { padding: '7px 16px', verticalAlign: 'middle', textAlign: 'left', whiteSpace: 'nowrap' },
  stuName: { fontSize: 13, fontWeight: 600, color: '#111' },
  classBadge: { display: 'inline-block', padding: '3px 9px', borderRadius: 6, fontSize: 12, fontWeight: 600 },
  statusBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
    whiteSpace: 'nowrap', flexShrink: 0,
  },
  actions: {
    display: 'flex', alignItems: 'center', gap: 2,
    justifyContent: 'center', flexShrink: 0, overflow: 'visible',
  },
  actionBtn: {
    width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
  },
};