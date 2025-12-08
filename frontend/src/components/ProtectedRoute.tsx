import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return React.createElement('div', null, 'Loading...');
  }

  if (!isAuthenticated) {
    return React.createElement(Navigate, { to: '/login', replace: true });
  }

  return React.createElement(Outlet);
};

export default ProtectedRoute;