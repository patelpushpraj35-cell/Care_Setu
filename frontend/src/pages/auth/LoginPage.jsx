import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Heart, Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
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
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogins = [
    { label: 'Admin', email: 'admin@caresetu.in', password: 'Admin@123', color: 'violet' },
    { label: 'Hospital', email: 'aiims@caresetu.in', password: 'Hospital@123', color: 'emerald' },
    { label: 'Patient', email: 'rahul@example.com', password: 'Patient@123', color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 p-12 flex-col justify-between">
        <div className="flex items-center gap-2 text-white">
          <Heart size={28} className="fill-white" />
          <span className="text-2xl font-bold">CareSetu</span>
        </div>
        <div className="text-white space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Your Health,<br />One Platform
          </h2>
          <p className="text-blue-100 text-lg">
            Centralized healthcare management for patients, hospitals, and administrators across India.
          </p>
          <div className="space-y-3">
            {['🏥 Instant hospital registration', '📋 Digital medical records', '🤖 AI-powered health guidance', '🏛️ Government scheme access'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-blue-100">
                <span className="text-base">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-sm">© 2024 CareSetu. Empowering Healthcare in India.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Heart size={24} className="text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-slate-900">CareSetu</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
            <p className="text-slate-500 mt-1 text-sm">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email" name="email" type="email" label="Email Address" required
              icon={Mail} placeholder="your@email.com"
              value={form.email} onChange={handleChange}
            />
            <Input
              id="password" name="password" type="password" label="Password" required
              icon={Lock} placeholder="••••••••"
              value={form.password} onChange={handleChange}
            />
            <Button type="submit" fullWidth loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            New patient?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>

          {/* Demo Quick Login */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500 text-center mb-3 font-medium">DEMO QUICK LOGIN</p>
            <div className="grid grid-cols-3 gap-2">
              {demoLogins.map(({ label, email, password }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ email, password })}
                  className="py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">Click a role to fill credentials, then Sign In</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
