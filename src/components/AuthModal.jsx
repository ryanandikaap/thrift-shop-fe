import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import AuthForm from './AuthForm'; // Kita akan pindahkan AuthForm ke folder components
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}><X size={24} /></button>
        <AuthForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
};

export default AuthModal;