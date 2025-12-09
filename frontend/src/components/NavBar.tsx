import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout, isAdmin  } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return React.createElement('nav', { className: 'main-nav' },
    React.createElement('button', {
      onClick: () => handleNavigation('/'),
      className: 'nav-link'
    }, '🎬 Film'),

     // Admin-knap (kun hvis admin)
    isAdmin &&
      React.createElement(
        'button',
        {
          onClick: () => handleNavigation('/admin/movies/new'),
          className: 'nav-link admin-link'
        },
        '➕ Opret film'
      ),
    
    React.createElement('div', { className: 'nav-right' },
      isAuthenticated 
        ? React.createElement(React.Fragment, null,
            React.createElement('button', {
              onClick: () => handleNavigation('/profile'),
              className: 'nav-link'
            }, '👤 Profil'),
            React.createElement('button', {
              onClick: () => {
                logout();
                handleNavigation('/');
              },
              className: 'logout-button'
            }, '🚪 Log ud')
          )
        : React.createElement(React.Fragment, null,
            React.createElement('button', {
              onClick: () => handleNavigation('/login'),
              className: 'nav-link'
            }, '🔐 Log ind'),
            React.createElement('button', {
              onClick: () => handleNavigation('/signup'),
              className: 'nav-link'
            }, '📝 Opret bruger')
          )
    )
  );
};

export default NavBar;