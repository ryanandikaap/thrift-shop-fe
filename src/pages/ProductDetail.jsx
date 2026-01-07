import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, ShoppingBag, Heart, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import '../styles/pages/ProductDetail.css';

const ProductDetail = ({ products, onAddToCart, onToggleFavorite, showNotification, user, onAuthAction }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Produk tidak ditemukan');
        }
        const productData = await response.json();
        setProduct(productData);
        
        const related = products 
          .filter(p => p.category === productData.category && p._id !== productData._id)
          .slice(0, 4);
        setRelatedProducts(related);
        
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, products]);

  const handleBuyNow = async () => {
    console.log('Status User:', user);
    const token = localStorage.getItem('authToken');
    if (!user || !token) {
      onAuthAction();
      return;
    }

    // Validate token before proceeding
    try {
      const response = await fetch('http://localhost:5000/api/users/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Token tidak valid');
      }
      navigate(`/checkout/${id}`);
    } catch (error) {
      console.error("Token tidak valid:", error);
      onAuthAction(false, true); // Open login modal without logging out
      showNotification('Sesi login telah berakhir. Silakan login kembali.', 'warning');
    }
  };

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartWithQuantity = () => {
    onAddToCart({ ...product, quantity });
    showNotification(`${product.name} (x${quantity}) ditambahkan ke keranjang.`, 'success');
  };

  const handleFavoriteClick = () => {
    onToggleFavorite(product._id);
  };

  if (loading) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Memuat detail produk...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Produk tidak ditemukan</h2>
        <p>Produk yang Anda cari mungkin sudah tidak tersedia.</p>
        <Link to="/produk" className="cta-btn" style={{ marginTop: '20px' }}>
          <ArrowLeft size={18} /> Kembali ke Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/produk" className="breadcrumb">
          <ArrowLeft size={16} /> Kembali ke Produk
        </Link>
        <div className="detail-grid">
          <div className="detail-image-section">
            <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} className="main-image" />
            <button
              className={`favorite-btn-detail ${product.isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
            >
              <Heart size={20} /> {product.isFavorite ? 'Favorit' : 'Tambahkan ke Favorit'}
            </button>
          </div>

          <div className="detail-info-section">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-meta">
              <div className="meta-rating">
                <Star size={16} /> {product.rating} ({product.reviews} ulasan)
              </div>
              <span className="meta-divider">|</span>
              <div className="meta-condition">Kondisi: <strong>{product.condition}</strong></div>
            </div>

            <div className="price-section">
              <span className="current-price">Rp{product.price.toLocaleString('id-ID')}</span>
              {product.originalPrice && (
                <span className="original-price">Rp{product.originalPrice.toLocaleString('id-ID')}</span>
              )}
              {product.discount && <span className="discount-tag">-{product.discount}%</span>}
            </div>

            <p className="product-description-detail">{product.description}</p>

            <div className="product-specs">
              <div className="spec-item"><span>Kategori:</span> <Link to={`/produk?kategori=${product.category}`}>{product.category}</Link></div>
              <div className="spec-item"><span>Ukuran:</span> <strong>{product.size}</strong></div>
            </div>

            <div className="actions-section">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)}><Minus size={18} /></button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}><Plus size={18} /></button>
              </div>
              <button className="add-to-cart-btn-detail" onClick={handleAddToCartWithQuantity}>
                <ShoppingCart size={20} /> Tambah Keranjang
              </button>
              <button className="buy-now-btn-detail" onClick={handleBuyNow}>
                <ShoppingBag size={20} /> Beli Sekarang
              </button>
            </div>

            <div className="guarantees">
              <div className="guarantee-item"><Shield size={18} /> Jaminan Kualitas</div>
              <div className="guarantee-item"><Truck size={18} /> Pengiriman Aman</div>
              <div className="guarantee-item"><RotateCcw size={18} /> Pengembalian Mudah</div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Produk Terkait</h2>
            <div className="products-grid">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                  showNotification={showNotification}
                  user={user}
                  onAuthAction={onAuthAction}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;