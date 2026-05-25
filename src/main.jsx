import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Bell,
  Blocks,
  BriefcaseBusiness,
  Calendar,
  Check,
  ChevronDown,
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
  Lock,
  LogOut,
  Menu,
  Network,
  Plus,
  RefreshCcw,
  Search,
  Shield,
  SlidersHorizontal,
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
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList },
  { id: 'blockchain', label: 'Blockchain Status', icon: Database },
  { id: 'settings', label: 'Settings', icon: SlidersHorizontal }
];

const auditRows = [
  ['2026-03-25 14:32:15', 'Tharaka Bandara', 'Verification Approved', 'Ms. Fernando', '0x5d6e...4f2a', '192.168.1.52', 'Success'],
  ['2026-03-24 15:30:19', 'Nimali Wijesinghe', 'Login', 'N/A', 'N/A', '10.0.0.45', 'Success'],
  ['2026-03-23 11:20:45', 'Rohan Dissanayake', 'Hash Stored on Polygon', 'Mr. Silva', '0x9a8b...3c1d', '192.168.1.67', 'Success'],
  ['2026-03-23 10:15:53', 'Chamari Gunaratne', 'Verification Rejected', 'Dr. Perera', 'N/A', '192.168.1.45', 'Failure'],
  ['2026-03-22 14:55:10', 'Lahiru Rajapaksa', 'Verification Approved', 'Ms. Fernando', '0x2b3c...5d6e', '192.168.1.52', 'Success'],
  ['2026-03-20 09:30:25', 'Sanduni Amarasinghe', 'Hash Stored on Polygon', 'Mr. Silva', '0x7f8e...9d0c', '192.168.1.67', 'Success'],
  ['2026-03-18 16:20:40', 'Pradeep Gamage', 'Login', 'N/A', 'N/A', '10.0.0.78', 'Success'],
  ['2026-03-15 13:45:18', 'Malini Herath', 'Verification Approved', 'Dr. Perera', '0x4e5f...6a7b', '192.168.1.45', 'Success'],
  ['2026-03-10 11:30:55', 'Ruwan Jayasuriya', 'Hash Stored on Polygon', 'Ms. Fernando', '0xa8c9...ae1f', '192.168.1.52', 'Success'],
  ['2026-03-08 10:10:23', 'Kavinda Samaraweera', 'Verification Rejected', 'Mr. Silva', 'N/A', '192.168.1.67', 'Failure']
];

const students = [
  ['Kasun Perera', '991234567V', 'kasun.p@student.university.lk', '2024-01-15', 'Active', 'Verified'],
  ['Nimal Silva', '982345678V', 'nimal.s@student.university.lk', '2024-02-20', 'Active', 'Verified'],
  ['Amara Fernando', '973456789V', 'amara.f@student.university.lk', '2024-03-10', 'Pending', 'Pending'],
  ['Saman Kumara', '964567890V', 'saman.k@student.university.lk', '2024-01-22', 'Active', 'Verified']
];

const verifiers = [
  ['V-2047', 'Dr. Perera', 'k.perera@university.lk', 'Computer Science'],
  ['V-2089', 'Mr. Silva', 'r.silva@university.lk', 'Engineering'],
  ['V-2101', 'Ms. Fernando', 'a.fernando@university.lk', 'Administration'],
  ['V-2134', 'Dr. Jayawardena', 's.jayawardena@university.lk', 'IT Services']
];

const chainTransactions = [
  ['0x7a3f9bc2c58e1f4a6b...', '2026-03-25 14:32:15', 'Student Verification', '0.0024 MATIC', '45,892,341'],
  ['0x80c4a3d6e9f2b5c8d...', '2026-03-25 14:28:42', 'Credential Issued', '0.0031 MATIC', '45,892,338'],
  ['0x3c2d58ef1a4b7c9d2e...', '2026-03-25 13:58:19', 'Batch Verification', '0.0018 MATIC', '45,892,312']
];

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthed) {
    return <LoginPage onLogin={() => setIsAuthed(true)} />;
  }

  const title = navItems.find((item) => item.id === page)?.label ?? 'Dashboard';

  return (
    <div className="shell">
      <Sidebar page={page} setPage={setPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="workspace">
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
          {page === 'audit' && <AuditPage />}
          {page === 'blockchain' && <BlockchainPage />}
          {page === 'settings' && <SettingsPage />}
          {page === 'profile' && <ProfilePage />}
        </main>
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={(event) => { event.preventDefault(); onLogin(); }}>
        <div className="login-mark"><Shield size={38} /></div>
        <h1>University Blockchain Identity</h1>
        <p>Admin Dashboard Login</p>
        <label>
          Username
          <span><User size={16} /><input placeholder="Enter your username" /></span>
        </label>
        <label>
          Password
          <span><Lock size={16} /><input type="password" placeholder="Enter your password" /></span>
        </label>
        <button className="primary-btn" type="submit">Sign In</button>
        <small>Demo: Use any username and password to login</small>
      </form>
    </main>
  );
}

