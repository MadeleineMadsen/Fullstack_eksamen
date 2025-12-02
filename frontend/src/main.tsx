// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import './style/kamilla.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(React.createElement(AppRoutes));