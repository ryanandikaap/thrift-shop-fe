import React from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ 
  cart, 
  searchQuery, 
  setSearchQuery, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  scrolled 
}) => {
  const location = useLocation();
  
  // Fungsi untuk mengecek apakah link aktif
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="logo">
            <ShoppingBag size={28} />
            <h1>Thrift<span>Style</span></h1>
          </Link>
          
          <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
            <ul>
              <li>
                <Link 
                  to="/" 
                  className={isActive('/') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link 
                  to="/produk" 
                  className={isActive('/produk') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Produk
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                  }}
                >
                  Kategori
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                  }}
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                  }}
                >
                  Kontak
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <div className="search-box">
              <Search size={20} />
              <input 
                type="text" 
                placeholder="Cari produk thrift..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
            </div>
            
            <button 
              className="cart-btn"
              aria-label={`Shopping cart with ${cart.length} items`}
            >
              <ShoppingBag size={22} />
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;