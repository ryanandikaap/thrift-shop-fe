import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';
import { getStatusText } from '../utils/statusUtils.jsx';
import '../styles/user/OrderHistory.css';

const OrderHistory = ({ showNotification }) => {
  const journeyLabels = {
    order_created: 'Pesanan dibuat',
    payment_uploaded: 'Bukti pembayaran diunggah',
    payment_confirmed: 'Pembayaran dikonfirmasi',
    processing: 'Pesanan diproses',
    packed: 'Pesanan dikemas',
    shipped: 'Pesanan dikirim',
    in_transit: 'Dalam perjalanan',
    out_for_delivery: 'Kurir menuju alamat',
    delivered: 'Pesanan diterima',
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/users/me/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Gagal mengambil riwayat pesanan');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        showNotification(error.message, 'warning');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [showNotification]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getJourneyLabel = (status) => journeyLabels[status] || status;

  if (loading) {
    return <div className="loading-state">Memuat riwayat pesanan...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="no-products-found" style={{ background: 'transparent', boxShadow: 'none', padding: '40px 0' }}>
        <Package size={60} strokeWidth={1} />
        <h3>Anda Belum Memiliki Pesanan</h3>
        <p>Semua pesanan yang Anda buat akan muncul di sini.</p>
        <Link to="/produk" className="cta-btn" style={{ marginTop: '20px' }}>
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="order-history-list">
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-summary" onClick={() => toggleOrderDetails(order._id)}>
            <div className="order-info">
              <span className="order-id">#{order.orderId}</span>
              <span className="order-date">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="order-status-total">
              <span className={`status-badge status-${order.status.toLowerCase()}`}>{getStatusText(order.status)}</span>
              <span className="order-total">Rp{order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <button className="expand-btn">
              {expandedOrderId === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          {expandedOrderId === order._id && (
            <div className="order-details">
              <h4>Detail Item:</h4>
              {order.items.map(item => (
                <div key={item.product._id} className="order-item">
                  <img src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`} alt={item.product.name} />
                  <div className="item-info">
                    <Link to={`/produk/${item.product._id}`}>{item.product.name}</Link> 
                    <span>{item.quantity} x Rp{item.product.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
              <div className="order-shipping-details">
                <h4>Detail Pengiriman:</h4>
                <p><strong>Penerima:</strong> {order.customerDetails?.name || 'Tidak tersedia'}</p>
                <p><strong>Alamat:</strong> {order.customerDetails?.address || 'Tidak tersedia'}</p>
                <p><strong>Telepon:</strong> {order.customerDetails?.phone || 'Tidak tersedia'}</p>
              </div>
              <div className="order-journey-details">
                <h4>Proses Perjalanan:</h4>
                {(order.journey || []).length === 0 ? (
                  <p className="journey-empty">Belum ada update perjalanan.</p>
                ) : (
                  <div className="journey-timeline">
                    {(order.journey || [])
                      .slice()
                      .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
                      .map((entry, index) => (
                        <div key={`${entry.status}-${entry.updatedAt}-${index}`} className="journey-entry">
                          <div className="journey-dot" />
                          <div className="journey-info">
                            <p className="journey-status">{getJourneyLabel(entry.status)}</p>
                            {entry.note && <p className="journey-note">{entry.note}</p>}
                            <span className="journey-time">{new Date(entry.updatedAt).toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
