import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AuthForm from './AuthForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import '../styles/components/AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess, showNotification }) => {
  const [authView, setAuthView] = useState('login');

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

  useEffect(() => {
    if (isOpen) {
      setAuthView('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (credentials) => {
    const isLoginView = authView === 'login';
    const endpoint = isLoginView ? 'login' : 'register';
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

      if (isLoginView) {
        onLoginSuccess(data.token, data.user);
      } else {
        setAuthView('login');
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
        {authView === 'forgot' ? (
          <ForgotPasswordForm
            showNotification={showNotification}
            onBackToLogin={() => setAuthView('login')}
            onResetComplete={() => setAuthView('login')}
          />
        ) : (
          <>
            <h2>{authView === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}</h2>
            <p className="auth-modal-subtitle">
              {authView === 'login' ? 'Masuk untuk melanjutkan belanja.' : 'Daftar untuk mendapatkan penawaran terbaik.'}
            </p>

            <AuthForm
              isLogin={authView === 'login'}
              onSubmit={handleAuthSubmit}
              showNotification={showNotification}
              enforcePasswordPolicy={true}
            />

            {authView === 'login' && (
              <div className="auth-inline-links">
                <button type="button" onClick={() => setAuthView('forgot')}>Lupa password?</button>
              </div>
            )}

            <div className="auth-modal-footer">
              {authView === 'login' ? (
                <p>Belum punya akun? <button onClick={() => setAuthView('register')}>Daftar di sini</button></p>
              ) : (
                <p>Sudah punya akun? <button onClick={() => setAuthView('login')}>Login di sini</button></p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