function Sidebar({ page, setPage, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><Shield size={20} /></div>
          <strong>University of<br />Blockchain Identity</strong>
        </div>
        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              className={page === id ? 'active' : ''}
              key={id}
              onClick={() => { setPage(id); setSidebarOpen(false); }}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
      </aside>
      {sidebarOpen && <button className="scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
    </>
  );
}

function Topbar({ menuOpen, setMenuOpen, onNavigate, onLogout, onOpenSidebar }) {
  return (
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={onOpenSidebar} aria-label="Open navigation"><Menu size={20} /></button>
      <div className="search-box"><Search size={15} /><input placeholder="Search Student NIC or TxHash" /></div>
      <div className="account">
        <button className="account-button" onClick={() => setMenuOpen(!menuOpen)}>
          <CircleUserRound size={22} />
          <span><strong>Mrs. Abeythunga</strong><small>System Admin</small></span>
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

function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard Overview" subtitle="University Blockchain Identity Verification System" />
      <div className="dashboard-grid">
        <MetricCard label="Total Enrolled Students" value="2,850" icon={Users} detail="+18% from last month">
          <MiniLine />
        </MetricCard>
        <MetricCard label="Polygon Gas Balance (MATIC)" value="12.47" icon={Wallet} tone="danger" detail="Daily Consumption: ~2.3 MATIC  Est. Days Remaining: 5 days">
          <div className="alert-box"><AlertTriangle size={14} /> Low Balance Alert: Gas balance is below threshold. Please top up to ensure continuous blockchain operations.</div>
        </MetricCard>
        <MetricCard label="Avg. AI Face Match Time" value="1.24s" icon={Gauge} detail="Total Verifications Today: 247  Success Rate: 98.4%">
          <div className="target-row"><span>Performance Target:</span><strong>&lt; 2.0s</strong></div>
          <div className="progress"><span style={{ width: '86%' }} /></div>
        </MetricCard>
      </div>

      <h2 className="section-title">Pending verification requests</h2>
      <div className="mini-metrics">
        <MetricCard label="Pending" value="12" />
        <MetricCard label="In Progress" value="5" />
        <MetricCard label="Completed Today" value="247" />
        <MetricCard label="Avg. Wait Time" value="8m" />
      </div>

      <Panel title="Audit Logs" subtitle="Group 14 Requirement: Detailed system activity tracking" action={<button className="ghost-btn"><Download size={14} /> Export Logs</button>}>
        <AuditTable compact />
      </Panel>

      <Panel title="Role Management" subtitle="Manage staff access and verifier permissions">
        <table>
          <thead><tr><th>Verifier ID</th><th>Name</th><th>Email</th><th>Department</th><th>Current Role</th><th>Actions</th></tr></thead>
          <tbody>{verifiers.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}<td><Badge>Verifier</Badge></td><td><button className="small-btn">Manage Role <ChevronDown size={13} /></button></td></tr>)}</tbody>
        </table>
      </Panel>
      <div className="center-action"><button className="primary-btn"><FileText size={15} /> Generate System Report for Mrs. Abeythunga</button></div>
    </>
  );
}

