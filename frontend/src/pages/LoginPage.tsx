import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Login fejlede');
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement('div', { className: 'login-container' },
    React.createElement('h2', null, 'Log ind'),
    
    error && React.createElement('div', { className: 'error-message' }, error),
    
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
      React.createElement('a', { href: '/signup' }, 'Opret dig her')
    )
  );
};

export default LoginPage;