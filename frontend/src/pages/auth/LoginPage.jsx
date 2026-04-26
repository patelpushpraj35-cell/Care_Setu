import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Heart, Mail, Lock, AlertCircle, ShieldCheck, Building2, User } from 'lucide-react';
import toast from 'react-hot-toast';

const features = [
  { icon: '🏥', text: 'Instant hospital registration' },
  { icon: '📋', text: 'Digital medical records' },
  { icon: '🤖', text: 'AI-powered health guidance' },
  { icon: '🔒', text: 'Secure & private health data' },
];

const demoLogins = [
  { label: 'Admin',    icon: ShieldCheck, email: 'admin@caresetu.in',   password: 'Admin@123',    color: '#7c3aed' },
  { label: 'Hospital', icon: Building2,   email: 'aiims@caresetu.in',   password: 'Hospital@123', color: '#059669' },
  { label: 'Patient',  icon: User,        email: 'rahul@example.com',   password: 'Patient@123',  color: '#2563eb' },
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.login(form);
      login(data.data.token, data.data.user);
      toast.success('Welcome back!');
      const role = data.data.user.role;
      navigate(role === 'admin' ? '/admin/dashboard' : role === 'hospital' ? '/hospital/dashboard' : '/patient/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Network Error: Unable to connect to the backend. Please check CORS or your internet connection.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again. (Did you forget to run the seed script?)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cs-auth-panel">

      {/* ── Left Panel ─────────────────────────────── */}
      <div className="cs-auth-left">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.625rem' }}>
          <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '10px', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={20} style={{ fill: '#fff', color: '#fff' }} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>CareSetu</span>
        </div>

        {/* Hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 0' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
            Your Health,<br />One Platform.
          </h2>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Centralized healthcare management for patients, hospitals, and administrators across India.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {features.map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '8px', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.875rem', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ color: 'rgba(255,255,255,.85)', fontSize: '.875rem', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '.75rem', lineHeight: 1.5 }}>
          <p style={{ marginBottom: '.25rem' }}>© 2026 CareSetu · Designed and Developed by Team CadeYugma</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.375rem', fontSize: '.6875rem' }}>
            <a href="https://www.linkedin.com/in/pushpraj-patel-16a2843b4/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none' }} className="hover:underline">Pushpraj Patel (Team Leader)</a>
            <span>•</span>
            <a href="https://www.linkedin.com/in/raaj-sharma-7a207b243/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none' }} className="hover:underline">Raaj Sharma</a>
            <span>•</span>
            <a href="https://www.linkedin.com/in/rajveer-singh-chouhan-a92a713b4/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none' }} className="hover:underline">Rajveer Singh Chouhan</a>
            <span>•</span>
            <a href="https://www.linkedin.com/in/samarth-choudhary-59203133a/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,.9)', textDecoration: 'none' }} className="hover:underline">Samarth Choudhary</a>
          </div>
        </div>
      </div>

      {/* ── Right Panel ────────────────────────────── */}
      <div className="cs-auth-right">
        <div className="cs-auth-form-box">

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1.75rem' }}>
            <Heart size={22} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>CareSetu</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '.25rem' }}>Sign in</h1>
            <p style={{ fontSize: '.8125rem', color: 'var(--text-muted)' }}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.625rem .875rem', background: 'var(--danger-light)', border: '1px solid rgba(220,38,38,.2)', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '.8125rem', marginBottom: '1rem' }}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input id="email" name="email" type="email" label="Email Address" required icon={Mail} placeholder="your@email.com" value={form.email} onChange={handleChange} />
            <Input id="password" name="password" type="password" label="Password" required icon={Lock} placeholder="••••••••" value={form.password} onChange={handleChange} />
            <Button type="submit" fullWidth loading={loading} size="lg">Sign In</Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '.8125rem', color: 'var(--text-muted)', margin: '1rem 0' }}>
            New patient?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Create account
            </Link>
          </p>

          {/* Demo Quick Login */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <p style={{ fontSize: '.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-faint)', textAlign: 'center', marginBottom: '.625rem' }}>
              Demo Quick Login
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.5rem' }}>
              {demoLogins.map(({ label, icon: Icon, email, password, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ email, password })}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.375rem', padding: '.625rem .5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
                >
                  <Icon size={14} style={{ color }} />
                  <span style={{ fontSize: '.6875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '.6875rem', color: 'var(--text-faint)', textAlign: 'center', marginTop: '.5rem' }}>Click a role to fill credentials, then Sign In</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
