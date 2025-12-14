import React from 'react';
import '../styles/style.css';
import NavBar from './NavBar';

// Props-type:
// children → det indhold som Layout skal wrappe omkring (f.eks. siderne)

interface LayoutProps {
  children: React.ReactNode;
}

// Layout-komponent
// Bruges som fælles wrapper for alle sider
// Indeholder navbar + main content
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return React.createElement(
    React.Fragment,// Fragment så vi ikke wrapper i unødvendigt HTML-tag
    null,

    // Øverste navigationsbar (vises på alle sider)
    React.createElement(NavBar),
    
    // Main container der indeholder sidelayout
    React.createElement(
      'main',
      { className: 'layout-main' },  // CSS-klasse til styling af indhold
      children                       // Indholdet fra de enkelte sider indsættes her
    )
  );
};

export default Layout;