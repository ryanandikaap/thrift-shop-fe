import React, { useState, useEffect } from 'react';
import { Users, Package, DollarSign, ShoppingCart, Calendar, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [reportDate, setReportDate] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().split('T')[0];
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const query = reportDate ? `?date=${reportDate}` : '';
        const response = await fetch(`http://localhost:5000/api/admin/stats${query}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Gagal mengambil data admin');
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, [reportDate]);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Selamat Datang, Admin!</h1>
        <p>Berikut adalah ringkasan aktivitas di toko Anda.</p>
      </div>

      {error && <p className="admin-error">Error: {error}</p>}

      <div className="report-filter">
        <div className="filter-group">
          <label htmlFor="report-date">Tanggal Acuan</label>
          <input
            id="report-date"
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="filter-btn"
          onClick={() => {
            const now = new Date();
            const offset = now.getTimezoneOffset();
            const local = new Date(now.getTime() - offset * 60000);
            setReportDate(local.toISOString().split('T')[0]);
          }}
        >
          Reset Hari Ini
        </button>
      </div>

      <div className="stat-cards-grid">
        <div className="stat-card primary">
          <div className="card-icon">
            <Users size={28} />
          </div>
          <h3>Total Pengguna</h3>
          <p className="stat-number">{stats ? stats.totalUsers : '...'}</p>
        </div>
        <div className="stat-card secondary">
          <div className="card-icon">
            <Package size={28} />
          </div>
          <h3>Total Produk</h3>
          <p className="stat-number">{stats ? stats.totalProducts : '...'}</p>
        </div>
        <div className="stat-card tertiary">
          <div className="card-icon">
            <ShoppingCart size={28} />
          </div>
          <h3>Total Pesanan</h3>
          <p className="stat-number">{stats ? stats.totalOrders : '...'}</p>
        </div>
        <div className="stat-card accent">
          <div className="card-icon">
            <DollarSign size={28} />
          </div>
          <h3>Pendapatan (Bulan Ini)</h3>
          <p className="stat-number">
            {stats ? `Rp${stats.monthlyRevenue.toLocaleString('id-ID')}` : '...'}
          </p>
          <span className="card-footer">
            {stats ? `${stats.monthlyOrdersCount} pesanan` : 'Memuat...'}
          </span>
        </div>
      </div>

      <div className="report-section">
        <div className="section-header">
          <h2>Laporan Pemasukan</h2>
          <p>Ringkasan pemasukan berdasarkan periode.</p>
        </div>
        <div className="report-grid">
          <div className="report-card">
            <div className="report-icon daily">
              <Calendar size={22} />
            </div>
            <div className="report-body">
              <h4>Harian</h4>
              <p className="report-amount">{stats ? `Rp${stats.dailyRevenue.toLocaleString('id-ID')}` : '...'}</p>
              <span>{stats ? `${stats.dailyOrdersCount} pesanan` : 'Memuat...'}</span>
            </div>
          </div>
          <div className="report-card">
            <div className="report-icon weekly">
              <CalendarDays size={22} />
            </div>
            <div className="report-body">
              <h4>Mingguan</h4>
              <p className="report-amount">{stats ? `Rp${stats.weeklyRevenue.toLocaleString('id-ID')}` : '...'}</p>
              <span>{stats ? `${stats.weeklyOrdersCount} pesanan` : 'Memuat...'}</span>
            </div>
          </div>
          <div className="report-card">
            <div className="report-icon monthly">
              <CalendarRange size={22} />
            </div>
            <div className="report-body">
              <h4>Bulanan</h4>
              <p className="report-amount">{stats ? `Rp${stats.monthlyRevenue.toLocaleString('id-ID')}` : '...'}</p>
              <span>{stats ? `${stats.monthlyOrdersCount} pesanan` : 'Memuat...'}</span>
            </div>
          </div>
          <div className="report-card">
            <div className="report-icon yearly">
              <CalendarClock size={22} />
            </div>
            <div className="report-body">
              <h4>Tahunan</h4>
              <p className="report-amount">{stats ? `Rp${stats.yearlyRevenue.toLocaleString('id-ID')}` : '...'}</p>
              <span>{stats ? `${stats.yearlyOrdersCount} pesanan` : 'Memuat...'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
