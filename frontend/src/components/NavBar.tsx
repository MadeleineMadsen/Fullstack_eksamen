import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


// NavBar-komponenten viser navigationen øverst på siden.
// Den ændrer sig dynamisk baseret på:
// - om brugeren er logget ind
// - om brugeren er admin
const NavBar: React.FC = () => {
  // Henter autentifikationsstatus og logout-funktion fra useAuth-hooket
  const { isAuthenticated, logout, isAdmin } = useAuth();

  // React Router hook til at navigere mellem sider
  const navigate = useNavigate();

  // Helper-funktion til navigation, så logik ikke gentages
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return React.createElement('nav', { className: 'main-nav' },// Hoved-navigation med CSS stylin
    // Link til forsiden (film-listen)
    React.createElement(
      'button',
      {
        onClick: () => handleNavigation('/'),
        className: 'nav-link'
      },
      React.createElement('img', {
        src: 'https://img.icons8.com/ios-filled/40/ffffff/video.png',
        alt: 'Film logo',
        className: 'logo-icon'
      }),
    ),

    // Admin-knap vises KUN hvis brugeren er admin
    isAdmin &&
    React.createElement(
      'button',
      {
        onClick: () => handleNavigation('/admin/movies/new'),
        className: 'nav-link admin-link'
      },
      ' Opret film'
    ),
    // Højre side af navbaren (login/profil/logout)
    React.createElement('div', { className: 'nav-right' },

      // Hvis brugeren er logget ind → vis profil og logout
      isAuthenticated
        ? React.createElement(React.Fragment, null,
          React.createElement('button', {
            onClick: () => handleNavigation('/profile'),
            className: 'nav-link'
          }, ' Profil'),
          React.createElement('button', {
            onClick: () => {
              logout();
              handleNavigation('/');
            },
            className: 'logout-button'
          }, ' Log ud')
        )
        // Hvis IKKE logget ind → vis login og signup
        : React.createElement(React.Fragment, null,
          React.createElement('button', {
            onClick: () => handleNavigation('/login'),
            className: 'nav-link'
          }, ' Log ind'),
          React.createElement('button', {
            onClick: () => handleNavigation('/signup'),
            className: 'nav-link'
          }, 'Opret bruger')
        )
    )
  );
};

export default NavBar;