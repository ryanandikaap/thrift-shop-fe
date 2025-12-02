import React from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

const Header = ({ 
  cart, 
  searchQuery, 
  setSearchQuery, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  scrolled 
}) => {
  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="logo">
            <ShoppingBag size={28} />
            <h1>Thrift<span>Style</span></h1>
          </div>
          
          <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><a href="#" className="active">Beranda</a></li>
              <li><a href="#">Produk</a></li>
              <li><a href="#">Kategori</a></li>
              <li><a href="#">Tentang Kami</a></li>
              <li><a href="#">Kontak</a></li>
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
              />
            </div>
            
            <button className="cart-btn">
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