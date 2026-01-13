import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

function ProtectedRoute({ children, requireAuth = true, requireRole = null, fallback = '/login' }) {
  const { user, isLoading, getUserRole, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-accent-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
        <span className="ml-4 text-lg text-slate-600 dark:text-slate-400">
          Checking authentication...
        </span>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // Check if specific role is required
  if (requireRole && isAuthenticated) {
    const userRole = getUserRole();
    
    // Handle role hierarchy
    const hasRequiredRole = () => {
      switch (requireRole) {
        case 'admin':
          return userRole === 'admin';
        case 'manager':
          return userRole === 'manager' || userRole === 'admin';
        case 'user':
          return ['user', 'manager', 'admin'].includes(userRole);
        default:
          return false;
      }
    };

    if (!hasRequiredRole()) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 p-3">
              <svg className="h-full w-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Access Denied
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Required role: {requireRole} | Your role: {userRole}
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/40 transition-all hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
}

export default ProtectedRoute;