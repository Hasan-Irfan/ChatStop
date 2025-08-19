import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useJwtVerifyQuery, useLogoutMutation } from '../services/authApi';

const ROLE_ROUTES = {
  user: ['/homepage','/chatpage','/profile'],
  admin: ['/adminpage']
};

export const ProtectedRoutes = () => {

  const user = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const location = useLocation();
  const { data, isLoading, error } = useJwtVerifyQuery(undefined, { refetchOnMountOrArgChange: true });
  const [logout] = useLogoutMutation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isLoading) return null;

  if (error) {
    // If there's an error and it's a 401, the baseQueryWithReauth will handle the refresh
    // For other errors, log out
    if (error.status !== 401) {
      logout()
        .unwrap()
        .catch(console.error); // Handle any logout errors
      return <Navigate to="/login" />;
    }
    return null;
  }

  const allowedRoutes = ROLE_ROUTES[role] || [];
  const currentPath = location.pathname;
  const hasAccess = allowedRoutes.includes('*') || 
                    allowedRoutes.includes(currentPath) || 
                    allowedRoutes.some(route => currentPath.startsWith(route));

  if (!hasAccess) {
    // Redirect to the first allowed route for their role
    const defaultRoute = ROLE_ROUTES[role]?.[0] || '/';
    return <Navigate to={defaultRoute} replace />;
  }

  return data?.success ? <Outlet /> : <Navigate to="/login" />;
}
