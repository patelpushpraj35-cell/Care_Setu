import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageLoader } from './ui/Spinner';

/**
 * ProtectedRoute — wraps pages requiring authentication and specific roles.
 * @param {string[]} roles - allowed roles; empty means any authenticated user
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect to their own dashboard
    const home = user.role === 'admin' ? '/admin/dashboard'
      : user.role === 'hospital' ? '/hospital/dashboard'
      : '/patient/dashboard';
    return <Navigate to={home} replace />;
  }
  return children;
};

export default ProtectedRoute;
