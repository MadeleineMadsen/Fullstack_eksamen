import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ProtectedRoute beskytter sider, så man kun kan tilgå dem,
// hvis man er logget ind. 
// Den fungerer som en "gatekeeper" i routing-systemet.

const ProtectedRoute: React.FC = () => {

  // Henter authentication-status og loading fra vores useAuth-hook
  const { isAuthenticated, loading } = useAuth();

  // Hvis auth-state stadig indlæses, vis en simpel loader
  if (loading) {
    return React.createElement('div', null, 'Loading...');
  }

  // Hvis brugeren IKKE er logget ind → redirect til login-page
  if (!isAuthenticated) {
    return React.createElement(Navigate, { to: '/login', replace: true });
  }
  
// Ellers må brugeren gerne se child routes
  return React.createElement(Outlet);
};

export default ProtectedRoute;