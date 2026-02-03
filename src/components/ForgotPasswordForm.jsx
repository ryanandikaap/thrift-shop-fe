import React, { useState, useEffect } from 'react';
import { User, Lock, Hash, Loader2 } from 'lucide-react';

const ForgotPasswordForm = ({ showNotification, onBackToLogin, onResetComplete }) => {
  const [step, setStep] = useState('request');
  const [loginId, setLoginId] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (step === 'request') {
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [step]);

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    if (!loginId.trim()) {
      showNotification('Username atau email tidak boleh kosong', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      showNotification(data.message, 'success');
      setStep('reset');
    } catch (error) {
      showNotification(error.message, 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    if (!loginId.trim() || !code.trim() || !newPassword) {
      showNotification('Semua field wajib diisi', 'warning');
      return;
    }
    if (!isStrongPassword(newPassword)) {
      showNotification(passwordRequirementMessage, 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification('Konfirmasi password tidak cocok', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, code, newPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      showNotification(data.message, 'success');
      setStep('request');
      setLoginId('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      onResetComplete();
    } catch (error) {
      showNotification(error.message, 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-forgot">
      {step === 'request' ? (
        <>
          <h2>Lupa Password</h2>
          <p className="auth-modal-subtitle">
            Masukkan username atau email untuk mendapatkan kode verifikasi.
          </p>

          <form onSubmit={handleRequestSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="forgot-login-id">Username atau Email</label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="forgot-login-id"
                  value={loginId}
                  onChange={(event) => setLoginId(event.target.value)}
                  placeholder="Masukkan username atau email"
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
                'Kirim Kode Verifikasi'
              )}
            </button>
          </form>

          <div className="auth-helper">
            Kode verifikasi akan muncul di terminal backend.
          </div>

          <div className="auth-modal-footer">
            <p>Sudah ingat password? <button type="button" onClick={onBackToLogin}>Login di sini</button></p>
          </div>
        </>
      ) : (
        <>
          <h2>Verifikasi & Ganti Password</h2>
          <p className="auth-modal-subtitle">
            Masukkan kode verifikasi dan password baru Anda.
          </p>

          <form onSubmit={handleResetSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="reset-login-id">Username atau Email</label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="reset-login-id"
                  value={loginId}
                  onChange={(event) => setLoginId(event.target.value)}
                  placeholder="Masukkan username atau email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reset-code">Kode Verifikasi</label>
              <div className="input-wrapper">
                <Hash size={20} />
                <input
                  type="text"
                  id="reset-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Masukkan kode verifikasi"
                  inputMode="numeric"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reset-password">Password Baru</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input
                  type="password"
                  id="reset-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Masukkan password baru"
                  disabled={isLoading}
                />
              </div>
              <small className="password-hint">
                Password minimal 8 karakter, wajib ada huruf besar, huruf kecil, dan simbol.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="reset-confirm">Konfirmasi Password</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input
                  type="password"
                  id="reset-confirm"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Ulangi password baru"
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
                'Simpan Password Baru'
              )}
            </button>
          </form>

          <div className="auth-helper">
            Masukkan kode yang muncul di terminal backend.
          </div>

          <div className="auth-modal-footer">
            <p>Belum menerima kode? <button type="button" onClick={() => setStep('request')}>Kirim ulang</button></p>
            <p>Sudah ingat password? <button type="button" onClick={onBackToLogin}>Login di sini</button></p>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
