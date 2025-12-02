import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './AuthForm.css'; // File CSS ini akan kita buat

const AuthForm = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'

  const switchMode = (mode) => {
    setAuthMode(mode);
  };

  const PasswordInput = ({ id, label }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="form-group password-group">
        <input type={showPassword ? 'text' : 'password'} id={id} required />
        <label htmlFor={id}>{label}</label>
        <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    );
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess(); // Panggil fungsi ini saat form login disubmit
  };

  const LoginForm = (
    <form className="auth-form-body" onSubmit={handleLoginSubmit}>
      <div className="form-group">
        <input type="email" id="login-email" required />
        <label htmlFor="login-email">Email</label>
      </div>
      <div className="form-group">
        <PasswordInput id="login-password" label="Password" />      </div>
      <div className="form-options">
        <a href="#" onClick={() => switchMode('forgot')}>Lupa Password?</a>
      </div>
      <button type="submit" className="btn btn-primary">Login</button>
      <div className="form-switch">
        <span>Belum punya akun? <a href="#" onClick={() => switchMode('register')}>Daftar di sini</a></span>
      </div>
    </form>
  );

  const RegisterForm = (
    <form className="auth-form-body" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <input type="text" id="register-name" required />
        <label htmlFor="register-name">Nama Lengkap</label>
      </div>
      <div className="form-group">
        <input type="email" id="register-email" required />
        <label htmlFor="register-email">Email</label>
      </div>
      <div className="form-group">
        <PasswordInput id="register-password" label="Password" />      </div>
      <div className="form-group">
        <PasswordInput id="confirm-password" label="Konfirmasi Password" />      </div>
      <button type="submit" className="btn btn-primary">Daftar</button>
      <div className="form-switch">
        <span>Sudah punya akun? <a href="#" onClick={() => switchMode('login')}>Login di sini</a></span>
      </div>
    </form>
  );

  const ForgotPasswordForm = (
    <form className="auth-form-body" onSubmit={(e) => e.preventDefault()}>
      <p className="forgot-info">Masukkan email Anda dan kami akan mengirimkan link untuk mereset password Anda.</p>
      <div className="form-group">
        <input type="email" id="forgot-email" required />
        <label htmlFor="forgot-email">Email</label>
      </div>
      <button type="submit" className="btn btn-primary">Kirim Link Reset</button>
      <div className="form-switch">
        <span>Kembali ke <a href="#" onClick={() => switchMode('login')}>Login</a></span>
      </div>
    </form>
  );

  const renderForm = () => {
    switch (authMode) {
      case 'register':
        return RegisterForm;
      case 'forgot':
        return ForgotPasswordForm;
      default:
        return LoginForm;
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'register':
        return 'Buat Akun Baru';
      case 'forgot':
        return 'Reset Password';
      default:
        return 'Selamat Datang Kembali';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card"> {/* Penambahan className yang hilang ada di sini */}
        <div className="auth-header">
          <h2>{getTitle()}</h2>
        </div>
        {renderForm()}
        <div className="separator">
          <span>ATAU</span>
        </div>
        <div className="social-login">
          <button className="btn btn-social btn-google">
            <img src="https://www.google.com/favicon.ico" alt="Google icon" /> Lanjutkan dengan Google
          </button>
          <button className="btn btn-social btn-facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg> Lanjutkan dengan Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
