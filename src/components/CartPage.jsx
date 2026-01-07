import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage = ({ cart, onUpdateCartQuantity, onRemoveFromCart, user, onAuthAction }) => {
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); 
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      onAuthAction();
      return;
    }
    navigate('/checkout/cart');
  };

  if (cart.length === 0) {
    return (
      <main className="main-content">
        <div className="container">
          <div className="no-products-found" style={{ padding: '80px 20px' }}>
            <ShoppingBag size={80} strokeWidth={1} />
            <h3>Keranjang Belanja Anda Kosong</h3>
            <p>Sepertinya Anda belum menambahkan produk apa pun. Mari kita cari sesuatu yang menarik!</p>
            <Link to="/produk" className="cta-btn" style={{ marginTop: '20px' }}>
              <ArrowLeft size={18} /> Kembali Berbelanja
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="container">
        <div className="page-header">
          <h2>Keranjang Belanja</h2>
        </div>
        <div className="cart-grid">
          <div className="cart-items-list">
            {cart.map(item => (
              <div key={item._id} className="cart-item-card">
                <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <Link to={`/produk/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-price">Rp{item.price.toLocaleString('id-ID')}</p>
                  <div className="cart-item-meta">
                    <span>Ukuran: {item.size}</span> | <span>Kondisi: {item.condition}</span>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button onClick={() => onUpdateCartQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={16} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateCartQuantity(item._id, item.quantity + 1)}><Plus size={16} /></button>
                  </div>
                  <button onClick={() => onRemoveFromCart(item._id)} className="remove-item-btn">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="cart-item-total">
                  Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-card">
            <h3>Ringkasan Pesanan</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rp{subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-row">
              <span>Pengiriman</span>
              <span>{shippingCost > 0 ? `Rp${shippingCost.toLocaleString('id-ID')}` : 'Gratis'}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rp{total.toLocaleString('id-ID')}</span>
            </div>
            <button onClick={handleCheckout} className="cta-btn" style={{ width: '100%', marginTop: '20px' }}>
              Lanjutkan ke Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;