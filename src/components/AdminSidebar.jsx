import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
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
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/products" className="sidebar-link">
          <Package size={20} />
          <span>Produk</span>
        </NavLink>
        <NavLink to="/admin/users" className="sidebar-link">
          <Users size={20} />
          <span>Pengguna</span>
        </NavLink>
        <NavLink to="/admin/orders" className="sidebar-link">
          <ShoppingCart size={20} />
          <span>Pesanan</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;