import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AuthForm from './AuthForm';

const AuthModal = ({ isOpen, onClose, onLoginSuccess, showNotification }) => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const handleEsc = (event) => {
      if (isOpen && event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (credentials) => {
    const endpoint = isLogin ? 'login' : 'register';
    const url = `http://localhost:5000/api/auth/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      showNotification(data.message, 'success');

      if (isLogin) {
        if (data.user && data.user.role === 'admin') {
          throw new Error('Akun admin tidak dapat login melalui form ini.');
        }
        onLoginSuccess(data.token, data.user);
      } else {
        setIsLogin(true);
      }
    } catch (error) {
      showNotification(error.message, 'warning');
      throw error;
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}><X size={24} /></button>
        <h2>{isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}</h2>
        <p className="auth-modal-subtitle">
          {isLogin ? 'Masuk untuk melanjutkan belanja.' : 'Daftar untuk mendapatkan penawaran terbaik.'}
        </p>

        <AuthForm
          isLogin={isLogin}
          onSubmit={handleAuthSubmit}
          showNotification={showNotification}
        />

        <div className="auth-modal-footer">
          {isLogin ? (
            <p>Belum punya akun? <button onClick={() => setIsLogin(false)}>Daftar di sini</button></p>
          ) : (
            <p>Sudah punya akun? <button onClick={() => setIsLogin(true)}>Login di sini</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;