import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Pastikan file ini ada atau buat baru
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs'; 
import Contact from './pages/Contact'; // Import halaman baru
import Category from './pages/Category';
import Footer from './components/Footer';
import { dummyProducts } from './data/dummyData'; // Import data dummy
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(dummyProducts); // Tambah state products
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login

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
    showNotification(`${product.name} ditambahkan ke keranjang!`, 'success');
  };

  const handleToggleFavorite = (productId) => {
    // Update status favorite di state products
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, isFavorite: !product.isFavorite } 
          : product
      )
    );
    
    // Tampilkan notifikasi berdasarkan status baru
    const product = products.find(p => p.id === productId);
    const isNowFavorite = !product?.isFavorite;
    showNotification(
      isNowFavorite 
        ? 'Ditambahkan ke favorit!' 
        : 'Dihapus dari favorit', 
      'success'
    );
  };

  // Fungsi untuk handle login/logout (simulasi)
  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    showNotification(
      !isLoggedIn ? 'Anda berhasil login!' : 'Anda telah logout.',
      'success'
    );
  };

  const showNotification = (message, type) => {
    // Hapus notifikasi sebelumnya jika ada
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });

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
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2500);
  };

  return (
    <Router>
      <div className="app">
        <Header 
          cart={cart}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          scrolled={scrolled}
          isLoggedIn={isLoggedIn}
          onLoginToggle={handleLoginToggle}
        />
        
        <Routes>
          <Route path="/" element={
            <Home 
              products={products} // Kirim products ke Home
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          } />
          <Route path="/produk" element={
            <Products 
              products={products} // Kirim products ke Products
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
            
          } />
          <Route path="/kategori" element={<Category />} />
          <Route path="/tentang-kami" element={<AboutUs />} />
          <Route path="/kontak" element={<Contact />} />
        </Routes>

        <Footer />
        
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
    </Router>
  );
}

export default App;