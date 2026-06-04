import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  BlocksIcon as _Blocks,
  BookOpen,
  BriefcaseBusiness,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  Database,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Gauge,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Menu,
  Minus,
  Network,
  Plus,
  RefreshCcw,
  Search,
  Shield,
  SlidersHorizontal,
  Trash2,
  User,
  UserRoundCog,
  Users,
  Wallet,
  X
} from 'lucide-react';
import './styles.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'verifiers', label: 'Verifier Management', icon: UserRoundCog },
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList },
  { id: 'exams', label: 'Exam Management', icon: BookOpen },
  { id: 'blockchain', label: 'Blockchain Status', icon: Database },
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal }
];

const chainTransactions = [];
const verifiers = [];

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthed) {
    return <LoginPage onLogin={() => setIsAuthed(true)} />;
  }

  const title = navItems.find((item) => item.id === page)?.label ?? 'Dashboard';

  return (
    <div className="shell">
      <Sidebar page={page} setPage={setPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      <div className={`workspace ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Topbar
          title={title}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          onNavigate={setPage}
          onLogout={() => setIsAuthed(false)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="content">
          {page === 'dashboard' && <DashboardPage />}
          {page === 'users' && <UsersPage />}
          {page === 'verifiers' && <VerifiersPage />}
          {page === 'audit' && <AuditPage />}
          {page === 'exams' && <ExamManagementPage />}
          {page === 'blockchain' && <BlockchainPage />}
          {page === 'settings' && <SettingsPage />}
          {page === 'profile' && <ProfilePage />}
        </main>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    if (!email.endsWith('@ms.sab.ac.lk')) {
      setError('Access denied: Email must belong to @ms.sab.ac.lk domain.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the token and admin info
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-mark"><Shield size={38} /></div>
        <h1>University Blockchain Identity</h1>
        <p>Admin Dashboard Login</p>
        
        {error && <div style={{ color: '#e74c3c', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center', backgroundColor: '#fdf0f0', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <label>
          Email Address
          <span><User size={16} /><input type="email" placeholder="admin@ms.sab.ac.lk" value={email} onChange={(e) => setEmail(e.target.value)} required /></span>
        </label>
        <label>
          Password
          <span><Lock size={16} /><input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required /></span>
        </label>
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? <><Loader2 className="spinner" size={16} /> Signing in...</> : 'Sign In'}
        </button>
        <small>Only authorized @ms.sab.ac.lk accounts</small>
      </form>
    </main>
  );
}

function Sidebar({ page, setPage, sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }) {
  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="brand" style={{ padding: sidebarCollapsed ? '0 10px' : '0 22px', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', position: 'relative' }}>
          <div className="brand-icon" style={{ display: 'grid', placeItems: 'center' }}><Shield size={20} /></div>
          {!sidebarCollapsed && <strong>University of<br />Blockchain Identity</strong>}
          
          <button 
            className="collapse-btn" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ 
              position: sidebarCollapsed ? 'static' : 'absolute',
              right: sidebarCollapsed ? 'auto' : '15px',
              marginTop: sidebarCollapsed ? '15px' : '0',
              background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px', display: 'grid', placeItems: 'center', borderRadius: '4px' 
            }}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav style={{ padding: sidebarCollapsed ? '6px 8px' : '6px 15px' }}>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              className={page === id ? 'active' : ''}
              key={id}
              onClick={() => { setPage(id); setSidebarOpen(false); }}
              title={sidebarCollapsed ? label : undefined}
              style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start', padding: sidebarCollapsed ? '0' : '0 14px' }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} /> {!sidebarCollapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </aside>
      {sidebarOpen && <button className="scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
    </>
  );
}

function Topbar({ menuOpen, setMenuOpen, onNavigate, onLogout, onOpenSidebar }) {
  const adminUser = JSON.parse(localStorage.getItem('adminUser')) || {};
  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={onOpenSidebar} aria-label="Open navigation"><Menu size={20} /></button>

      <div className="account">
        <button className="account-button" onClick={() => setMenuOpen(!menuOpen)}>
          <CircleUserRound size={22} />
          <span><strong>{adminUser.name || 'Admin'}</strong><small>{adminUser.role || 'System Admin'}</small></span>
          <ChevronDown size={15} />
        </button>
        {menuOpen && (
          <div className="account-menu">
            <strong>My Account</strong>
            <button onClick={() => { onNavigate('profile'); setMenuOpen(false); }}>Profile</button>
            <button onClick={() => { onNavigate('settings'); setMenuOpen(false); }}>Settings</button>
            <button className="logout" onClick={onLogout}><LogOut size={14} /> Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, tone, detail, children }) {
  return (
    <section className="metric-card">
      <div className="metric-label">{Icon && <Icon size={16} />} {label}</div>
      <div className={`metric-value ${tone || ''}`}>{value}</div>
      {detail && <p className={`metric-detail ${tone || ''}`}>{detail}</p>}
      {children}
    </section>
  );
}

function exportAuditPDF(rows, usersMap, title = 'Audit Log Report') {
  const doc = new jsPDF();
  const now = new Date();
  const dateStr = now.toLocaleString();

  doc.setFontSize(16);
  doc.setTextColor(15, 45, 85);
  doc.text('University Blockchain Identity System', 14, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(title, 14, 28);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${dateStr}`, 14, 34);
  doc.text(`Total Records: ${rows.length}`, 14, 40);

  const tableData = rows.map(a => {
    const isVerifierAction = a.event?.includes('Verifier');
    const isStudentActionWithVerifier = a.details?.verifierId;
    
    let userCol = 'Unknown User';
    let verifierCol = 'System';
    
    if (isVerifierAction) {
      userCol = usersMap[a.details?.studentId] || a.details?.studentId || 'Unknown User';
      verifierCol = usersMap[a.userId] || a.userId || 'Unknown Verifier';
    } else if (isStudentActionWithVerifier) {
      userCol = usersMap[a.userId] || a.userId || 'Unknown User';
      verifierCol = usersMap[a.details?.verifierId] || a.details?.verifierId || 'System';
    } else {
      userCol = usersMap[a.userId] || a.userId || 'Unknown User';
      verifierCol = 'System';
    }

    const event = a.event || 'N/A';
    const refId = a.details?.requestId || 'N/A';
    const ip = a.ip || '127.0.0.1';
    const isFail = event.toLowerCase().includes('reject') || event.toLowerCase().includes('fail');
    const status = isFail ? 'Failure' : 'Success';
    const ts = new Date(a.timestamp).toLocaleString();

    return [ts, userCol, event, verifierCol, refId, ip, status];
  });

  doc.autoTable({
    startY: 45,
    head: [['Timestamp', 'User', 'Action', 'Verifier', 'Ref ID', 'IP Address', 'Status']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [15, 45, 85] },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 6) {
        if (data.cell.raw === 'Failure') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  doc.save('audit_log_report.pdf');
}


function DashboardPage() {
  const adminUser = JSON.parse(localStorage.getItem('adminUser')) || {};
  const [users, setUsers] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [verifiers, setVerifiers] = useState([]);
  const [audits, setAudits] = useState([]);
  
  const [managingRole, setManagingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [savingRole, setSavingRole] = useState(false);


  useEffect(() => {
    const fetchData = () => {
      fetch(`http://${window.location.hostname}:5000/api/admin/students`).then(res => res.json()).then(data => setUsers(data.students || []));
      fetch(`http://${window.location.hostname}:5000/api/admin/verifications`).then(res => res.json()).then(data => setVerifications(data.verifications || []));
      fetch(`http://${window.location.hostname}:5000/api/admin/verifiers`).then(res => res.json()).then(data => setVerifiers(data.verifiers || []));
      fetch(`http://${window.location.hostname}:5000/api/admin/audits`).then(res => res.json()).then(data => setAudits(data.audits || []));
    };
    
    fetchData(); // Fetch immediately on mount
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const totalUsers = users.length;
  const pendingUsers = users.filter(u => u.isVerified === false).length;
  const pendingRequests = verifications.filter(v => v.status === 'Pending').length;
  const inProgressRequests = verifications.filter(v => v.status === 'Approved').length; 
  const successfulActionsToday = audits.filter(a => {
    const isToday = new Date(a.timestamp).toDateString() === new Date().toDateString();
    const isSuccess = !a.event.toLowerCase().includes('reject') && !a.event.toLowerCase().includes('fail');
    return isToday && isSuccess;
  }).length;
  
  const usersMap = {
    ...Object.fromEntries(users.map(u => [u.id, u.name])),
    ...Object.fromEntries(verifiers.map(v => [v.id, v.name]))
  };

  const handleUpdateRole = async () => {
    if (!managingRole) return;
    setSavingRole(true);
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/admin/verifiers/${managingRole.id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      });
      if (!res.ok) throw new Error('Failed to update role');
      setVerifiers(prev => prev.map(v => v.id === managingRole.id ? { ...v, role: selectedRole } : v));
      setManagingRole(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingRole(false);
    }
  };

  return (
    <>
      <PageHeader title="Dashboard Overview" subtitle="System vitals and pending verification actions" />
      <div className="dashboard-grid">
        <MetricCard label="Total Enrolled Students" value={totalUsers.toString()} icon={Users} detail="Live database feed">
          <MiniLine />
        </MetricCard>
        <MetricCard label="Polygon Gas Balance (MATIC)" value="12.47" icon={Wallet} tone="danger" detail="Daily Consumption: ~2.3 MATIC  Est. Days Remaining: 5 days">
          <div className="alert-box"><AlertTriangle size={14} /> Low Balance Alert: Gas balance is below threshold. Please top up to ensure continuous blockchain operations.</div>
        </MetricCard>
        <MetricCard label="Avg. AI Face Match Time" value="1.24s" icon={Gauge} detail={`Total Verifications: ${verifications.length}`}>
          <div className="target-row"><span>Performance Target:</span><strong>&lt; 2.0s</strong></div>
          <div className="progress"><span style={{ width: '86%' }} /></div>
        </MetricCard>
      </div>

      <h2 className="section-title">Pending verification requests</h2>
      <div className="mini-metrics">
        <MetricCard label="Pending Verifications" value={pendingRequests.toString()} />
        <MetricCard label="Approved Verifications" value={inProgressRequests.toString()} />
        <MetricCard label="Pending Students" value={pendingUsers.toString()} />
        <MetricCard label="Completed Today" value={successfulActionsToday.toString()} />
      </div>

      <Panel
        title="Audit Logs"
        subtitle="Group 14 Requirement: Detailed system activity tracking"
        action={
          <button className="ghost-btn" onClick={() => exportAuditPDF(audits, usersMap)}>
            <Download size={14} /> Export Logs
          </button>
        }
      >
        <AuditTable
          compact
          customRows={audits}
          usersMap={usersMap}
        />
      </Panel>

      <Panel title="Role Management" subtitle="Manage staff access and verifier permissions">
        <table>
          <thead><tr><th>Verifier ID</th><th>Name</th><th>Email</th><th>Department</th><th>Current Role</th><th>Actions</th></tr></thead>
          <tbody>
            {verifiers.map((v) => (
              <tr key={v.id}>
                <td>{v.id.substring(0, 8)}</td>
                <td>{v.name}</td>
                <td>{v.email}</td>
                <td>{v.department || 'N/A'}</td>
                <td><Badge tone={v.role === 'Admin' ? 'danger' : 'success'}>{v.role || 'verifier'}</Badge></td>
                <td><button className="small-btn" onClick={() => { setManagingRole(v); setSelectedRole(v.role || 'verifier'); }}>Manage Role <ChevronDown size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <div className="center-action"><button className="primary-btn"><FileText size={15} /> Generate System Report for {adminUser.name || 'Admin'}</button></div>

      {managingRole && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--card)', borderRadius: '1rem', padding: '2rem', width: '400px', maxWidth: '95vw', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Manage Role</h2>
              <button onClick={() => setManagingRole(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              Assign a new role to <strong>{managingRole.name}</strong>.
            </p>
            <div>
              <select 
                value={selectedRole} 
                onChange={e => setSelectedRole(e.target.value)}
                style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '7px', border: '1px solid var(--line)', background: '#fff', color: '#334155', fontSize: '14px', marginBottom: '1.5rem' }}
              >
                <option value="verifier">Verifier (Standard)</option>
                <option value="Admin">Admin (Full Access)</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="ghost-btn" onClick={() => setManagingRole(null)}>Cancel</button>
              <button className="primary-btn" onClick={handleUpdateRole} disabled={savingRole}>
                {savingRole ? 'Saving...' : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UsersPage() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [verifying, setVerifying] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = () => {
      fetch(`http://${window.location.hostname}:5000/api/admin/students`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
            console.log('[UsersPage] raw data from API:', data);
            const formatted = (data.students || []).map(s => {
              let verifStatus = s.verificationStatus;
              if (!verifStatus) {
                verifStatus = s.isVerified ? 'Verified' : 'Pending';
              }
              return {
                id: s.id,
                name: s.name || 'N/A',
                nic: s.nic || 'N/A',
                email: s.email || 'N/A',
                date: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : 'N/A',
                status: s.isVerified ? 'Active' : 'Pending',
                verification: verifStatus,
                original: s
              };
            });
            console.log('[UsersPage] formatted students:', formatted.length);
          setStudents(formatted);
          setLoading(false);
        })
        .catch(err => {
          console.error('[UsersPage] fetch error:', err);
          setLoading(false);
        });
    };

    fetchStudents();
    const interval = setInterval(fetchStudents, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.nic.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  });

  const total = students.length;
  const verified = students.filter(s => s.verification === 'Verified').length;
  const pending = total - verified;

  const handleAddStudent = () => {
    alert("For security reasons, students must register themselves via the Student Portal to undergo automated Identity Verification.");
  };

  const handleStatusChange = async (studentId, newStatus) => {
    setVerifying(true);
    try {
      const isVerified = newStatus === 'Verified';
      const res = await fetch(`http://${window.location.hostname}:5000/api/admin/students/${studentId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update verification status');
      
      // Update local state temporarily
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status: isVerified ? 'Active' : 'Pending', verification: newStatus } : s));
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(prev => ({ ...prev, status: isVerified ? 'Active' : 'Pending', verification: newStatus }));
      }
      
    } catch (err) {
      alert(err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <PageHeader title="User Management" subtitle="Manage student accounts and verification status" action={<button className="primary-btn" onClick={handleAddStudent}><Plus size={15} /> Add New Student</button>} />
      <div className="stats-row">
        <MetricCard icon={Users} label="Total Students" value={total.toString()} />
        <MetricCard label="Verified" value={verified.toString()} tone="success" />
        <MetricCard label="Pending Verification" value={pending.toString()} tone="warning" />
      </div>
      <Panel title="Student Directory" subtitle="Search and manage student records" action={<div className="table-search"><Search size={14} /><input placeholder="Search by name, NIC, or email" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>}>
        <table>
          <thead><tr><th>Student Name</th><th>NIC</th><th>Email</th><th>Enrolled Date</th><th>Status</th><th>Verification</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Loading students...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>{students.length === 0 ? 'No students registered yet.' : 'No students match your search.'}</td></tr>
            ) : filteredStudents.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.nic}</td>
                <td>{row.email}</td>
                <td>{row.date}</td>
                <td><Badge tone={row.status === 'Pending' ? 'neutral' : 'success'}>{row.status}</Badge></td>
                <td>
                  <select 
                    value={row.verification} 
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    disabled={verifying}
                    style={{ 
                      padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', 
                      background: row.verification === 'Verified' ? '#ecfdf5' : row.verification === 'Rejected' ? '#fef2f2' : '#f8fafc', 
                      color: row.verification === 'Verified' ? '#16a34a' : row.verification === 'Rejected' ? '#dc2626' : '#64748b', 
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none' 
                    }}
                  >
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td><button className="small-btn" onClick={() => setSelectedStudent(row)}>View Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--card)', borderRadius: '1rem', padding: '2rem', width: '500px', maxWidth: '95vw', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Student Details</h2>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            </div>
            <div className="form-grid">
              <ReadField label="Full Name" value={selectedStudent.name} />
              <ReadField label="NIC Number" value={selectedStudent.nic} />
              <ReadField label="Email Address" value={selectedStudent.email} />
              <ReadField label="Registration Date" value={selectedStudent.date} />
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <select 
                  value={selectedStudent.verification} 
                  onChange={(e) => handleStatusChange(selectedStudent.id, e.target.value)}
                  disabled={verifying}
                  style={{ 
                    padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', 
                    background: 'var(--card)', color: 'var(--text)', fontSize: '13px', 
                    fontWeight: 600, cursor: 'pointer', outline: 'none' 
                  }}
                >
                  <option value="Verified">Set as Verified</option>
                  <option value="Pending">Set as Pending</option>
                  <option value="Rejected">Set as Rejected</option>
                </select>
              </div>
              <button className="ghost-btn" onClick={() => setSelectedStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AuditPage() {
  const [audits, setAudits] = useState([]);
  const [successful, setSuccessful] = useState(0);
  const [activeVerifiers, setActiveVerifiers] = useState(0);
  const [usersMap, setUsersMap] = useState({});

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    const fetchAudits = () => {
      fetch(`http://${window.location.hostname}:5000/api/admin/audits`)
        .then(res => res.json())
        .then(data => {
          setAudits(data.audits || []);
          setSuccessful((data.audits || []).filter(a => !a.event.toLowerCase().includes('reject') && !a.event.toLowerCase().includes('fail')).length);
        });

      fetch(`http://${window.location.hostname}:5000/api/admin/verifiers`)
        .then(res => res.json())
        .then(data => {
          setActiveVerifiers((data.verifiers || []).length);
          return data.verifiers || [];
        })
        .then(verifiers => {
          fetch(`http://${window.location.hostname}:5000/api/admin/students`)
            .then(res => res.json())
            .then(data => {
              const students = data.students || [];
              const map = {};
              students.forEach(s => map[s.id] = s.name);
              verifiers.forEach(v => map[v.id] = v.name);
              setUsersMap(map);
            });
        });
    };

    fetchAudits();
    const interval = setInterval(fetchAudits, 3000);
    return () => clearInterval(interval);
  }, []);

  // Derive unique action types for the dropdown
  const actionTypes = useMemo(() => {
    const types = [...new Set(audits.map(a => a.event).filter(Boolean))];
    return types;
  }, [audits]);

  // Apply all filters
  const filteredAudits = useMemo(() => {
    return audits.filter(a => {
      const q = searchQuery.toLowerCase();
      const userName = (usersMap[a.userId] || a.userId || '').toLowerCase();
      const event = (a.event || '').toLowerCase();
      const refId = (a.details?.requestId || '').toLowerCase();
      const matchesSearch = !q || userName.includes(q) || event.includes(q) || refId.includes(q);

      const matchesAction = actionFilter === 'All Actions' || a.event === actionFilter;

      const isFail = a.event.toLowerCase().includes('reject') || a.event.toLowerCase().includes('fail');
      const statusLabel = isFail ? 'Failure' : 'Success';
      const matchesStatus = statusFilter === 'All Status' || statusLabel === statusFilter;

      return matchesSearch && matchesAction && matchesStatus;
    });
  }, [audits, usersMap, searchQuery, actionFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setActionFilter('All Actions');
    setStatusFilter('All Status');
  };

  const handleExport = () => {
    exportAuditPDF(filteredAudits, usersMap, 'Complete Audit Trail Report');
  };

  return (
    <>
      <PageHeader title="Audit Logs" subtitle="Complete system activity history and compliance tracking" />
      <div className="stats-row four">
        <MetricCard label="Total Events Logged" value={audits.length.toString()} />
        <MetricCard label="Successful Actions" value={successful.toString()} tone="success" />
        <MetricCard label="Failed Actions" value={(audits.length - successful).toString()} tone="danger" />
        <MetricCard label="Active Verifiers" value={activeVerifiers.toString()} />
      </div>
      <Panel
        title="Complete Audit Trail"
        subtitle={`All system events with detailed tracking ${filteredAudits.length !== audits.length ? `— showing ${filteredAudits.length} of ${audits.length}` : ''}`}
        action={
          <>
            <button className="primary-btn" onClick={handleExport}><Download size={14} /> Export CSV</button>
          </>
        }
      >
        <div className="filters">
          <div className="table-search">
            <Search size={14} />
            <input
              placeholder="Search by event, user, or ref ID"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
            <option>All Actions</option>
            {actionTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>Success</option>
            <option>Failure</option>
          </select>
          <button
            className="ghost-btn"
            onClick={handleClearFilters}
            disabled={!searchQuery && actionFilter === 'All Actions' && statusFilter === 'All Status'}
          >
            Clear Filters
          </button>
        </div>
        <AuditTable customRows={filteredAudits} usersMap={usersMap} />
      </Panel>
    </>
  );
}

function ExamManagementPage() {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const emptyForm = { courseCode: '', courseName: '', description: '', date: '', time: '', duration: 1, proctoring: 'Online Proctored', capacity: 50, status: 'Open' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetchExams = () => {
      fetch(`http://${window.location.hostname}:5000/api/exam`)
        .then(res => res.json())
        .then(data => setExams(data.exams || []));
    };
    fetchExams();
    const interval = setInterval(fetchExams, 3000);
    return () => clearInterval(interval);
  }, []);

  const openCreate = () => { setEditExam(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (exam) => { setEditExam(exam); setForm({ ...exam }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditExam(null); setForm(emptyForm); };

  const handleFormChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.courseCode || !form.courseName || !form.date || !form.time) {
      alert('Course Code, Name, Date, and Time are required.');
      return;
    }
    setSaving(true);
    try {
      const url = editExam ? `http://${window.location.hostname}:5000/api/exam/${editExam.id}` : `http://${window.location.hostname}:5000/api/exam`;
      const method = editExam ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed to save exam');
      closeModal();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`http://${window.location.hostname}:5000/api/exam/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete exam');
    } catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  const openCount = exams.filter(e => e.status === 'Open').length;
  const fullCount = exams.filter(e => e.status === 'Full').length;
  const totalEnrolled = exams.reduce((sum, e) => sum + (parseInt(e.enrolled) || 0), 0);

  return (
    <>
      <PageHeader title="Exam Management" subtitle="Create, edit and manage all exam subjects for the student portal" action={<button className="primary-btn" onClick={openCreate}><Plus size={15} /> Create New Exam</button>} />
      <div className="stats-row four">
        <MetricCard icon={BookOpen} label="Total Exams" value={exams.length.toString()} detail="Live from database" />
        <MetricCard label="Open Exams" value={openCount.toString()} tone="success" detail="Accepting enrollments" />
        <MetricCard label="Full Exams" value={fullCount.toString()} tone="danger" detail="No seats available" />
        <MetricCard icon={Users} label="Total Enrollments" value={totalEnrolled.toString()} detail="Across all exams" />
      </div>
      <Panel title="All Exams" subtitle="Manage exam schedules and availability" action={<div className="table-search"><Search size={14} /><input placeholder="Search exams..." /></div>}>
        <table>
          <thead><tr><th>Course Code</th><th>Course Name</th><th>Date</th><th>Time</th><th>Duration</th><th>Capacity</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {exams.length === 0 && <tr><td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>No exams yet. Click "Create New Exam" to add one.</td></tr>}
            {exams.map(exam => (
              <tr key={exam.id}>
                <td><strong>{exam.courseCode}</strong></td>
                <td>{exam.courseName}</td>
                <td>{exam.date}</td>
                <td>{exam.time}</td>
                <td>{exam.duration}h</td>
                <td>{exam.capacity}</td>
                <td>{exam.enrolled || 0}</td>
                <td><Badge tone={exam.status === 'Open' ? 'success' : exam.status === 'Full' ? 'danger' : 'neutral'}>{exam.status}</Badge></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="small-btn" onClick={() => openEdit(exam)}><Edit3 size={13} /> Edit</button>
                    <button className="small-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(exam.id)} disabled={deleting === exam.id}>
                      <Trash2 size={13} /> {deleting === exam.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--card)', borderRadius: '1rem', padding: '2rem', width: '580px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{editExam ? 'Edit Exam' : 'Create New Exam'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            </div>
            <div className="form-grid">
              <ReadField label="Course Code (e.g. MATH-401)" value={form.courseCode} onChange={handleFormChange('courseCode')} readOnly={false} />
              <ReadField label="Course Name" value={form.courseName} onChange={handleFormChange('courseName')} readOnly={false} />
              <ReadField label="Description" value={form.description} onChange={handleFormChange('description')} readOnly={false} />
              <ReadField label="Date (YYYY-MM-DD)" value={form.date} onChange={handleFormChange('date')} readOnly={false} />
              <ReadField label="Time (e.g. 10:00 AM)" value={form.time} onChange={handleFormChange('time')} readOnly={false} />
              <ReadField label="Duration (hours)" value={form.duration} onChange={handleFormChange('duration')} readOnly={false} />
              <ReadField label="Capacity (seats)" value={form.capacity} onChange={handleFormChange('capacity')} readOnly={false} />
              <ReadField label="Proctoring Type" value={form.proctoring} onChange={handleFormChange('proctoring')} readOnly={false} />
              <div>
                <label style={{ display: 'block', color: '#334155', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Status</label>
                <select value={form.status} onChange={handleFormChange('status')} style={{ width: '100%', height: '38px', padding: '0 12px', background: '#fff', border: '1px solid var(--line)', borderRadius: '7px', color: '#334155', fontSize: '15px' }}>
                  <option value="Open">Open</option>
                  <option value="Full">Full</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="ghost-btn" onClick={closeModal}>Cancel</button>
              <button className="primary-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editExam ? 'Save Changes' : 'Create Exam'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BlockchainPage() {
  const [verifications, setVerifications] = useState([]);
  const [gasPrice, setGasPrice] = useState('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch verifications from our backend
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/admin/verifications`);
        const data = await res.json();
        setVerifications(data.verifications || []);
      } catch (err) { console.error('Error fetching verifications', err); }

      // Fetch live Polygon Gas Price via public RPC
      try {
        const rpcRes = await fetch('https://rpc.ankr.com/polygon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1 })
        });
        const rpcData = await rpcRes.json();
        if (rpcData.result) {
          const gasInWei = parseInt(rpcData.result, 16);
          const gasInGwei = (gasInWei / 1000000000).toFixed(1);
          setGasPrice(`${gasInGwei} Gwei`);
        } else {
          setGasPrice('32.4 Gwei'); // Fallback if format is weird
        }
      } catch (err) {
        setGasPrice('32.4 Gwei'); // Fallback if RPC fails
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds for live updates
    return () => clearInterval(interval);
  }, []);

  const totalTxs = verifications.filter(v => v.status === 'Approved').length;
  const transactionsToday = verifications.filter(v => v.status === 'Approved' && new Date(v.timestamp).toDateString() === new Date().toDateString()).length;

  return (
    <>
      <PageHeader title="Blockchain Status" subtitle="Polygon Network monitoring and transaction analytics" />
      <div className="stats-row four">
        <MetricCard icon={Activity} label="Network Status" value="Online" tone="success" detail="Live streaming" />
        <MetricCard icon={_Blocks} label="Current Gas Price" value={gasPrice} detail="Fetched from Polygon RPC" />
        <MetricCard icon={Network} label="Transactions Today" value={transactionsToday.toString()} tone="success" detail="Live from database" />
        <MetricCard label="Block Confirmation Time" value="~2.3s" detail="Average" />
      </div>
      <Panel title="Gas Usage Analytics" subtitle="24-hour MATIC consumption tracking">
        <div className="area-chart">
          <svg viewBox="0 0 820 260" preserveAspectRatio="none" aria-label="Gas usage chart">
            <defs><linearGradient id="gasFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#082f5f" stopOpacity=".78" /><stop offset="100%" stopColor="#dbe2ea" stopOpacity=".9" /></linearGradient></defs>
            <path d="M0,188 C90,198 135,202 165,189 C240,154 275,125 335,103 C395,80 435,92 505,112 C610,142 655,160 820,180 L820,260 L0,260 Z" fill="url(#gasFill)" />
            <path d="M0,188 C90,198 135,202 165,189 C240,154 275,125 335,103 C395,80 435,92 505,112 C610,142 655,160 820,180" fill="none" stroke="#062f5c" strokeWidth="4" />
          </svg>
        </div>
        <div className="warning-band"><AlertTriangle size={15} /> <strong>Gas Balance Alert:</strong> Current balance is 12.47 MATIC. Daily consumption averages 2.3 MATIC. Please top up within 5 days.</div>
      </Panel>
      <Panel title="Recent Blockchain Transactions" subtitle="Latest verifications written to Polygon mainnet" action={<a href="https://polygonscan.com" target="_blank" rel="noopener noreferrer" className="ghost-btn" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:'5px'}}><ExternalLink size={14} /> View on PolygonScan</a>}>
        <table>
          <thead><tr><th>Reference ID</th><th>Timestamp</th><th>Student ID</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>
            {verifications.filter(v => v.status === 'Approved').slice(0, 10).map((v) => (
              <tr key={v.id}>
                <td style={{fontFamily:'monospace',fontSize:'12px',color:'#64748b'}}>
                  {v.blockchainTx ? v.blockchainTx.slice(0, 20) + '…' : v.id.slice(0, 16) + '…'}
                </td>
                <td>{new Date(v.timestamp).toLocaleString()}</td>
                <td style={{fontFamily:'monospace',fontSize:'12px'}}>{v.studentId ? v.studentId.slice(0, 12) + '…' : 'N/A'}</td>
                <td>Verification Issued</td>
                <td><Badge tone="success">Confirmed</Badge></td>
              </tr>
            ))}
            {verifications.filter(v => v.status === 'Approved').length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>No blockchain transactions yet</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
      <Panel className="outlined" title="Smart Contract Information">
        <div className="info-grid">
          <Info label="Contract Address" value="0x742d35Cc6634C0532925a3b844Bc9e7595f6bEb1" />
          <Info label="Network" value="Polygon Mainnet" />
          <Info label="Contract Version" value="v2.1.4" />
          <Info label="Total Verifications Stored" value={totalTxs.toString()} />
        </div>
      </Panel>
    </>
  );
}

function ProfilePage() {
  const [adminUser, setAdminUser] = useState(() => JSON.parse(localStorage.getItem('adminUser')) || {});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(adminUser);
  const [loading, setLoading] = useState(false);
  const [actionsToday, setActionsToday] = useState(0);
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(adminUser.profilePic || null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProfileAudits = () => {
      fetch(`http://${window.location.hostname}:5000/api/admin/audits`)
        .then(res => res.json())
        .then(data => {
          const todayActions = (data.audits || []).filter(a => {
            const isToday = new Date(a.timestamp).toDateString() === new Date().toDateString();
            const isMe = a.userId === adminUser.name || a.userId === adminUser.id;
            return isToday && isMe;
          });
          setActionsToday(todayActions.length);
        });
    };
    
    fetchProfileAudits();
    const interval = setInterval(fetchProfileAudits, 3000);
    return () => clearInterval(interval);
  }, [adminUser]);

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(adminUser); // reset fields on cancel
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/admin/profile/${adminUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');
      
      setAdminUser(data.admin);
      setFormData(data.admin);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });
  
  // Format join date safely
  const joinDate = adminUser.createdAt ? new Date(adminUser.createdAt).toISOString().split('T')[0] : 'N/A';

  return (
    <>
      <PageHeader title="My Profile" subtitle="Manage your account information and preferences" />
      <div className="profile-grid">
        <Panel 
          className="profile-main" 
          title="Personal Information" 
          subtitle="Update your personal details and contact information" 
          action={
            isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="ghost-btn" onClick={handleEditToggle}>Cancel</button>
                <button className="primary-btn" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
              </div>
            ) : (
              <button className="primary-btn" onClick={handleEditToggle}><Edit3 size={14} /> Edit Profile</button>
            )
          }
        >
          <div className="avatar-large" style={{ position: 'relative' }}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" style={{ width: '105px', height: '105px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <User size={58} />
            )}
            {isEditing && (
              <div 
                style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'white', color: 'var(--navy)', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={14} />
              </div>
            )}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleProfilePicChange} />
          </div>
          <div className="form-grid">
            <ReadField label="Full Name" icon={User} value={formData.name || ''} onChange={handleChange('name')} readOnly={!isEditing} />
            <ReadField label="Email Address" icon={BriefcaseBusiness} value={formData.email || ''} readOnly />
            <ReadField label="Phone Number" icon={CircleUserRound} value={formData.phone || ''} onChange={handleChange('phone')} readOnly={!isEditing} />
            <ReadField label="Department" icon={Database} value={formData.department || ''} readOnly />
            <ReadField label="Employee ID" icon={BadgeCheck} value={formData.employeeId || ''} readOnly />
            <ReadField label="Join Date" icon={Calendar} value={joinDate} readOnly />
          </div>
        </Panel>
        <div className="side-stack">
          <Panel title="Account Status"><StatusRow label="Role" value={adminUser.role || "System Admin"} /><StatusRow label="Status" value="Active" tone="success" /><StatusRow label="2FA" value="Enabled" tone="success" /></Panel>
          <Panel title="Activity Summary"><Info label="Last Login" value="Just now" /><Info label="Total Actions Today" value={`${actionsToday} actions`} /><Info label="Reports Generated" value="12 reports" /></Panel>
          <Panel title="Security">
            <button className="wide-btn" onClick={() => alert('A password reset link has been sent to your registered email.')}>Change Password</button>
            <button className="wide-btn" onClick={() => alert('2FA via SMS or Authenticator requires Google Cloud Identity Platform (Paid subscription). This feature is disabled on the free tier.')}>Manage 2FA</button>
            <button className="wide-btn" onClick={() => alert('Active Sessions:\n\n1. Current Device (Active now)\n2. Mobile Device (Last active: Yesterday)')}>Active Sessions</button>
          </Panel>
        </div>
      </div>
    </>
  );
}

function VerifiersPage() {
  const API = `http://${window.location.hostname}:5000/api`;
  const [verifiers, setVerifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', employeeId: '' });

  const fetchVerifiers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/verifiers`);
      const data = await res.json();
      setVerifiers(data.verifiers || []);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVerifiers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/admin/verifiers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Failed to create verifier'); return; }
      setSuccessMsg(`✅ Verifier "${form.name}" created! They can log in with email: ${form.email} and the password you set.`);
      setForm({ name: '', email: '', password: '', department: '', employeeId: '' });
      setShowForm(false);
      fetchVerifiers();
      setTimeout(() => setSuccessMsg(''), 8000);
    } catch { setFormError('Network error. Is the backend running?'); }
    finally { setSubmitting(false); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/admin/verifiers/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Failed to update verifier'); return; }
      setSuccessMsg(`✅ Verifier "${form.name}" updated successfully!`);
      setForm({ name: '', email: '', password: '', department: '', employeeId: '' });
      setEditingId(null);
      setShowForm(false);
      fetchVerifiers();
      setTimeout(() => setSuccessMsg(''), 8000);
    } catch { setFormError('Network error. Is the backend running?'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this verifier account? They will no longer be able to log in.')) return;
    setDeleteId(id);
    try {
      const res = await fetch(`${API}/admin/verifiers/${id}`, { method: 'DELETE' });
      if (res.ok) { fetchVerifiers(); setSuccessMsg('Verifier account deleted.'); setTimeout(() => setSuccessMsg(''), 4000); }
    } catch { /* silent */ } finally { setDeleteId(null); }
  };

  return (
    <>
      <PageHeader title="Verifier Management" subtitle="Create and manage verifier accounts" />

      {successMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', color: '#166534', fontSize: '0.875rem', lineHeight: 1.6 }}>
          {successMsg}
        </div>
      )}

      <Panel title="Verifier Accounts" subtitle={loading ? 'Loading…' : `${verifiers.length} verifier${verifiers.length !== 1 ? 's' : ''} registered`} icon={UserRoundCog}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button className={showForm ? 'ghost-btn' : 'primary-btn'} onClick={() => { setShowForm(!showForm); setFormError(''); setEditingId(null); setForm({ name: '', email: '', password: '', department: '', employeeId: '' }); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', ...(showForm ? { background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' } : {}) }}>
            {showForm ? <Minus size={16} /> : <Plus size={16} />} {showForm ? 'Cancel' : 'Add Verifier'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={editingId ? handleEditSubmit : handleAdd} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>{editingId ? 'Edit Verifier Account' : 'New Verifier Account'}</h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>These credentials will be used to log into the Verifier Dashboard.</p>
            </div>
            {formError && <div style={{ gridColumn: '1 / -1', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.6rem 0.9rem', color: '#dc2626', fontSize: '0.82rem' }}>{formError}</div>}
            {[
              { label: 'Full Name *', key: 'name', placeholder: 'e.g. John Smith', type: 'text' },
              { label: 'Email Address *', key: 'email', placeholder: 'john.smith@ms.sab.ac.lk', type: 'email' },
              { label: editingId ? 'Password' : 'Password *', key: 'password', placeholder: editingId ? 'Leave blank to keep unchanged' : 'Min. 8 characters', type: 'password' },
              { label: 'Employee ID', key: 'employeeId', placeholder: 'e.g. VER-003', type: 'text' },
              { label: 'Department', key: 'department', placeholder: 'e.g. Student Affairs', type: 'text' },
            ].map(({ label, key, placeholder, type }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>{label}</label>
                <input
                  type={type}
                  required={label.endsWith('*')}
                  value={form[key]}
                  onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <button type="button" className="ghost-btn" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
              <button type="submit" className="primary-btn" disabled={submitting}>
                {submitting ? (editingId ? 'Updating…' : 'Creating…') : (editingId ? 'Update Verifier' : 'Create Verifier Account')}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading verifiers…</div>
        ) : verifiers.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No verifier accounts yet. Click "Add Verifier" to create one.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {verifiers.map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.name || '—'}</td>
                    <td>{v.email}</td>
                    <td>{v.employeeId || '—'}</td>
                    <td>{v.department || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {v.lastLogin ? new Date(v.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingId(v.id);
                          setForm({ name: v.name || '', email: v.email || '', password: '', department: v.department || '', employeeId: v.employeeId || '' });
                          setShowForm(true);
                          setFormError('');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#334155', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, marginRight: '0.5rem' }}
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        disabled={deleteId === v.id}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <Trash2 size={13} /> {deleteId === v.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title="Login Instructions" subtitle="Share these details with your verifiers" icon={Shield}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '1rem', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dashboard URL</p>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.875rem', color: '#1e293b', fontWeight: 600 }}>{window.location.protocol}//{window.location.hostname}:5174</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>The verifier dashboard runs on port 5174 by default</p>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '1rem', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Credentials</p>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.875rem', color: '#1e293b' }}>Email + Password you set when creating their account</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>Passwords are hashed — they cannot be recovered, only reset</p>
          </div>
        </div>
      </Panel>
    </>
  );
}

function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeUsers, setActiveUsers] = useState('Loading...');

  const fetchSettings = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    
    const fetchActiveUsers = () => {
      Promise.all([
        fetch(`http://${window.location.hostname}:5000/api/admin/students`).then(res => res.json()),
        fetch(`http://${window.location.hostname}:5000/api/admin/verifiers`).then(res => res.json())
      ]).then(([studentsData, verifiersData]) => {
        const sCount = (studentsData.students || []).length;
        const vCount = (verifiersData.verifiers || []).length;
        setActiveUsers(`${sCount} students, ${vCount} verifiers`);
      });
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = (section, field) => (newValue) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newValue
      }
    }));
  };

  const handleChange = (section, field) => (e) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Error saving settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

  return (
    <>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />
      <div className="settings-pair">
        <Panel title="Notifications" subtitle="Configure alert preferences" icon={Bell}>
          <Toggle label="Email Notifications" detail="Receive email alerts for critical events" on={settings.notifications?.emailAlerts} onChange={handleToggle('notifications', 'emailAlerts')} />
          <Toggle label="Low Gas Balance Alert" detail="Alert when MATIC balance is low" on={settings.notifications?.lowGasAlerts} onChange={handleToggle('notifications', 'lowGasAlerts')} />
          <Toggle label="Verification Queue Alerts" detail="Notify when queue exceeds threshold" on={settings.notifications?.queueAlerts} onChange={handleToggle('notifications', 'queueAlerts')} />
        </Panel>
        <Panel title="Security Settings" subtitle="Access control and authentication" icon={Shield}>
          <Toggle label="Two-Factor Authentication" detail="Enable 2FA for admin access" on={settings.security?.twoFactor} onChange={handleToggle('security', 'twoFactor')} />
          <Toggle label="Session Timeout" detail="Auto-logout after inactivity" on={settings.security?.sessionTimeout} onChange={handleToggle('security', 'sessionTimeout')} />
          <Toggle label="IP Whitelist" detail="Restrict access to specific IP ranges" on={settings.security?.ipWhitelist} onChange={handleToggle('security', 'ipWhitelist')} />
        </Panel>
      </div>
      <Panel title="Blockchain Configuration" subtitle="Polygon network and smart contract settings" icon={Database}>
        <div className="form-grid">
          <ReadField label="Polygon RPC URL" value={settings.blockchain?.rpcUrl || ''} onChange={handleChange('blockchain', 'rpcUrl')} readOnly={false} />
          <ReadField label="Smart Contract Address" value={settings.blockchain?.contractAddress || ''} onChange={handleChange('blockchain', 'contractAddress')} readOnly={false} />
          <ReadField label="Gas Limit" value={settings.blockchain?.gasLimit || ''} onChange={handleChange('blockchain', 'gasLimit')} readOnly={false} />
          <ReadField label="Low Balance Threshold (MATIC)" value={settings.blockchain?.lowBalanceThreshold || ''} onChange={handleChange('blockchain', 'lowBalanceThreshold')} readOnly={false} />
        </div>
      </Panel>
      <Panel title="API Keys & Credentials" subtitle="Manage external service integrations" icon={KeyRound}>
        <ReadField label="Wallet Private Key (Encrypted)" value={settings.credentials?.privateKey || ''} onChange={handleChange('credentials', 'privateKey')} readOnly={false} />
        <ReadField label="AI Face Recognition API Key" value={settings.credentials?.aiApiKey || ''} onChange={handleChange('credentials', 'aiApiKey')} readOnly={false} />
        <ReadField label="Email SMTP Configuration" value={settings.credentials?.smtpConfig || ''} onChange={handleChange('credentials', 'smtpConfig')} readOnly={false} />
      </Panel>
      <Panel className="outlined" title="System Information">
        <div className="info-grid three">
          <Info label="System Version" value="v1.0.0" />
          <Info label="Last Update" value={new Date().toLocaleDateString()} />
          <Info label="Database" value="Firebase Realtime DB" />
          <Info label="Active Users" value={activeUsers} />
          <Info label="Session Uptime" value={(() => { const s = Math.floor(performance.now() / 1000); if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s/60)}m ${s%60}s`; return `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m`; })()} />
          <Info label="Server" value="Google Cloud (Firebase)" />
        </div>
      </Panel>
      <div className="button-row"><button className="ghost-btn" onClick={fetchSettings}><RefreshCcw size={14} /> Reset to Saved</button><button className="primary-btn" onClick={handleSave} disabled={saving}><Download size={14} /> {saving ? 'Saving...' : 'Save All Changes'}</button></div>
    </>
  );
}

function Panel({ title, subtitle, action, children, className = '', icon: Icon }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <div>{title && <h2>{Icon && <Icon size={18} />} {title}</h2>}{subtitle && <p>{subtitle}</p>}</div>
        <div className="panel-actions">{action}</div>
      </div>
      {children}
    </section>
  );
}

function AuditTable({ compact = false, customRows = [], usersMap = {} }) {
  // Use customRows from live API if provided, else dummy data fallback
  const fallbackRows = [
    ['2026-03-25 14:32:15', 'System User', 'Verification Event', 'Admin', 'N/A', '192.168.1.1', 'Success']
  ];
  
  const mappedRows = customRows.length > 0 ? customRows.map(a => {
    const isVerifierAction = a.event?.includes('Verifier');
    const isStudentActionWithVerifier = a.details?.verifierId;
    
    let userCol = 'Unknown User';
    let verifierCol = 'System';
    
    if (isVerifierAction) {
      userCol = usersMap[a.details?.studentId] || a.details?.studentId || 'Unknown User';
      verifierCol = usersMap[a.userId] || a.userId || 'Unknown Verifier';
    } else if (isStudentActionWithVerifier) {
      userCol = usersMap[a.userId] || a.userId || 'Unknown User';
      verifierCol = usersMap[a.details?.verifierId] || a.details?.verifierId || 'System';
    } else {
      userCol = usersMap[a.userId] || a.userId || 'Unknown User';
      verifierCol = 'System';
    }

    return [
      new Date(a.timestamp).toLocaleString(),
      userCol,
      a.event,
      verifierCol,
      a.details?.requestId || 'N/A',
      a.ip || '127.0.0.1',
      a.event.toLowerCase().includes('reject') || a.event.toLowerCase().includes('fail') ? 'Failure' : 'Success'
    ];
  }) : fallbackRows;

  const rows = compact ? mappedRows.slice(0, 7) : mappedRows;
  
  return (
    <table>
      <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Verifier</th><th>Ref ID</th><th>IP Address</th><th>Status</th></tr></thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={`audit-${i}`}>
            {row.map((cell, index) => <td key={`${i}-${index}`}>{index === 6 ? <Badge tone={cell === 'Failure' ? 'danger' : 'success'}>{cell}</Badge> : cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MiniLine() {
  const points = useMemo(() => '5,78 45,70 82,58 120,47 158,34 198,23', []);
  return (
    <svg className="mini-line" viewBox="0 0 210 100">
      <polyline points={points} fill="none" stroke="#082f5f" strokeWidth="5" strokeLinecap="round" />
      {points.split(' ').map((point) => {
        const [cx, cy] = point.split(',');
        return <circle key={point} cx={cx} cy={cy} r="5" fill="#082f5f" />;
      })}
    </svg>
  );
}

function Badge({ children, tone = 'default' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Info({ label, value }) {
  return <div className="info"><span>{label}</span><strong>{value}</strong></div>;
}

function StatusRow({ label, value, tone = 'default' }) {
  return <div className="status-row"><span>{label}</span><Badge tone={tone}>{value}</Badge></div>;
}

function Toggle({ label, detail, on, onChange }) {
  // If onChange is provided, we act as a controlled component, else we maintain local state
  const [enabled, setEnabled] = useState(Boolean(on));
  
  const handleClick = () => {
    if (onChange) {
      onChange(!on);
    } else {
      setEnabled(!enabled);
    }
  };

  const isOn = onChange ? on : enabled;

  return (
    <button className="toggle-row" onClick={handleClick}>
      <span><strong>{label}</strong><small>{detail}</small></span>
      <i className={isOn ? 'on' : ''}><b /></i>
    </button>
  );
}

function ReadField({ label, value, icon: Icon, onChange, readOnly = true }) {
  return (
    <label className={`read-field ${readOnly ? 'is-readonly' : ''}`}>
      {label}
      <span>{Icon && <Icon size={14} />}<input value={value} onChange={onChange} readOnly={readOnly} /></span>
    </label>
  );
}

createRoot(document.getElementById('root')).render(<App />);
