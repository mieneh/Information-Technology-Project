// frontend/src/pages/Logout.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
