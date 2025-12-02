import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  // Fungsi logout bisa ditambahkan di sini jika diperlukan
  const handleLogout = () => {
    // Logika untuk logout
    console.log("Logout clicked");
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h3>ThriftStyle</h3>
        <span>Admin Panel</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className="sidebar-link">
          <LayoutDashboard size={20} />
          <span>Dasbor Admin</span>
        </NavLink>
        <NavLink to="/admin/products" className="sidebar-link">
          <Package size={20} />
          <span>Produk</span>
        </NavLink>
        <NavLink to="/admin/users" className="sidebar-link disabled-link">
          <Users size={20} />
          <span>Pengguna</span>
        </NavLink>
        <NavLink to="/admin/orders" className="sidebar-link disabled-link">
          <ShoppingCart size={20} />
          <span>Pesanan</span>
        </NavLink>
      </nav>
      {/* Bisa ditambahkan tombol logout di bawah */}
    </aside>
  );
};

export default AdminSidebar;