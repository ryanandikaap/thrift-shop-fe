import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Mail, MailOpen, CheckCircle, Trash2, Search } from 'lucide-react';
import '../../styles/admin/AdminTable.css';

const AdminMessageList = ({ showNotification }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, replied: 0 });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams();
      if (filter !== 'all') queryParams.append('status', filter);
      if (searchTerm) queryParams.append('search', searchTerm);

      const response = await fetch(`http://localhost:5000/api/contact?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil data pesan');
      }

      const data = await response.json();
      setMessages(data.data);
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
      if (showNotification) {
        showNotification(err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter, showNotification]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMessages();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        if (showNotification) {
          showNotification('Pesan berhasil dihapus', 'success');
        }
        fetchMessages();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      if (showNotification) {
        showNotification(err.message, 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      unread: { text: 'Belum Dibaca', class: 'status-badge status-pending', icon: Mail },
      read: { text: 'Sudah Dibaca', class: 'status-badge status-paid', icon: MailOpen },
      replied: { text: 'Sudah Dibalas', class: 'status-badge status-completed', icon: CheckCircle }
    };

    const badge = badges[status] || badges.unread;
    const Icon = badge.icon;

    return (
      <span className={badge.class}>
        <Icon size={14} /> {badge.text}
      </span>
    );
  };

  return (
    <div className="admin-message-list">
      <div className="admin-header">
        <h1>Pesan Kontak</h1>
        <p>Kelola pesan dari pelanggan yang masuk melalui form kontak.</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="stat-card" style={{ 
          padding: '20px', 
          background: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Pesan</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{stats.total}</p>
        </div>
        <div className="stat-card" style={{ 
          padding: '20px', 
          background: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Belum Dibaca</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.unread}</p>
        </div>
        <div className="stat-card" style={{ 
          padding: '20px', 
          background: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Sudah Dibaca</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.read}</p>
        </div>
        <div className="stat-card" style={{ 
          padding: '20px', 
          background: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Sudah Dibalas</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.replied}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="admin-filters" style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px', 
        flexWrap: 'wrap' 
      }}>
        <div className="filter-buttons" style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: filter === 'all' ? '#333' : '#fff',
              color: filter === 'all' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            Semua
          </button>
          <button 
            onClick={() => setFilter('unread')} 
            className={filter === 'unread' ? 'filter-btn active' : 'filter-btn'}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: filter === 'unread' ? '#333' : '#fff',
              color: filter === 'unread' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            Belum Dibaca
          </button>
          <button 
            onClick={() => setFilter('read')} 
            className={filter === 'read' ? 'filter-btn active' : 'filter-btn'}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: filter === 'read' ? '#333' : '#fff',
              color: filter === 'read' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            Sudah Dibaca
          </button>
          <button 
            onClick={() => setFilter('replied')} 
            className={filter === 'replied' ? 'filter-btn active' : 'filter-btn'}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: filter === 'replied' ? '#333' : '#fff',
              color: filter === 'replied' ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            Sudah Dibalas
          </button>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1 }}>
          <input
            type="text"
            placeholder="Cari pesan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button type="submit" style={{
            padding: '8px 16px',
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Search size={16} /> Cari
          </button>
        </form>
      </div>

      {error && <p className="admin-error">Error: {error}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Subjek</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Memuat data pesan...</td></tr>
            ) : messages.length > 0 ? messages.map(message => (
              <tr key={message._id} style={{ fontWeight: message.status === 'unread' ? 'bold' : 'normal' }}>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>{message.subject}</td>
                <td>{new Date(message.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
                <td>{getStatusBadge(message.status)}</td>
                <td className="action-buttons">
                  <Link to={`/admin/messages/${message._id}`} className="view-btn">
                    <Eye size={16} /> Lihat
                  </Link>
                  <button 
                    onClick={() => handleDelete(message._id)} 
                    className="delete-btn"
                    style={{
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px'
                    }}
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Belum ada pesan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMessageList;
