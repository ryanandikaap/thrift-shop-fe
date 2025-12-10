import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, Truck, Clock } from 'lucide-react';

const AdminOrderList = ({ showNotification }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Gagal mengambil data pesanan');
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
        if (showNotification) {
            showNotification(err.message, 'warning');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showNotification]);

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

  return (
    <div className="admin-order-list">
      <div className="admin-header">
        <h1>Manajemen Pesanan</h1>
        <p>Kelola semua pesanan yang masuk dari pelanggan.</p>
      </div>

      {error && <p className="admin-error">Error: {error}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Pelanggan</th>
              <th>Tanggal</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Memuat data pesanan...</td></tr>
            ) : orders.length > 0 ? orders.map(order => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.customerDetails?.name || 'N/A'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                <td>Rp{order.totalAmount.toLocaleString('id-ID')}</td>
                <td>{getStatusComponent(order.status)}</td>
                <td className="action-buttons">
                  <Link to={`/admin/orders/${order._id}`} className="view-btn">
                    <Eye size={16} /> Lihat
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Belum ada pesanan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;