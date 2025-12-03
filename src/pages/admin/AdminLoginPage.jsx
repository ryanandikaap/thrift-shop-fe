import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import { Briefcase } from 'lucide-react';

const AdminLoginPage = ({ onLoginSuccess, showNotification }) => {
  const navigate = useNavigate();

  const handleAdminLogin = async (credentials) => {
    const url = 'http://localhost:5000/api/auth/admin/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login admin gagal');
      }

      onLoginSuccess(data.token, data.user);
      showNotification('Login admin berhasil!', 'success');
      navigate('/admin/dashboard');

    } catch (error) {
      showNotification(error.message, 'warning');
      throw error;
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-branding">
        <div className="branding-content">
          <Briefcase size={48} />
          <h1>ThriftStyle</h1>
          <p>Selamat datang di pusat kendali. Kelola produk, pengguna, dan pesanan dengan mudah.</p>
        </div>
      </div>
      <div className="admin-login-form-wrapper">
        <div className="admin-login-box">
          <h2>Admin Panel Login</h2>
          <p className="auth-modal-subtitle">Silakan masukkan kredensial Anda untuk melanjutkan.</p>
          <AuthForm isLogin={true} onSubmit={handleAdminLogin} showNotification={showNotification} />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;