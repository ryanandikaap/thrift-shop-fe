import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, MessageSquare, Trash2, CheckCircle } from 'lucide-react';
import '../../styles/admin/AdminOrderDetail.css';

const AdminMessageDetail = ({ showNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchMessage = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil detail pesan');
      }

      const data = await response.json();
      setMessage(data.data);
      setStatus(data.data.status);
      setAdminNotes(data.data.adminNotes || '');
    } catch (err) {
      setError(err.message);
      if (showNotification) {
        showNotification(err.message, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [id, showNotification]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminNotes })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui status');
      }

      setMessage(data.data);
      setStatus(data.data.status);
      setAdminNotes(data.data.adminNotes || '');

      if (showNotification) {
        showNotification('Status pesan berhasil diperbarui!', 'success');
      }
    } catch (err) {
      setError(err.message);
      if (showNotification) {
        showNotification(err.message, 'error');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
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
        navigate('/admin/messages');
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
      unread: { text: 'Belum Dibaca', class: 'status-badge status-pending' },
      read: { text: 'Sudah Dibaca', class: 'status-badge status-paid' },
      replied: { text: 'Sudah Dibalas', class: 'status-badge status-completed' }
    };

    const badge = badges[status] || badges.unread;

    return <span className={badge.class}>{badge.text}</span>;
  };

  const getStatusText = (status) => {
    if (status === 'unread') return 'Belum Dibaca';
    if (status === 'read') return 'Sudah Dibaca';
    if (status === 'replied') return 'Sudah Dibalas';
    return status;
  };

  if (loading) return <div className="admin-loading">Memuat detail pesan...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;
  if (!message) return <div className="admin-error">Pesan tidak ditemukan.</div>;

  return (
    <div className="admin-order-detail">
      <div className="admin-header">
        <Link to="/admin/messages" className="back-link">
          <ArrowLeft size={18} /> Kembali ke Daftar Pesan
        </Link>
        <h1>Detail Pesan</h1>
      </div>

      <div className="detail-grid">
        {/* Message Content */}
        <div className="detail-card items-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Isi Pesan</h3>
          <div style={{ 
            padding: '20px', 
            background: '#f9fafb', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#666', fontSize: '14px' }}>Subjek:</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '600' }}>
                {message.subject}
              </p>
            </div>
            <div>
              <strong style={{ color: '#666', fontSize: '14px' }}>Pesan:</strong>
              <p style={{ 
                margin: '10px 0 0 0', 
                lineHeight: '1.6', 
                whiteSpace: 'pre-wrap',
                fontSize: '15px'
              }}>
                {message.message}
              </p>
            </div>
          </div>
        </div>

        {/* Sender Info */}
        <div className="detail-card customer-card">
          <h3>Informasi Pengirim</h3>
          <div className="info-list">
            <div className="info-item">
              <User size={16} />
              <p><strong>Nama:</strong> {message.name}</p>
            </div>
            <div className="info-item">
              <Mail size={16} />
              <p><strong>Email:</strong> {message.email}</p>
            </div>
            <div className="info-item">
              <Calendar size={16} />
              <p><strong>Tanggal:</strong> {new Date(message.createdAt).toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            <div className="info-item">
              <CheckCircle size={16} />
              <p><strong>Status:</strong> {getStatusBadge(message.status)}</p>
            </div>
          </div>

          {/* Quick Reply Button */}
          <div style={{ marginTop: '20px' }}>
            <a 
              href={`mailto:${message.email}?subject=Re: ${message.subject}`}
              className="cta-btn"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#333',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <Mail size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Balas via Email
            </a>
          </div>
        </div>

        {/* Status Update */}
        <div className="detail-card status-card">
          <h3>Kelola Pesan</h3>
          
          <div className="status-update-form">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Status Pesan
            </label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginBottom: '15px' }}
            >
              <option value="unread">{getStatusText('unread')}</option>
              <option value="read">{getStatusText('read')}</option>
              <option value="replied">{getStatusText('replied')}</option>
            </select>

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Catatan Admin (Opsional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Tambahkan catatan internal..."
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '15px',
                fontFamily: 'inherit',
                fontSize: '14px'
              }}
            />

            <button 
              onClick={handleStatusUpdate} 
              disabled={isUpdating}
              style={{ marginBottom: '10px' }}
            >
              {isUpdating ? 'Memperbarui...' : 'Perbarui Status'}
            </button>

            <button 
              onClick={handleDelete}
              style={{
                background: '#ef4444',
                width: '100%'
              }}
            >
              <Trash2 size={16} /> Hapus Pesan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessageDetail;
