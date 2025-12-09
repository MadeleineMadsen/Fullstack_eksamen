// Login-side: håndterer login, fejl og redirect til /profile
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/Layout'; // Tilføj denne import

const LoginPage: React.FC = () => {
  // Lokal form-state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auth-funktioner fra Zustand
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ryd gamle fejl
    setLocalError('');
    if (clearError) clearError();

    // Simpel validering
    if (!email || !password) {
      setLocalError('Email og password er påkrævet');
      return;
    }

    setIsLoading(true);

    try {
      // Forsøg login → backend sætter JWT-cookie
      await login(email, password);
      // Login ok → send bruger til profil
      navigate('/profile');
    } catch (err: any) {
      // Hvis login-fejl returneres
      setLocalError(err?.message || 'Login fejlede');
    } finally {
      setIsLoading(false);
    }
  };

  // Opret login-indhold
  const loginContent = React.createElement('div', { className: 'login-container' },
    React.createElement('h2', null, 'Log ind'),
    // Viser auth-fejl eller lokale fejl
    React.createElement(ErrorMessage, {
      message: localError || authError || '',
      onClose: () => {
        setLocalError('');
        if (clearError) clearError();
      }
    }),

    // Login-form
    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('div', { className: 'form-group' },
        // Email
        React.createElement('label', { htmlFor: 'email' }, 'Email:'),
        React.createElement('input', {
          type: 'email',
          id: 'email',
          value: email,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
          required: true,
          disabled: isLoading
        })
      ),
      // Password
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'password' }, 'Password:'),
        React.createElement('input', {
          type: 'password',
          id: 'password',
          value: password,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
          required: true,
          disabled: isLoading
        })
      ),
      // Login-knappen
      React.createElement('button', {
        type: 'submit',
        disabled: isLoading,
        className: 'submit-button'
      }, isLoading ? 'Logger ind...' : 'Log ind')
    ),
    // Link til signup
    React.createElement('p', null,
      'Har du ikke en konto? ',
      React.createElement(Link, { to: '/signup' }, 'Opret dig her')
    )
  );

  // Indpak i Layout komponenten (samme som SignupPage)
  return React.createElement(
    Layout,
    null,
    loginContent
  );
};

export default LoginPage;