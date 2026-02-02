import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, onAuthAction }) => {
  const token = localStorage.getItem('authToken');
  let isAuthorized = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();
      const isAdminRole = decodedToken.role === 'admin' || decodedToken.role === 'master_admin';
      isAuthorized = !isExpired && isAdminRole;
    } catch (error) {
      isAuthorized = false;
    }
  }

  useEffect(() => {
    if (!isAuthorized && onAuthAction) {
      onAuthAction(false, true);
    }
  }, [isAuthorized, onAuthAction]);

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
