import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Menu, Bell, Sun, Moon, HelpCircle, Phone, Mail, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

/* ── Help Modal ─────────────────────────────────────── */
const HelpModal = ({ onClose }) => (
  <div className="cs-modal-backdrop" onClick={onClose}>
    <div className="cs-modal cs-modal-sm" onClick={e => e.stopPropagation()}>
      <div className="cs-modal-header">
        <h2 className="cs-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <HelpCircle size={16} style={{ color: 'var(--accent)' }} />
          Help & Support
        </h2>
        <button onClick={onClose} className="cs-icon-btn" aria-label="Close">
          <X size={15} />
        </button>
      </div>
      <div className="cs-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
        <p style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginBottom: '.25rem' }}>
          Reach our support team anytime — we&apos;re here to help!
        </p>

        <a href="tel:1234567890" className="help-contact-row">
          <div className="help-icon-wrap" style={{ background: 'var(--accent-light)' }}>
            <Phone size={15} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p style={{ fontSize: '.6875rem', color: 'var(--text-faint)', marginBottom: '.125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Phone</p>
            <p style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>+91 123 456 7890</p>
          </div>
        </a>

        <a href="mailto:Care@123gmail.com" className="help-contact-row">
          <div className="help-icon-wrap" style={{ background: 'var(--success-light)' }}>
            <Mail size={15} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <p style={{ fontSize: '.6875rem', color: 'var(--text-faint)', marginBottom: '.125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Email</p>
            <p style={{ fontSize: '.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Care@123gmail.com</p>
          </div>
        </a>

        <p style={{ fontSize: '.6875rem', textAlign: 'center', color: 'var(--text-faint)', marginTop: '.25rem' }}>
          Available 24 × 7 &nbsp;·&nbsp; Mon – Sun
        </p>
      </div>
    </div>
  </div>
);

/* ── DashboardLayout ─────────────────────────────────── */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen,    setHelpOpen]    = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to CareSetu', message: 'Your account has been successfully created and configured.', time: 'Just now', unread: true },
    { id: 2, title: 'Profile Completion', message: 'Please make sure all your details are up to date for better assistance.', time: '1 hour ago', unread: false }
  ]);
  const { user }           = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* Desktop Sidebar */}
      <div style={{ display: 'none' }} className="lg-sidebar">
        <Sidebar />
      </div>
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden" style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <header className="cs-header" style={{ flexShrink: 0 }}>
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <button
              className="cs-icon-btn lg:hidden"
              style={{ display: 'flex' }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="hidden lg:block">
              <p className="cs-header-title">
                Welcome back,{' '}
                <span style={{ color: 'var(--accent)' }}>{user?.name?.split(' ')[0]}</span>{' '}
                👋
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem' }}>

            {/* Theme Toggle */}
            <button
              className="cs-icon-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'light'
                ? <Moon size={16} />
                : <Sun size={16} style={{ color: '#fbbf24' }} />
              }
            </button>

            {/* Help */}
            <button
              className="cs-icon-btn"
              onClick={() => setHelpOpen(true)}
              title="Help & Support"
              aria-label="Help"
            >
              <HelpCircle size={16} style={{ color: 'var(--accent)' }} />
            </button>

            {/* Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                className="cs-icon-btn" 
                style={{ position: 'relative' }} 
                aria-label="Notifications"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={16} />
                {notifications.length > 0 && (
                  <span style={{ position: 'absolute', top: '.375rem', right: '.375rem', width: '.4375rem', height: '.4375rem', background: 'var(--danger)', borderRadius: '50%' }} />
                )}
              </button>
              
              {/* Notification Dropdown */}
              {notifOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setNotifOpen(false)} />
                  <div style={{ position: 'absolute', top: 'calc(100% + .5rem)', right: 0, width: '300px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 10px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1)', zIndex: 50, overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</h3>
                      {notifications.length > 0 && (
                        <span 
                          style={{ fontSize: '.6875rem', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}
                          onClick={() => setNotifications([])}
                        >
                          Mark all as read
                        </span>
                      )}
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '.8125rem' }}>
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: n.unread ? 'var(--bg-subtle)' : 'transparent' }}>
                            <p style={{ fontSize: '.8125rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '.25rem' }}>{n.title}</p>
                            <p style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>{n.message}</p>
                            <p style={{ fontSize: '.625rem', color: 'var(--text-faint)', marginTop: '.375rem' }}>{n.time}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Separator */}
            <div style={{ width: 1, height: '1.25rem', background: 'var(--border)', margin: '0 .25rem' }} />

            {/* User chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.6875rem', flexShrink: 0 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name}</p>
                <p style={{ fontSize: '.625rem', color: 'var(--text-faint)', textTransform: 'capitalize' }}>{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          <Outlet />
        </main>
      </div>

      {/* Help Modal */}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;
