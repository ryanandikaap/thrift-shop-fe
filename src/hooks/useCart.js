import { useEffect, useState } from 'react';

const useCart = (user, onAuthAction, showNotification) => {
  const [cart, setCart] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const getCartKey = (currentUser) => {
    const userId =
      currentUser?._id ||
      currentUser?.id ||
      currentUser?.userId ||
      currentUser?.user_id;
    if (userId) return `cart_${userId}`;
    const authToken = localStorage.getItem('authToken');
    if (authToken) return `cart_token_${authToken.slice(-8)}`;
    return null;
  };

  useEffect(() => {
    const cartKey = getCartKey(user);
    if (!cartKey) {
      // Fallback for guest or missing user id
      try {
        const savedCart = localStorage.getItem('cart');
        setCart(savedCart ? JSON.parse(savedCart) : []);
      } catch (error) {
        console.error('Gagal memuat keranjang tamu:', error);
        setCart([]);
      }
      setIsHydrated(true);
      return;
    }
    try {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
        setIsHydrated(true);
        return;
      }
      // Migrate from legacy guest cart
      const guestCart = localStorage.getItem('cart');
      if (guestCart) {
        setCart(JSON.parse(guestCart));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Gagal memuat keranjang:', error);
      setCart([]);
    }
    setIsHydrated(true);
  }, [user]);

  useEffect(() => {
    if (!isHydrated) return;
    const cartKey = getCartKey(user);
    if (!cartKey) {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Gagal menyimpan keranjang tamu:', error);
      }
      return;
    }
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
      // Keep a backup for safety
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Gagal menyimpan keranjang:', error);
    }
  }, [cart, user, isHydrated]);

  const addToCart = (product) => {
    if (!user) {
      onAuthAction();
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

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
    showNotification('Item dihapus dari keranjang.', 'success');
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return { cart, addToCart, removeFromCart, updateCartQuantity };
};

export default useCart;
