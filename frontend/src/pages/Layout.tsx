// frontend/src/components/Layout.tsx
import React from 'react';
import NavBar from '../components/NavBar';
import '../style/kamilla.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(NavBar),
    React.createElement(
      'main',
      { className: 'layout-main' }, // Brug CSS klasse
      children
    )
  );
};

export default Layout;