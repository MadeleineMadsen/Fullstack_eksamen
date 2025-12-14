import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import './styles/style.css';

// Opretter React root og renderer hele appen
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(React.createElement(AppRoutes));