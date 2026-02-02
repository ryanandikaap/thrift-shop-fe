import React, { useState, useEffect } from 'react';
import { User, Lock, Loader2, Mail } from 'lucide-react';

const AuthForm = ({ isLogin, onSubmit, showNotification, enforcePasswordPolicy = true }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const passwordRequirementMessage = 'Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, dan simbol.';

  const isStrongPassword = (value) => {
    if (!value || value.length < 8) return false;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);
    return hasUppercase && hasLowercase && hasSymbol;
  };

  useEffect(() => {
    setUsername('');
    setPassword('');
    setEmail('');
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      const label = isLogin ? 'Username/Email' : 'Username';
      showNotification(`${label} dan password tidak boleh kosong`, 'warning');
      return;
    }
    if (enforcePasswordPolicy && !isStrongPassword(password)) {
      showNotification(passwordRequirementMessage, 'warning');
      return;
    }
    if (!isLogin && !email) {
      showNotification('Email tidak boleh kosong', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit({ username, password, email });
    } catch (error) { 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="username">{isLogin ? 'Username atau Email' : 'Username'}</label>
        <div className="input-wrapper">
          <User size={20} />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={isLogin ? 'Masukkan username atau email' : 'Masukkan username Anda'}
            disabled={isLoading}
          />
        </div>
      </div>
      {!isLogin && (
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <Mail size={20} />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              disabled={isLoading}
            />
          </div>
        </div>
      )}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-wrapper">
          <Lock size={20} />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password Anda"
            disabled={isLoading}
          />
        </div>
        {enforcePasswordPolicy && (
          <small className="password-hint">
            Password minimal 8 karakter, wajib ada huruf besar, huruf kecil, dan simbol.
          </small>
        )}
      </div>
      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 size={20} className="spinner" />
            <span>Memproses...</span>
          </>
        ) : (
          isLogin ? 'Login Sekarang' : 'Buat Akun'
        )}
      </button>
    </form>
  );
};

export default AuthForm;
