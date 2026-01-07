import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import '../styles/user/ProfileEditor.css';

const ProfileEditor = ({ user, onUserUpdate, showNotification }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch user profile data from API on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: data.username || '',
            email: data.email || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal memperbarui profil');

      // Backend returns data directly, not wrapped in .user
      onUserUpdate(data); 
      showNotification('Profil berhasil diperbarui!', 'success');

    } catch (error) {
      showNotification(error.message, 'warning');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="profile-editor-form">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Loader2 size={32} className="spinner" />
          <p>Memuat data profil...</p>
        </div>
      </div>
    );
  }

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
