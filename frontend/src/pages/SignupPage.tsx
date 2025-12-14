import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

// SignupPage: side til oprettelse af ny bruger via backend-auth

// useState bruges til formular-data, fejl/succes-beskeder og loading-state
// useNavigate bruges til redirect efter succesfuld signup
// useAuth er et custom hook til authentication (signup, fejl-håndtering)

const SignupPage: React.FC = () => {

  // Formularens inputfelter samles i ét state-objekt
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  // errorMessage: lokale validerings- og submit-fejl
  // successMessage: vises kun ved succes
  // isLoading: bruges til at disable inputs og vise loading-tekst
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // signup: funktion der kalder backend
  // authError: fejl fra auth-store
  // clearError: nulstiller auth-fejl
  const { signup, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Opdaterer formData dynamisk baseret på input name-attribut
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Håndter signup-submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ryd tidligere fejl og succesbeskeder
    setErrorMessage('');
    setSuccessMessage("");
    if (clearError) clearError();

    //  XSS-beskyttelse for navn (bloker < og >)
    if (
      formData.name &&
      (formData.name.includes("<") || formData.name.includes(">"))
    ) {
      setErrorMessage("Navn må ikke indeholde < eller >");
      return;
    }

    // Frontend-validering
    if (!formData.email || !formData.password) {
      setErrorMessage('Email og password er påkrævet');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password skal være mindst 6 tegn');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords er ikke ens');
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMessage('Ugyldig email format');
      return;
    }

    setIsLoading(true);   // aktiver loading-state
    try {

      // Kalder signup som returnerer { success, message }
      const result = await signup(formData.email, formData.password, formData.name);

      if (result.success) {

        // Success - vis besked og redirect til login
        setSuccessMessage(`${result.message} Du vil blive viderestillet til login...`);

        // Vent 3 sekunder og redirect til login
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {

        // Error - vis besked
        setErrorMessage(result.message);
      }

    } catch (err: any) {
      // Fallback-fejl hvis noget uventet går galt
      setErrorMessage(err.message || 'Registrering fejlede');
    } finally {
      // Slå loading fra uanset udfald
      setIsLoading(false);
    }
  };

  const signupContent = React.createElement('div', { className: 'signup-container' },
    React.createElement('h2', null, 'Opret ny bruger'),

    // ERROR: brug fælles ErrorMessage-komponent (lokal fejl + authStore-fejl)
    React.createElement(ErrorMessage, {
      message: errorMessage || authError || '',
      onClose: () => {
        setErrorMessage('');
        if (clearError) clearError();
      }
    }),

    // SUCCESS: vises separat med success-css
    successMessage &&
    React.createElement(
      'div',
      { className: 'success-message' },
      successMessage
    ),

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
        className: 'link-button',
        disabled: isLoading
      }, 'Log ind her')
    )
  );

  return React.createElement(
    Layout,
    null,
    signupContent
  );
};

// Komponenten eksporteres så den kan bruges i routeren
export default SignupPage;