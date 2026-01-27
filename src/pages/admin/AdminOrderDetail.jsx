import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone, Hash, Calendar, DollarSign, Package, Truck, CheckCircle, Clock, Route } from 'lucide-react';
import { getStatusComponent as getStatusComponentUtil } from '../../utils/statusUtils.jsx';
import '../../styles/admin/AdminOrderDetail.css';

const AdminOrderDetail = ({ showNotification }) => {
  const journeyOptions = [
    { value: 'order_created', label: 'Pesanan dibuat' },
    { value: 'payment_uploaded', label: 'Bukti pembayaran diunggah' },
    { value: 'payment_confirmed', label: 'Pembayaran dikonfirmasi' },
    { value: 'processing', label: 'Pesanan diproses' },
    { value: 'packed', label: 'Pesanan dikemas' },
    { value: 'shipped', label: 'Pesanan dikirim' },
    { value: 'in_transit', label: 'Dalam perjalanan' },
    { value: 'out_for_delivery', label: 'Kurir menuju alamat' },
    { value: 'delivered', label: 'Pesanan diterima' },
  ];

  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [journeyStatus, setJourneyStatus] = useState(journeyOptions[0].value);
  const [journeyNote, setJourneyNote] = useState('');
  const [isJourneyUpdating, setIsJourneyUpdating] = useState(false);

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
      if (data.order.journey && data.order.journey.length > 0) {
        const lastJourney = data.order.journey[data.order.journey.length - 1];
        if (lastJourney?.status && journeyOptions.some(option => option.value === lastJourney.status)) {
          setJourneyStatus(lastJourney.status);
        }
      }
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

  const handleJourneyUpdate = async () => {
    setIsJourneyUpdating(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${id}/journey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: journeyStatus,
          note: journeyNote,
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui proses perjalanan');
      }
      setOrder(data.order);
      setJourneyNote('');
      showNotification('Proses perjalanan berhasil diperbarui!', 'success');
    } catch (err) {
      setError(err.message);
      showNotification(err.message, 'warning');
    } finally {
      setIsJourneyUpdating(false);
    }
  };

  const getStatusComponent = (status) => { // Wrapper to pass correct icon
    let Icon;
    if (status === 'pending') Icon = Clock;
    else if (status === 'paid' || status === 'completed') Icon = CheckCircle;
    else if (status === 'shipped') Icon = Truck;
    else Icon = Package; // Default icon
    
    return getStatusComponentUtil(status, Icon);
  };

  const getStatusText = (status) => { // Helper for select options
    if (status === 'pending') return 'Menunggu Pembayaran';
    if (status === 'paid') return 'Dibayar';
    if (status === 'shipped') return 'Dikirim';
    if (status === 'completed') return 'Selesai';
    return status;
  };

  const getJourneyLabel = (status) => {
    const option = journeyOptions.find((item) => item.value === status);
    return option ? option.label : status;
  };

  const sortedJourney = (order?.journey || [])
    .slice()
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

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
              <option value="pending">{getStatusText('pending')}</option>
              <option value="paid">{getStatusText('paid')}</option>
              <option value="shipped">{getStatusText('shipped')}</option>
              <option value="completed">{getStatusText('completed')}</option>
            </select>
            <button onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? 'Memperbarui...' : 'Perbarui Status'}
            </button>
          </div>
        </div>

        <div className="detail-card journey-card">
          <h3>Proses Perjalanan</h3>
          <div className="journey-list">
            {sortedJourney.length === 0 ? (
              <div className="journey-empty">Belum ada update perjalanan.</div>
            ) : (
              sortedJourney.map((entry, index) => (
                <div key={`${entry.status}-${entry.updatedAt}-${index}`} className="journey-item">
                  <div className="journey-icon">
                    <Route size={16} />
                  </div>
                  <div className="journey-content">
                    <p className="journey-status">{getJourneyLabel(entry.status)}</p>
                    {entry.note && <p className="journey-note">{entry.note}</p>}
                    <span className="journey-time">
                      {new Date(entry.updatedAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="journey-update-form">
            <select value={journeyStatus} onChange={(e) => setJourneyStatus(e.target.value)}>
              {journeyOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <textarea
              rows="3"
              placeholder="Catatan tambahan (opsional)"
              value={journeyNote}
              onChange={(e) => setJourneyNote(e.target.value)}
            />
            <button onClick={handleJourneyUpdate} disabled={isJourneyUpdating}>
              {isJourneyUpdating ? 'Memperbarui...' : 'Tambah Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
