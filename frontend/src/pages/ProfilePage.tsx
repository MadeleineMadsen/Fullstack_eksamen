import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import '../style/app.css';
import '../style/kamilla.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  const profileContent = React.createElement('div', { className: 'profile-container' },
    React.createElement('h2', { className: 'profile-title' }, '👤 Profil'),
    React.createElement('div', { className: 'profile-info' },
      React.createElement('p', { className: 'profile-email' }, 
        `📧 Email: ${user?.email || 'Ikke logget ind'}`),
      React.createElement('p', { className: 'profile-name' }, 
        `👤 Navn: ${user?.username || 'Ikke angivet'}`)
    )
  );

  return React.createElement(
    Layout,
    null,
    profileContent
  );
};

export default ProfilePage;