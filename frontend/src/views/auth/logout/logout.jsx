import React, { useEffect } from 'react';
import axios from 'axios';

const Logout = () => {
  useEffect(() => {
    const logout = async () => {
      
      localStorage.removeItem('token');
      window.location.href = `/${import.meta.env.VITE_APP_BASE_NAME}/login`; 
    };

    logout();
  }, []);

  return (
    <div>
      Déconnexion en cours...
    </div>
  );
};

export default Logout;
