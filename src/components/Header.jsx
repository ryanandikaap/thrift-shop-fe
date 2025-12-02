import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Briefcase } from 'lucide-react';

const Header = ({
  cart,
  searchQuery,
  setSearchQuery,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrolled,
  isLoggedIn,
  userRole, // Properti ini akan kita gunakan
  onAuthAction,
}) => {
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="logo">
          <Briefcase size={32} />
          <h1>ThriftStyle</h1>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/produk">Produk</NavLink></li>
            <li><NavLink to="/kategori">Kategori</NavLink></li>
            <li><NavLink to="/tentang-kami">Tentang Kami</NavLink></li>
            <li><NavLink to="/kontak">Kontak</NavLink></li>
            {/* Tautan Dasbor Admin yang hanya muncul jika user adalah admin */}
            {isLoggedIn && userRole === 'admin' && (
              <li><NavLink to="/admin/dashboard" className="admin-dashboard-link">Dasbor</NavLink></li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="cart-btn" aria-label="Lihat keranjang belanja">
            <ShoppingCart size={22} />
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
          <button className="login-btn" onClick={onAuthAction}>
            <User size={20} />
            <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
          </button>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;