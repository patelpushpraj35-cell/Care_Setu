import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, Users, Building2, FileText, Activity,
  QrCode, MessageCircle, User, LogOut, Heart, ChevronRight, Stethoscope,
} from 'lucide-react';

const SIDEBAR_ITEMS = {
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hospitals', to: '/admin/hospitals', icon: Building2 },
    { label: 'Patients', to: '/admin/patients', icon: Users },
  ],
  patient: [
    { label: 'Dashboard', to: '/patient/dashboard', icon: LayoutDashboard },
    { label: 'My QR Code', to: '/patient/qr', icon: QrCode },
    { label: 'Reports', to: '/patient/reports', icon: FileText },
    { label: 'Treatments', to: '/patient/treatments', icon: Activity },
    { label: 'AI Chatbot', to: '/patient/chatbot', icon: MessageCircle },
    { label: 'Profile', to: '/patient/profile', icon: User },
  ],
  hospital: [
    { label: 'Dashboard', to: '/hospital/dashboard', icon: LayoutDashboard },
    { label: 'Scan QR', to: '/hospital/scan', icon: QrCode },
    { label: 'My Patients', to: '/hospital/patients', icon: Users },
    { label: 'Upload Report', to: '/hospital/reports/upload', icon: FileText },
    { label: 'Add Treatment', to: '/hospital/treatments/add', icon: Stethoscope },
  ],
};

const roleColors = {
  admin: 'from-violet-600 to-blue-600',
  patient: 'from-blue-600 to-cyan-500',
  hospital: 'from-emerald-600 to-teal-500',
};

const roleLabels = { admin: 'Admin Panel', patient: 'Patient Portal', hospital: 'Hospital Panel' };

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = SIDEBAR_ITEMS[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className={`p-6 bg-gradient-to-r ${roleColors[user?.role]} text-white`}>
        <div className="flex items-center gap-2 mb-1">
          <Heart size={22} className="fill-white" />
          <span className="text-xl font-bold tracking-tight">CareSetu</span>
        </div>
        <p className="text-xs text-white/80 font-medium">{roleLabels[user?.role]}</p>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColors[user?.role]} flex items-center justify-center text-white font-bold text-sm`}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-blue-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
