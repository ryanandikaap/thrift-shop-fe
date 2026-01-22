import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import Home from './pages/Home';
import Products from './pages/Products';
import AboutUs from './pages/info/AboutUs'; 
import ProductDetail from './pages/ProductDetail'; 
import Contact from './pages/info/Contact'; 
import AdminProductList from './pages/admin/AdminProductList'; 
import AdminLayout from './pages/admin/AdminLayout'; 
import AdminProductForm from './pages/admin/AdminProductForm'; 
import AdminLoginPage from './pages/admin/AdminLoginPage'; 
import AdminDashboard from './pages/admin/AdminDashboard'; 
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminUserList from './pages/admin/AdminUserList';
import AdminMessageList from './pages/admin/AdminMessageList';
import AdminMessageDetail from './pages/admin/AdminMessageDetail';
import ProtectedRoute from './components/ProtectedRoute'; 
import CheckoutPage from './pages/checkout/CheckoutPage'; 
import PaymentPage from './pages/checkout/PaymentPage'; 
import CartPage from './pages/checkout/CartPage'; 
import Category from './pages/info/Category';
import UserProfilePage from './pages/user/UserProfilePage'; 
import WishlistPage from './pages/user/WishlistPage'; 
import HowToShop from './pages/info/HowToShop'; 
import ReturnsPolicy from './pages/info/ReturnsPolicy'; 
import PrivacyPolicy from './pages/info/PrivacyPolicy'; 
import TermsAndConditions from './pages/info/TermsAndConditions'; 
import Footer from './components/Footer';
import AuthModal from './components/AuthModal'; 
import OrderHistory from './components/OrderHistory'; 
import ProfileEditor from './components/ProfileEditor'; 
import './App.css';

import useNotification from './hooks/useNotification';
import useCart from './hooks/useCart';
import useAuth from './hooks/useAuth';
function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const showNotification = useNotification();

  const syncWishlistWithProducts = useCallback((wishlistProductIds) => {
    setProducts(prevProducts =>
      prevProducts.map(p => ({
        ...p,
        isFavorite: wishlistProductIds.includes(p._id),
      }))
    );
  }, []);

  const { 
    user, 
    isAuthModalOpen, 
    login, 
    logout, 
    updateUser, 
    openAuthModal, 
    closeAuthModal 
  } = useAuth(showNotification, syncWishlistWithProducts);

  const handleAuthAction = useCallback((showNotif = true, forceOpenModal = false) => {
    if (forceOpenModal) {
      openAuthModal();
    } else if (!user) {
      openAuthModal();
    } else {
      logout(showNotif);
    }
  }, [user, openAuthModal, logout]);

  const { cart, addToCart, removeFromCart, updateCartQuantity } = useCart(user, handleAuthAction, showNotification);

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
              onAddToCart={addToCart}
              onToggleFavorite={handleToggleFavorite}
              showNotification={showNotification}
              user={user}
              onAuthAction={handleAuthAction}
            />
          } />
          <Route path="/produk" element={
            <Products 
              products={products} 
              onAddToCart={addToCart}
              onToggleFavorite={handleToggleFavorite}
              showNotification={showNotification}
              user={user}
              onAuthAction={handleAuthAction}
            />
            
          } />
          <Route path="/produk/:id" element={
            <ProductDetail
              products={products}
              onAddToCart={addToCart}
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
                onUpdateCartQuantity={updateCartQuantity}
                onRemoveFromCart={removeFromCart}
                user={user}
                onAuthAction={handleAuthAction}
              />}
          />
          <Route 
            path="/wishlist"
            element={user ? 
              <WishlistPage
                products={products}
                onAddToCart={addToCart}
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
                onUserUpdate={updateUser}
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
            path="/payment/:orderId"
            element={user ?
              <PaymentPage showNotification={showNotification} /> :
              <Navigate to="/" replace />
            }
          />

          <Route  
            path="/admin/login" 
            element={<AdminLoginPage 
              onLoginSuccess={login}
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
            <Route path="orders" element={<AdminOrderList showNotification={showNotification} />} />
            <Route path="orders/:id" element={<AdminOrderDetail showNotification={showNotification} />} />
            <Route path="messages" element={<AdminMessageList showNotification={showNotification} />} />
            <Route path="messages/:id" element={<AdminMessageDetail showNotification={showNotification} />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
          </Route>
        </Routes>

        <Footer />

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
          onLoginSuccess={login} 
          showNotification={showNotification}
        />
      </div>
    </Router>
  );
}

export default App;