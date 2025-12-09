import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalError('');
    if (clearError) clearError();

    // Simpel validering
    if (!email || !password) {
      setLocalError('Email og password er påkrævet');
      return;
    }
    
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      // Ekstra sikkerhed, hvis login kaster en fejl
      setLocalError(err?.message || 'Login fejlede');
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement('div', { className: 'login-container' },
    React.createElement('h2', null, 'Log ind'),
    
    React.createElement(ErrorMessage, {
      message: localError || authError || '',
      onClose: () => {
        setLocalError('');
        if (clearError) clearError();
      }
    }),
    
    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('div', { className: 'form-group' },
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
      
      React.createElement('button', {
        type: 'submit',
        disabled: isLoading,
        className: 'submit-button'
      }, isLoading ? 'Logger ind...' : 'Log ind')
    ),
    
    React.createElement('p', null,
      'Har du ikke en konto? ',
      React.createElement(Link, { to: '/signup' }, 'Opret dig her')
    )
  );
};

export default LoginPage;