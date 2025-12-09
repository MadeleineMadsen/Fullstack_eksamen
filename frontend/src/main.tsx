// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import './style/app.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(React.createElement(AppRoutes));