import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validering
    if (!formData.email || !formData.password) {
      setError('Email og password er påkrævet');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password skal være mindst 6 tegn');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords er ikke ens');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Ugyldig email format');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/profile'); // Redirect til profil efter registrering
    } catch (err: any) {
      setError(err.message || 'Registrering fejlede');
    } finally {
      setIsLoading(false);
    }
  };

  return React.createElement('div', { className: 'signup-container' },
    React.createElement('h2', null, 'Opret ny bruger'),
    
    error && React.createElement('div', { className: 'error-message' }, error),
    
    React.createElement('form', { onSubmit: handleSubmit, className: 'signup-form' },
      // Navn (valgfrit)
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'name' }, 'Fulde navn:'),
        React.createElement('input', {
          type: 'text',
          id: 'name',
          name: 'name',
          value: formData.name,
          onChange: handleChange,
          disabled: isLoading,
          placeholder: 'Indtast dit navn'
        })
      ),
      
      // Email (påkrævet)
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'email' }, 'Email:'),
        React.createElement('input', {
          type: 'email',
          id: 'email',
          name: 'email',
          value: formData.email,
          onChange: handleChange,
          required: true,
          disabled: isLoading,
          placeholder: 'din@email.com'
        })
      ),
      
      // Password (påkrævet)
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'password' }, 'Password:'),
        React.createElement('input', {
          type: 'password',
          id: 'password',
          name: 'password',
          value: formData.password,
          onChange: handleChange,
          required: true,
          disabled: isLoading,
          placeholder: 'Mindst 6 tegn',
          minLength: 6
        })
      ),
      
      // Bekræft password (påkrævet)
      React.createElement('div', { className: 'form-group' },
        React.createElement('label', { htmlFor: 'confirmPassword' }, 'Bekræft password:'),
        React.createElement('input', {
          type: 'password',
          id: 'confirmPassword',
          name: 'confirmPassword',
          value: formData.confirmPassword,
          onChange: handleChange,
          required: true,
          disabled: isLoading,
          placeholder: 'Gentag password'
        })
      ),
      
      // Submit knap
      React.createElement('button', {
        type: 'submit',
        disabled: isLoading,
        className: 'submit-button'
      }, isLoading ? 'Opretter bruger...' : 'Opret bruger')
    ),
    
    // Link til login
    React.createElement('p', { className: 'login-link' },
      'Har du allerede en konto? ',
      React.createElement('button', {
        onClick: () => navigate('/login'),
        className: 'link-button'
      }, 'Log ind her')
    )
  );
};

export default SignupPage;