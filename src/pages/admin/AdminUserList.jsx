import React, { useState, useEffect } from 'react';
import { Shield, User, Trash2 } from 'lucide-react';
import '../../styles/admin/AdminTable.css';

const AdminUserList = ({ showNotification }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil data pengguna');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Aksi ini tidak dapat dibatalkan.')) {
      setDeletingId(userId);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Gagal menghapus pengguna');
        }

        showNotification('Pengguna berhasil dihapus!', 'success');
        fetchUsers();
      } catch (err) {
        showNotification(err.message, 'warning');
        setError(err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="admin-user-list">
      <div className="admin-header">
        <h1>Manajemen Pengguna</h1>
        <p>Lihat dan kelola semua pengguna yang terdaftar di platform Anda.</p>
      </div>

      {error && <p className="admin-error">Error: {error}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Peran</th>
              <th>Tanggal Bergabung</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>Memuat data pengguna...</td></tr>
            ) : users.length > 0 ? users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="action-buttons">
                  <button 
                    onClick={() => handleDelete(user._id)} 
                    className="delete-btn"
                    disabled={deletingId === user._id || user.role === 'admin'}
                  >
                    <Trash2 size={16} /> {deletingId === user._id ? 'Menghapus...' : 'Hapus'}
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Belum ada pengguna terdaftar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserList;
