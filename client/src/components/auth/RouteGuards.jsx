import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RequireAuth({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

/**
 * PublicOnly — used for pages like /login and /register.
 * 
 * CHANGED: No longer auto-redirects if user is logged in.
 * Instead, the page itself handles the "already logged in" state
 * so users can intentionally switch accounts.
 */
export function PublicOnly({ children }) {
  const { loading } = useAuth();
  if (loading) return null;
  // Always show the page — let Login/Register handle logged-in state themselves
  return children;
}