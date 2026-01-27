import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, Truck, Clock, Package } from 'lucide-react';
import { getStatusComponent as getStatusComponentUtil } from '../../utils/statusUtils.jsx';
import '../../styles/admin/AdminTable.css';

const AdminOrderList = ({ showNotification }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    month: '',
    year: '',
  });

  const buildQuery = (activeFilters) => {
    const currentFilters = activeFilters || filters;
    const params = new URLSearchParams();
    if (currentFilters.startDate) params.append('startDate', currentFilters.startDate);
    if (currentFilters.endDate) params.append('endDate', currentFilters.endDate);
    if (!currentFilters.startDate && !currentFilters.endDate) {
      if (currentFilters.month) params.append('month', currentFilters.month);
      if (currentFilters.year) params.append('year', currentFilters.year);
    }
    const query = params.toString();
    return query ? `?${query}` : '';
  };

  const applyClientFilter = (orderList, activeFilters) => {
    const startDate = activeFilters.startDate ? new Date(`${activeFilters.startDate}T00:00:00`) : null;
    const endDate = activeFilters.endDate ? new Date(`${activeFilters.endDate}T23:59:59.999`) : null;
    if (startDate || endDate) {
      return orderList.filter((order) => {
        const createdAt = new Date(order.createdAt);
        if (startDate && createdAt < startDate) return false;
        if (endDate && createdAt > endDate) return false;
        return true;
      });
    }

    if (activeFilters.month || activeFilters.year) {
      const now = new Date();
      const targetYear = activeFilters.year ? Number(activeFilters.year) : now.getFullYear();
      const targetMonth = activeFilters.month ? Number(activeFilters.month) - 1 : null;
      return orderList.filter((order) => {
        const createdAt = new Date(order.createdAt);
        if (!Number.isNaN(targetYear) && createdAt.getFullYear() !== targetYear) return false;
        if (targetMonth !== null && !Number.isNaN(targetMonth) && createdAt.getMonth() !== targetMonth) return false;
        return true;
      });
    }

    return orderList;
  };

  const fetchOrders = async (targetFilters = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const activeFilters = targetFilters || filters;
      const query = buildQuery(activeFilters);
      const response = await fetch(`http://localhost:5000/api/admin/orders${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal mengambil data pesanan');
      }
      const data = await response.json();
      setOrders(applyClientFilter(data.orders, activeFilters));
    } catch (err) {
      setError(err.message);
      if (showNotification) {
        showNotification(err.message, 'warning');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    fetchOrders(filters);
  };

  const handleResetFilter = () => {
    const resetFilters = { startDate: '', endDate: '', month: '', year: '' };
    setFilters(resetFilters);
    fetchOrders(resetFilters);
  };

  const getStatusComponent = (status) => { // Wrapper to pass correct icon
    let Icon;
    if (status === 'pending') Icon = Clock;
    else if (status === 'paid' || status === 'completed') Icon = CheckCircle;
    else if (status === 'shipped') Icon = Truck;
    else Icon = Package; // Default icon

    return getStatusComponentUtil(status, Icon);
  };

  return (
    <div className="admin-order-list">
      <div className="admin-header">
        <h1>Manajemen Pesanan</h1>
        <p>Kelola semua pesanan yang masuk dari pelanggan.</p>
      </div>

      {error && <p className="admin-error">Error: {error}</p>}

      <div className="admin-filter-bar">
        <div className="filter-group">
          <label htmlFor="filter-start">Tanggal Mulai</label>
          <input
            id="filter-start"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="filter-end">Tanggal Akhir</label>
          <input
            id="filter-end"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="filter-month">Bulan</label>
          <select
            id="filter-month"
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
          >
            <option value="">Semua</option>
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="filter-year">Tahun</label>
          <input
            id="filter-year"
            type="number"
            min="2000"
            max="2100"
            placeholder="Contoh: 2026"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <button className="filter-btn" type="button" onClick={handleApplyFilter}>
            Terapkan
          </button>
          <button className="filter-btn secondary" type="button" onClick={handleResetFilter}>
            Reset
          </button>
        </div>
        <div className="filter-note">
          Rentang tanggal akan mengabaikan pilihan bulan/tahun.
        </div>
      </div>

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
