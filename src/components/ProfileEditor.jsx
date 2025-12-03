import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const ProfileEditor = ({ user, onUserUpdate, showNotification }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal memperbarui profil');

      onUserUpdate(data.user); 
      showNotification('Profil berhasil diperbarui!', 'success');

    } catch (error) {
      showNotification(error.message, 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-editor-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="cta-btn" disabled={loading}>
          {loading ? <><Loader2 size={18} className="spinner" /> Memperbarui...</> : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;