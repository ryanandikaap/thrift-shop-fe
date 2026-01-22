import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, MessageSquare, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/contact/unread/count', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.data.count);
        }
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

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
        <NavLink to="/admin/messages" className="sidebar-link">
          <MessageSquare size={20} />
          <span>Pesan</span>
          {unreadCount > 0 && (
            <span className="badge" style={{
              marginLeft: 'auto',
              background: '#ef4444',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {unreadCount}
            </span>
          )}
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
