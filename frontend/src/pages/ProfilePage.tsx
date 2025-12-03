import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  return React.createElement('div', { className: 'profile-container' },
    React.createElement('h2', null, 'Profil'),
    React.createElement('p', null, `Email: ${user?.email || 'Ikke logget ind'}`),
    React.createElement('p', null, `Navn: ${user?.name || 'Ikke angivet'}`)
  );
};

export default ProfilePage;