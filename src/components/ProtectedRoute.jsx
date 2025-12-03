import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now() || decodedToken.role !== 'admin') {
      return <Navigate to="/admin/login" />;
    }
  } catch (error) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;