import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyProducts } from '../data/dummyData';
import { Star, Minus, Plus, ShoppingCart, ShoppingBag, Heart, ArrowLeft, CheckCircle, Shield, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = ({ onAddToCart, onToggleFavorite, products }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productId = parseInt(id, 10);
    // Gunakan 'products' dari props agar status 'isFavorite' selalu update
    const foundProduct = products.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Cari produk terkait (kategori sama, id berbeda)
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4); // Tampilkan hingga 4 produk terkait
      setRelatedProducts(related);
    }

    // Scroll ke atas saat halaman dimuat
    window.scrollTo(0, 0);

  }, [id, products]);

  if (!product) {
    return (
      <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Produk tidak ditemukan</h2>
        <p>Produk yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
        <Link to="/produk" className="cta-btn" style={{ marginTop: '20px' }}>
          <ArrowLeft size={18} /> Kembali ke Produk
        </Link>
      </main>
    );
  }

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleBuyNow = () => {
    alert(`Simulasi: Membeli ${quantity} x ${product.name}`);
  };

  const handleAddToCartWithQuantity = () => {
    // Simulasi menambahkan produk dengan kuantitas
    onAddToCart({ ...product, quantity });
  };

  return (
    <main className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/produk">Produk</Link> / <span>{product.name}</span>
        </div>
        <div className="detail-grid">
          <div className="detail-image-section">
            <img src={product.image} alt={product.name} className="main-image" />
            <button 
              className={`favorite-btn-detail ${product.isFavorite ? 'active' : ''}`} 
              onClick={() => onToggleFavorite(product.id)}
            >
              <Heart size={22} />
              {product.isFavorite ? 'Favorit' : 'Tambahkan ke Favorit'}
            </button>
          </div>

          <div className="detail-info-section">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-meta">
              <div className="meta-rating">
                <Star size={20} /> {product.rating} ({product.reviews} ulasan)
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
              <div className="spec-item"><span>Kategori:</span> <Link to={`/produk?kategori=${product.category.toLowerCase()}`}>{product.category}</Link></div>
              <div className="spec-item"><span>Ukuran:</span> <strong>{product.size}</strong></div>
            </div>

            <div className="actions-section">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)}><Minus size={18} /></button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}><Plus size={18} /></button>
              </div>
              <button className="buy-now-btn-detail" onClick={handleBuyNow}>
                <ShoppingBag size={20} /> Beli Sekarang
              </button>
              <button className="add-to-cart-btn-detail" onClick={handleAddToCartWithQuantity}>
                <ShoppingCart size={20} /> Tambah Keranjang
              </button>
            </div>

            <div className="guarantees">
              <div className="guarantee-item"><CheckCircle size={18} /> <span>Produk Terkurasi</span></div>
              <div className="guarantee-item"><Shield size={18} /> <span>Transaksi Aman</span></div>
              <div className="guarantee-item"><Truck size={18} /> <span>Pengiriman Cepat</span></div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Produk Terkait</h2>
            <div className="products-grid">
              {relatedProducts.map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  onAddToCart={onAddToCart} 
                  onToggleFavorite={onToggleFavorite} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;