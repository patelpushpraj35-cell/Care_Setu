import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, Building2, FileText, Activity,
  QrCode, MessageCircle, User, LogOut, Heart, Stethoscope,
} from 'lucide-react';

const SIDEBAR_ITEMS = {
  admin: [
    { label: 'Dashboard',  to: '/admin/dashboard',  icon: LayoutDashboard },
    { label: 'Hospitals',  to: '/admin/hospitals',  icon: Building2 },
    { label: 'Patients',   to: '/admin/patients',   icon: Users },
  ],
  patient: [
    { label: 'Dashboard',   to: '/patient/dashboard',  icon: LayoutDashboard },
    { label: 'My QR Code',  to: '/patient/qr',         icon: QrCode },
    { label: 'Reports',     to: '/patient/reports',    icon: FileText },
    { label: 'Treatments',  to: '/patient/treatments', icon: Activity },
    { label: 'AI Chatbot',  to: '/patient/chatbot',    icon: MessageCircle },
    { label: 'Profile',     to: '/patient/profile',    icon: User },
  ],
  hospital: [
    { label: 'Dashboard',     to: '/hospital/dashboard',         icon: LayoutDashboard },
    { label: 'Scan QR',       to: '/hospital/scan',              icon: QrCode },
    { label: 'My Patients',   to: '/hospital/patients',          icon: Users },
    { label: 'Upload Report', to: '/hospital/reports/upload',    icon: FileText },
    { label: 'Add Treatment', to: '/hospital/treatments/add',    icon: Stethoscope },
  ],
};

const roleGradient = {
  admin:    'linear-gradient(135deg,#6d28d9,#2563eb)',
  patient:  'linear-gradient(135deg,#2563eb,#0ea5e9)',
  hospital: 'linear-gradient(135deg,#059669,#0ea5e9)',
};

const roleLabels = {
  admin:    'Admin Panel',
  patient:  'Patient Portal',
  hospital: 'Hospital Panel',
};

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = SIDEBAR_ITEMS[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="cs-sidebar" style={{ width: '15rem', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* ── Logo ── */}
      <div className="cs-sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '8px', background: roleGradient[user?.role], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={15} style={{ fill: '#fff', color: '#fff' }} />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-.01em' }}>CareSetu</span>
        </div>
        <p style={{ fontSize: '.6875rem', color: 'var(--text-faint)', marginTop: '.25rem', fontWeight: 500 }}>{roleLabels[user?.role]}</p>
      </div>

      {/* ── User ── */}
      <div className="cs-sidebar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
          <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: roleGradient[user?.role], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.75rem', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
            <p style={{ fontSize: '.6875rem', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '.5rem .625rem', overflowY: 'auto' }}>
        <p style={{ fontSize: '.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-faint)', padding: '.5rem .5rem .25rem', marginBottom: '.25rem' }}>Menu</p>
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `cs-nav-link ${isActive ? 'active' : ''}`}
            style={{ marginBottom: '.125rem' }}
          >
            <Icon size={15} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div style={{ padding: '.625rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '.5rem', width: '100%', padding: '.5rem .75rem', borderRadius: 'var(--radius)', border: 'none', background: 'transparent', color: 'var(--danger)', fontSize: '.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'background .15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
