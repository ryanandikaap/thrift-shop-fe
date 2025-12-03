import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Briefcase, Heart, LogOut, UserCircle } from 'lucide-react';

const Header = ({
  cart,
  searchQuery,
  setSearchQuery,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrolled,
  user,
  userRole,
  onAuthAction,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0); 

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
            {user && userRole === 'admin' && (
              <li><NavLink to="/admin/dashboard" className="admin-dashboard-link">Dashboard Admin</NavLink></li>
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
          <Link to="/keranjang" className="cart-btn" aria-label="Lihat keranjang belanja">
            <ShoppingCart size={22} />
            {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
          </Link>
          
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="login-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <User size={20} />
                <span>{user.username}</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to="/profil" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <UserCircle size={16} /> Profil Saya
                  </Link>
                  <Link to="/wishlist" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <Heart size={16} /> Wishlist
                  </Link>
                  <button onClick={() => { onAuthAction(); setDropdownOpen(false); }} className="dropdown-item logout">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={onAuthAction}>
              <User size={20} />
              <span>Login</span>
            </button>
          )}

        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;