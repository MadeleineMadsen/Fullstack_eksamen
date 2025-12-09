// frontend/src/components/Layout.tsx
import React from 'react';
import '../style/kamilla.css';
import NavBar from './NavBar';

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