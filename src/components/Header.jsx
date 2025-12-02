import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, LogIn, LogOut, Tag } from 'lucide-react';

const Header = ({ 
  cart, 
  searchQuery, 
  setSearchQuery, 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  scrolled,
  isLoggedIn,
  onLoginToggle 
}) => {

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/produk", name: "Produk" },
    { path: "/kategori", name: "Kategori" },
    { path: "/tentang-kami", name: "Tentang Kami" },
    { path: "/kontak", name: "Kontak" },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <a href="/" className="logo">
            <Tag size={32} />
            <h1>Thrift<span>Style</span></h1>
          </a>

          <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
            <ul>
              {navLinks.map(link => (
                <li key={link.path}>
                  <NavLink to={link.path} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
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

            {isLoggedIn ? (
              <button className="login-btn" onClick={onLoginToggle} aria-label="Logout">
                <LogOut size={22} />
                <span>Logout</span>
              </button>
            ) : (
              <button className="login-btn" onClick={onLoginToggle} aria-label="Login">
                <LogIn size={22} />
                <span>Login</span>
              </button>
            )}

          </div>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;