import { useState } from 'react';

const useCart = (user, onAuthAction, showNotification) => {
  const [cart, setCart] = useState([]);

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