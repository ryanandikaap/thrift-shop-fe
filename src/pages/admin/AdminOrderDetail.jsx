import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone, Hash, Calendar, DollarSign, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const AdminOrderDetail = ({ showNotification }) => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil detail pesanan');
      }
      const data = await response.json();
      setOrder(data.order);
      setStatus(data.order.status);
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'warning');
    } finally {
      setLoading(false);
    }
  }, [id, showNotification]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui status');
      }
      setOrder(data.order);
      setStatus(data.order.status);
      showNotification('Status pesanan berhasil diperbarui!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'warning');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusComponent = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending"><Clock size={14} /> Menunggu Pembayaran</span>;
      case 'paid':
        return <span className="status-badge paid"><CheckCircle size={14} /> Dibayar</span>;
      case 'shipped':
        return <span className="status-badge shipped"><Truck size={14} /> Dikirim</span>;
      case 'completed':
        return <span className="status-badge completed"><CheckCircle size={14} /> Selesai</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) return <div className="admin-loading">Memuat detail pesanan...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;
  if (!order) return <div className="admin-error">Pesanan tidak ditemukan.</div>;

  return (
    <div className="admin-order-detail">
      <div className="admin-header">
        <Link to="/admin/orders" className="back-link"><ArrowLeft size={18} /> Kembali ke Daftar Pesanan</Link>
        <h1>Detail Pesanan #{order.orderId}</h1>
      </div>

      <div className="detail-grid">
        <div className="detail-card items-card">
          <h3>Item Dipesan ({order.items.length})</h3>
          <div className="items-list">
            {order.items.map(item => (
              <div key={item.product?._id || item._id} className="order-item">
                <img src={item.product?.image?.startsWith('http') ? item.product.image : `http://localhost:5000${item.product?.image}`} alt={item.product?.name} />
                <div className="item-info">
                  <p className="item-name">{item.product?.name || 'Produk Dihapus'}</p>
                  <p className="item-meta">{item.quantity} x Rp{item.price.toLocaleString('id-ID')}</p>
                </div>
                <p className="item-total">Rp{(item.quantity * item.price).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-card info-card">
          <h3>Informasi Pesanan</h3>
          <div className="info-list">
            <div className="info-item"><Hash size={16} /><p><strong>ID Pesanan:</strong> {order.orderId}</p></div>
            <div className="info-item"><Calendar size={16} /><p><strong>Tanggal:</strong> {new Date(order.createdAt).toLocaleString('id-ID')}</p></div>
            <div className="info-item"><DollarSign size={16} /><p><strong>Total:</strong> Rp{order.totalAmount.toLocaleString('id-ID')}</p></div>
            <div className="info-item"><Package size={16} /><p><strong>Status Saat Ini:</strong> {getStatusComponent(order.status)}</p></div>
          </div>
          {order.paymentProof && (
            <div className="payment-proof">
              <h4>Bukti Pembayaran:</h4>
              <a href={`http://localhost:5000${order.paymentProof}`} target="_blank" rel="noopener noreferrer">
                <img src={`http://localhost:5000${order.paymentProof}`} alt="Bukti Pembayaran" />
              </a>
            </div>
          )}
        </div>

        <div className="detail-card customer-card">
          <h3>Detail Pelanggan</h3>
          <div className="info-list">
            <div className="info-item"><User size={16} /><p><strong>Nama:</strong> {order.customerDetails?.name || 'N/A'}</p></div>
            <div className="info-item"><Phone size={16} /><p><strong>Telepon:</strong> {order.customerDetails?.phone || 'N/A'}</p></div>
            <div className="info-item"><MapPin size={16} /><p><strong>Alamat:</strong> {order.customerDetails?.address || 'N/A'}</p></div>
            <div className="info-item"><User size={16} /><p><strong>Username Akun:</strong> {order.user?.username || 'N/A'}</p></div>
          </div>
        </div>

        <div className="detail-card status-card">
          <h3>Ubah Status Pesanan</h3>
          <div className="status-update-form">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Menunggu Pembayaran</option>
              <option value="paid">Dibayar</option>
              <option value="shipped">Dikirim</option>
              <option value="completed">Selesai</option>
            </select>
            <button onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? 'Memperbarui...' : 'Perbarui Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;