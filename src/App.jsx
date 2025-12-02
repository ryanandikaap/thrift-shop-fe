import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import { dummyProducts } from './data/dummyData';
import './App.css';

function App() {
  const [products, setProducts] = useState(dummyProducts);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // Tambah state untuk scroll

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Fungsi untuk close mobile menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.nav') && !e.target.closest('.mobile-menu-btn')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    
    // Create a better notification (non-blocking)
    showNotification(`${product.name} ditambahkan ke keranjang!`, 'success');
  };

  const showNotification = (message, type) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#4A9C7D' : '#E76F51'};
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      z-index: 10000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s forwards;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 2.5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2500);
  };

  const handleToggleFavorite = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite } 
        : product
    ));
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      <Header 
        cart={cart}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrolled={scrolled} // Tambahkan prop scrolled
      />
      
      <Hero />
      
      <Features />
      
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h2>Produk Thrift Terbaru</h2>
            <p>Temukan barang-barang unik dengan kisah di baliknya</p>
          </div>

          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-content">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <h3>Produk tidak ditemukan</h3>
                <p>Coba cari dengan kata kunci lain atau pilih kategori berbeda</p>
                <button 
                  className="clear-filter-btn"
                  onClick={() => {
                    setSelectedCategory("Semua");
                    setSearchQuery("");
                  }}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>
      </main>

      <Footer />
      
      {/* Add notification animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default App;