import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Pastikan file ini ada atau buat baru
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs'; 
import ProductDetail from './pages/ProductDetail'; // Import halaman baru
import Contact from './pages/Contact'; // Import halaman baru
import AdminProductList from './pages/admin/AdminProductList'; // Import list produk admin
import AdminLayout from './pages/admin/AdminLayout'; // Import layout admin
import AdminProductForm from './pages/admin/AdminProductForm'; // Import form produk admin
import AdminDashboard from './pages/admin/AdminDashboard'; // Import dasbor admin
import ProtectedRoute from './components/ProtectedRoute'; // Import rute terproteksi
import Category from './pages/Category';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal'; // Import modal
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Inisialisasi dengan array kosong
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null); // Ganti isLoggedIn dengan state user
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State untuk modal

  // Cek token saat aplikasi pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        // Handle error jika JSON tidak valid
      }
    }
  }, []);

  // Mengambil data produk dari backend saat aplikasi dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        const data = await response.json();
        // Tambahkan properti isFavorite ke setiap produk jika belum ada
        const productsWithFavorite = data.map(p => ({ ...p, isFavorite: false }));
        setProducts(productsWithFavorite);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Di sini Anda bisa menampilkan notifikasi error kepada pengguna
      }
    };

    fetchProducts();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen dimuat

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
        product._id === productId 
          ? { ...product, isFavorite: !product.isFavorite } 
          : product
      )
    );
    
    // Tampilkan notifikasi berdasarkan status baru
    const product = products.find(p => p._id === productId);
    const isNowFavorite = !product?.isFavorite;
    showNotification(
      isNowFavorite 
        ? 'Ditambahkan ke favorit!' 
        : 'Dihapus dari favorit', 
      'success'
    );
  };

  // Fungsi untuk handle login/logout (simulasi)
  const handleAuthAction = () => {
    if (user) {
      // Jika sudah login, lakukan logout
      localStorage.removeItem('authToken'); // Hapus token dari storage
      localStorage.removeItem('user'); // Hapus data user dari storage
      setUser(null);
      showNotification('Anda telah logout.', 'success'); // Notifikasi logout tetap ada
    } else {
      // Jika belum login, buka modal
      setIsAuthModalOpen(true);
    }
  };
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData)); // Simpan data user
    setUser(userData); // Set state user
    handleCloseAuthModal(); // Tutup modal
    showNotification('Anda berhasil login!', 'success'); // Tampilkan notifikasi
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
          isLoggedIn={!!user} // Kirim boolean status login
          userRole={user?.role} // Kirim role user
          onAuthAction={handleAuthAction}
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
          <Route path="/produk/:id" element={
            <ProductDetail 
              products={products}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          } />
          <Route path="/kategori" element={<Category />} />
          <Route path="/tentang-kami" element={<AboutUs />} />
          <Route path="/kontak" element={<Contact />} />

          {/* Rute Admin yang Dilindungi */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductList />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
          </Route>
        </Routes>

        <Footer />

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={handleCloseAuthModal} 
          onLoginSuccess={handleLoginSuccess} 
          showNotification={showNotification}
        />
        
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