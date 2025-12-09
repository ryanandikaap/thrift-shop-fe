import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/AboutUs'; 
import ProductDetail from './pages/ProductDetail'; 
import Contact from './pages/Contact'; 
import AdminProductList from './pages/admin/AdminProductList'; 
import AdminLayout from './pages/admin/AdminLayout'; 
import AdminProductForm from './pages/admin/AdminProductForm'; 
import AdminLoginPage from './pages/admin/AdminLoginPage'; 
import AdminDashboard from './pages/admin/AdminDashboard'; 
import AdminUserList from './pages/admin/AdminUserList'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import CheckoutPage from './pages/CheckoutPage'; 
import PaymentPage from './pages/PaymentPage'; 
import CartPage from './pages/CartPage'; 
import Category from './pages/Category';
import UserProfilePage from './pages/UserProfilePage'; 
import WishlistPage from './pages/WishlistPage'; 
import HowToShop from './pages/HowToShop'; 
import ReturnsPolicy from './pages/ReturnsPolicy'; 
import PrivacyPolicy from './pages/PrivacyPolicy'; 
import TermsAndConditions from './pages/TermsAndConditions'; 
import Footer from './components/Footer';
import AuthModal from './components/AuthModal'; 
import OrderHistory from './components/OrderHistory'; 
import ProfileEditor from './components/ProfileEditor'; 
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        const data = await response.json();
        const productsWithFavorite = data.map(p => ({ ...p, isFavorite: false }));
        setProducts(productsWithFavorite);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Try to fetch wishlist, but don't clear user if fails
        fetch('http://localhost:5000/api/users/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Token tidak valid');
          }
          return response.json();
        })
        .then(data => {
          syncWishlistWithProducts(data.wishlist || []);
        })
        .catch(error => {
          console.error("Token tidak valid:", error);
          // Don't clear user state, just log error
        });
      } catch (e) {
        console.error("Gagal parse data user:", e);
        // Don't clear user state
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncWishlistWithProducts = (wishlistProductIds) => {
    setProducts(prevProducts =>
      prevProducts.map(p => ({
        ...p,
        isFavorite: wishlistProductIds.includes(p._id),
      }))
    );
  };

  const fetchWishlist = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Gagal mengambil wishlist');
      }
      const wishlistData = await response.json();
      if (wishlistData.wishlist) {
        syncWishlistWithProducts(wishlistData.wishlist);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

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
    if (!user) {
      handleAuthAction();
      showNotification('Silakan login untuk menambahkan item ke keranjang.', 'warning');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }
    }); 
    showNotification(`${product.name} (x${product.quantity || 1}) ditambahkan ke keranjang!`, 'success');
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
    showNotification('Item dihapus dari keranjang.', 'success');
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      handleAuthAction();
      showNotification('Silakan login untuk menambahkan ke favorit.', 'warning');
      return;
    }

    const product = products.find(p => p._id === productId);
    const isCurrentlyFavorite = product?.isFavorite;

    setProducts(prevProducts => 
      prevProducts.map(product => 
        product._id === productId 
          ? { ...product, isFavorite: !product.isFavorite } 
          : product
      )
    );
    try {
      const token = localStorage.getItem('authToken');
      const method = isCurrentlyFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:5000/api/users/wishlist/${productId}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Gagal memperbarui wishlist');

      const data = await response.json();
      showNotification(data.message, 'success');

    } catch (error) {
      showNotification(error.message, 'warning');
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, isFavorite: isCurrentlyFavorite }
            : product
        )
      );
    }
  };

  const handleAuthAction = (showNotif = true, forceOpenModal = false) => {
    if (forceOpenModal) {
      setIsAuthModalOpen(true);
    } else if (!user) {
      setIsAuthModalOpen(true);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      syncWishlistWithProducts([]);
      if (showNotif) showNotification('Anda telah logout.', 'success');
    }
  };
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    fetchWishlist(token);
    handleCloseAuthModal();
    showNotification('Anda berhasil login!', 'success');
  };

  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const showNotification = useCallback((message, type) => {
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
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      animation: slideInAndOut 3.5s ease-in-out forwards;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3500);
  }, []);

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
          user={user}
          userRole={user?.role}
          onAuthAction={handleAuthAction}
        />
        
        <Routes>
          <Route path="/" element={
            <Home 
              products={products} 
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              showNotification={showNotification}
              user={user}
              onAuthAction={handleAuthAction}
            />
          } />
          <Route path="/produk" element={
            <Products 
              products={products} 
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              showNotification={showNotification}
              user={user}
              onAuthAction={handleAuthAction}
            />
            
          } />
          <Route path="/produk/:id" element={
            <ProductDetail
              products={products}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              showNotification={showNotification}
              user={user}
              onAuthAction={handleAuthAction}
            />
          } />
          <Route path="/kategori" element={<Category />} />
          <Route path="/tentang-kami" element={<AboutUs />} />
          <Route path="/kontak" element={<Contact />} />

          <Route path="/cara-berbelanja" element={<HowToShop />} /> <Route path="/kebijakan-pengembalian" element={<ReturnsPolicy />} />
          <Route path="/kebijakan-privasi" element={<PrivacyPolicy />} /> <Route path="/syarat-ketentuan" element={<TermsAndConditions />} />

          <Route 
            path="/keranjang"
            element={
              <CartPage
                cart={cart}
                onUpdateCartQuantity={handleUpdateCartQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                user={user}
                onAuthAction={handleAuthAction}
              />}
          />
          <Route 
            path="/wishlist"
            element={user ? 
              <WishlistPage
                products={products}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                showNotification={showNotification}
                user={user}
                onAuthAction={handleAuthAction}
              /> : <Navigate to="/" replace />}
          />

          <Route 
            path="/profil"
            element={user ?
              <UserProfilePage
                user={user}
                onUserUpdate={handleUserUpdate}
                showNotification={showNotification}
              /> : <Navigate to="/" replace />
            }
          />

          <Route
            path="/checkout/:id"
            element={user ?
              <CheckoutPage user={user} showNotification={showNotification} cart={cart} onAuthAction={handleAuthAction} /> :
              <Navigate to="/" replace />
            }
          />
          <Route
            path="/checkout/cart"
            element={user ?
              <CheckoutPage user={user} showNotification={showNotification} cart={cart} onAuthAction={handleAuthAction} /> :
              <Navigate to="/" replace />
            }
          />

          <Route  
            path="/payment/:orderId"
            element={user ?
              <PaymentPage showNotification={showNotification} /> :
              <Navigate to="/" replace />
            }
          />

          <Route  
            path="/admin/login" 
            element={<AdminLoginPage 
              onLoginSuccess={handleLoginSuccess}
              showNotification={showNotification}
            />} 
          />

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
            <Route path="users" element={<AdminUserList showNotification={showNotification} />} />
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
          @keyframes slideInAndOut {
            0% {
              transform: translateX(calc(100% + 20px));
              opacity: 0;
            }
            15%, 85% {
              transform: translateX(0);
              opacity: 1;
            }
            100% {
              transform: translateX(calc(100% + 20px));
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;