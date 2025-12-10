import React, { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CheckoutPage = ({ user, showNotification, cart, onAuthAction }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCartCheckout = id === 'cart';
  const [itemsToCheckout, setItemsToCheckout] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    setLoading(true);
    if (isCartCheckout) {
      if (cart && cart.length > 0) {
        setItemsToCheckout(cart);
        setTotalAmount(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
      } else {
        setError('Keranjang Anda kosong.');
        showNotification('Tidak ada item di keranjang untuk di-checkout.', 'warning');
      }
      setLoading(false);
    } else {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/products/${id}`);
          if (!response.ok) throw new Error('Produk tidak ditemukan');
          const data = await response.json();
          setItemsToCheckout([{ ...data, quantity: 1 }]);
          setTotalAmount(data.price);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isCartCheckout, cart, showNotification]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');

      // Validate token before creating order
      const validationResponse = await fetch('http://localhost:5000/api/users/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!validationResponse.ok) {
        throw new Error('Token tidak valid');
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({          items: itemsToCheckout.map(item => ({
            product: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          totalAmount: totalAmount,
          customerDetails: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token invalid, open login modal
          onAuthAction(false, true);
          showNotification('Sesi login telah berakhir. Silakan login kembali.', 'warning');
          return;
        }
        throw new Error(data.message || 'Gagal membuat pesanan');
      }

      navigate(`/payment/${data.orderId}`);
    } catch (err) {
      showNotification(err.message, 'warning');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Memuat...</div>;
  if (error) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Error: {error}</div>;
  if (itemsToCheckout.length === 0) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Tidak ada item untuk di-checkout.</div>;

  return (
    <main className="main-content">
      <div className="container">
        <div className="page-header">
          <h2>Checkout</h2>
        </div>
        <div className="checkout-grid">
          <div className="checkout-form-wrapper">
            <h3>Detail Pengiriman</h3>
            <form onSubmit={handleCreateOrder} className="checkout-form">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Alamat Lengkap</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <button type="submit" className="cta-btn" disabled={loading}>
                {loading ? 'Memproses...' : `Buat Pesanan (Rp${totalAmount.toLocaleString('id-ID')})`}
              </button>
            </form>
          </div>
          <div className="checkout-summary-wrapper">
            <h3>Ringkasan Pesanan</h3>
            {itemsToCheckout.map(item => (
              <div key={item._id} className="product-summary-card">
                <img src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} alt={item.name} />
                <div className="summary-info">
                  <h4>{item.name} (x{item.quantity})</h4>
                  <p className="summary-price">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  <div className="summary-details">
                    <span>Ukuran: {item.size}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="total-summary">
              <span>Total</span>
              <span>Rp{totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(CheckoutPage);
