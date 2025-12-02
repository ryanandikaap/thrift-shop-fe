import React, { useState } from 'react';
import { User, Lock, Loader2 } from 'lucide-react';

const AuthForm = ({ isLogin, onSubmit, showNotification }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showNotification('Username dan password tidak boleh kosong', 'warning');
      return;
    }
    setIsLoading(true);
    try {
      await onSubmit({ username, password });
    } catch (error) {
      // Error sudah ditangani di AuthModal, di sini hanya reset loading state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <div className="input-wrapper">
          <User size={20} />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username Anda"
            disabled={isLoading}
          />
        </div>
      </div>
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