import React, { useState, useEffect } from 'react';
import { Users, Package, DollarSign, ShoppingCart } from 'lucide-react';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/admin/stats', {
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
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Selamat Datang, Admin!</h1>
        <p>Berikut adalah ringkasan aktivitas di toko Anda.</p>
      </div>

      {error && <p className="admin-error">Error: {error}</p>}

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
          <p className="stat-number">Rp 0</p>
          <span className="card-footer">Fitur mendatang</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