function UsersPage() {
  return (
    <>
      <PageHeader title="User Management" subtitle="Manage student accounts and verification status" action={<button className="primary-btn"><Plus size={15} /> Add New Student</button>} />
      <div className="stats-row">
        <MetricCard icon={Users} label="Total Students" value="2,850" />
        <MetricCard label="Verified" value="2,742" tone="success" />
        <MetricCard label="Pending Verification" value="108" tone="warning" />
      </div>
      <Panel title="Student Directory" subtitle="Search and manage student records" action={<div className="table-search"><Search size={14} /><input placeholder="Search by name, NIC, or email" /></div>}>
        <table>
          <thead><tr><th>Student Name</th><th>NIC</th><th>Email</th><th>Enrolled Date</th><th>Status</th><th>Verification</th><th>Actions</th></tr></thead>
          <tbody>
            {students.map((row) => (
              <tr key={row[1]}>
                {row.map((cell, index) => <td key={cell}>{index > 3 ? <Badge tone={cell === 'Pending' ? 'neutral' : 'success'}>{cell}</Badge> : cell}</td>)}
                <td><button className="small-btn">View Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}

function AuditPage() {
  return (
    <>
      <PageHeader title="Audit Logs" subtitle="Complete system activity history and compliance tracking" />
      <div className="stats-row four">
        <MetricCard label="Total Events Today" value="1,247" />
        <MetricCard label="Successful Actions" value="1,228" tone="success" />
        <MetricCard label="Failed Actions" value="19" tone="danger" />
        <MetricCard label="Active Verifiers" value="4" />
      </div>
      <Panel title="Complete Audit Trail" subtitle="All system events with detailed tracking" action={<><button className="ghost-btn"><Calendar size={14} /> Date Range</button><button className="primary-btn"><Download size={14} /> Export</button></>}>
        <div className="filters">
          <div className="table-search"><Search size={14} /><input placeholder="Search by NIC, TxHash, or Username" /></div>
          <select><option>All Actions</option></select>
          <select><option>All Status</option></select>
          <button className="ghost-btn">Clear Filters</button>
        </div>
        <AuditTable />
      </Panel>
    </>
  );
}

function BlockchainPage() {
  return (
    <>
      <PageHeader title="Blockchain Status" subtitle="Polygon Network monitoring and transaction analytics" />
      <div className="stats-row four">
        <MetricCard icon={Activity} label="Network Status" value="Online" tone="success" detail="Last checked: 2s ago" />
        <MetricCard icon={Blocks} label="Current Gas Price" value="32 Gwei" detail="~$0.008 per tx" />
        <MetricCard icon={Network} label="Transactions Today" value="247" tone="success" detail="+12% from yesterday" />
        <MetricCard label="Block Confirmation Time" value="2.3s" detail="Average" />
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
      <Panel title="Recent Blockchain Transactions" subtitle="Latest verifications written to Polygon mainnet" action={<button className="ghost-btn"><ExternalLink size={14} /> View on PolygonScan</button>}>
        <table>
          <thead><tr><th>Transaction Hash</th><th>Timestamp</th><th>Action</th><th>Gas Used</th><th>Block Number</th><th>Status</th></tr></thead>
          <tbody>{chainTransactions.map((row) => <tr key={row[0]}><td className="link-cell">{row[0]} <ExternalLink size={12} /></td>{row.slice(1).map((cell) => <td key={cell}>{cell}</td>)}<td><Badge tone="success">Confirmed</Badge></td></tr>)}</tbody>
        </table>
      </Panel>
      <Panel className="outlined" title="Smart Contract Information">
        <div className="info-grid">
          <Info label="Contract Address" value="0x742d35Cc6634C0532925a3b844Bc9e7595f6bEb1" />
          <Info label="Network" value="Polygon Mainnet" />
          <Info label="Contract Version" value="v2.1.4" />
          <Info label="Total Verifications Stored" value="45,892" />
        </div>
      </Panel>
    </>
  );
}

function ProfilePage() {
  return (
    <>
      <PageHeader title="My Profile" subtitle="Manage your account information and preferences" />
      <div className="profile-grid">
        <Panel className="profile-main" title="Personal Information" subtitle="Update your personal details and contact information" action={<button className="primary-btn"><Edit3 size={14} /> Edit Profile</button>}>
          <div className="avatar-large"><User size={58} /></div>
          <div className="form-grid">
            <ReadField label="Full Name" icon={User} value="Mrs. Abeythunga" />
            <ReadField label="Email Address" icon={BriefcaseBusiness} value="s.abeythunga@university.lk" />
            <ReadField label="Phone Number" icon={CircleUserRound} value="+94 77 123 4567" />
            <ReadField label="Department" icon={Database} value="IT Administration" />
            <ReadField label="Employee ID" icon={BadgeCheck} value="EMP-2024-1047" />
            <ReadField label="Join Date" icon={Calendar} value="2020-03-15" />
          </div>
        </Panel>
        <div className="side-stack">
          <Panel title="Account Status"><StatusRow label="Role" value="System Admin" /><StatusRow label="Status" value="Active" tone="success" /><StatusRow label="2FA" value="Enabled" tone="success" /></Panel>
          <Panel title="Activity Summary"><Info label="Last Login" value="2026-03-25 14:32:15" /><Info label="Total Actions Today" value="47 actions" /><Info label="Reports Generated" value="12 reports" /></Panel>
          <Panel title="Security"><button className="wide-btn">Change Password</button><button className="wide-btn">Manage 2FA</button><button className="wide-btn">Active Sessions</button></Panel>
        </div>
      </div>
    </>
  );
}

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" subtitle="System configuration and preferences" />
      <div className="settings-pair">
        <Panel title="Notifications" subtitle="Configure alert preferences" icon={Bell}>
          <Toggle label="Email Notifications" detail="Receive email alerts for critical events" on />
          <Toggle label="Low Gas Balance Alert" detail="Alert when MATIC balance is low" on />
          <Toggle label="Verification Queue Alerts" detail="Notify when queue exceeds threshold" on />
        </Panel>
        <Panel title="Security Settings" subtitle="Access control and authentication" icon={Shield}>
          <Toggle label="Two-Factor Authentication" detail="Enable 2FA for admin access" on />
          <Toggle label="Session Timeout" detail="Auto-logout after inactivity" on />
          <Toggle label="IP Whitelist" detail="Restrict access to specific IP ranges" />
        </Panel>
      </div>
      <Panel title="Blockchain Configuration" subtitle="Polygon network and smart contract settings" icon={Database}>
        <div className="form-grid">
          <ReadField label="Polygon RPC URL" value="https://polygon-rpc.com" />
          <ReadField label="Smart Contract Address" value="0x742d35Cc6634C0532925a3b844Bc9e7595f6bEb1" />
          <ReadField label="Gas Limit" value="200000" />
          <ReadField label="Low Balance Threshold (MATIC)" value="15" />
        </div>
      </Panel>
      <Panel title="API Keys & Credentials" subtitle="Manage external service integrations" icon={KeyRound}>
        <ReadField label="Wallet Private Key (Encrypted)" value="******************************" />
        <ReadField label="AI Face Recognition API Key" value="******************************" />
        <ReadField label="Email SMTP Configuration" value="smtp.university.lk:587" />
      </Panel>
      <Panel className="outlined" title="System Information">
        <div className="info-grid three">
          <Info label="System Version" value="v2.1.4" />
          <Info label="Last Update" value="March 15, 2026" />
          <Info label="Database Size" value="2.4 GB" />
          <Info label="Active Users" value="2,850 students, 4 verifiers" />
          <Info label="Uptime" value="99.98%" />
          <Info label="Server Location" value="Colombo, Sri Lanka" />
        </div>
      </Panel>
      <div className="button-row"><button className="ghost-btn"><RefreshCcw size={14} /> Reset to Defaults</button><button className="primary-btn"><Download size={14} /> Save All Changes</button></div>
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

function AuditTable({ compact = false }) {
  const rows = compact ? auditRows.slice(0, 7) : auditRows;
  return (
    <table>
      <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Verifier</th><th>TxHash</th><th>IP Address</th><th>Status</th></tr></thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row[0]}-${row[1]}`}>
            {row.map((cell, index) => <td key={`${cell}-${index}`}>{index === 6 ? <Badge tone={cell === 'Failure' ? 'danger' : 'success'}>{cell}</Badge> : cell}</td>)}
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

function Toggle({ label, detail, on }) {
  const [enabled, setEnabled] = useState(Boolean(on));
  return (
    <button className="toggle-row" onClick={() => setEnabled(!enabled)}>
      <span><strong>{label}</strong><small>{detail}</small></span>
      <i className={enabled ? 'on' : ''}><b /></i>
    </button>
  );
}

function ReadField({ label, value, icon: Icon }) {
  return (
    <label className="read-field">
      {label}
      <span>{Icon && <Icon size={14} />}<input value={value} readOnly /></span>
    </label>
  );
}

createRoot(document.getElementById('root')).render(<App />);
