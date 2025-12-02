import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Jika tidak ada token, arahkan ke halaman utama
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode(token);
    // Cek apakah token masih berlaku dan rolenya adalah admin
    if (decodedToken.exp * 1000 < Date.now() || decodedToken.role !== 'admin') {
      return <Navigate to="/" />;
    }
  } catch (error) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;