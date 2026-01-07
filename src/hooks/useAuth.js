import { useState, useEffect, useCallback } from 'react';

const useAuth = (showNotification, syncWishlistWithProducts) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const fetchWishlist = useCallback(async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengambil wishlist');
      const wishlistData = await response.json();
      if (wishlistData.wishlist) {
        syncWishlistWithProducts(wishlistData.wishlist);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [syncWishlistWithProducts]);

  const logout = useCallback((showNotif = true) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    syncWishlistWithProducts([]);
    if (showNotif) showNotification('Anda telah logout.', 'success');
  }, [showNotification, syncWishlistWithProducts]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        fetch('http://localhost:5000/api/users/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          if (!response.ok) throw new Error('Sesi tidak valid atau telah berakhir.');
          return response.json();
        })
        .then(data => {
          syncWishlistWithProducts(data.wishlist || []);
        })
        .catch(error => {
          console.error("Validasi sesi gagal:", error.message);
          logout(false);
        });
      } catch (e) {
        console.error("Gagal parse data user:", e);
        logout(false);
      }
    }
  }, [logout, syncWishlistWithProducts]);

  const login = useCallback((token, userData) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    fetchWishlist(token);
    setIsAuthModalOpen(false);
    showNotification('Anda berhasil login!', 'success');
  }, [fetchWishlist, showNotification]);

  const updateUser = useCallback((updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  }, []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return {
    user,
    isAuthModalOpen,
    login,
    logout,
    updateUser,
    openAuthModal,
    closeAuthModal,
  };
};

export default useAuth;