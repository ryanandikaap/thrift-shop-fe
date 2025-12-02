import React from 'react';
import { Star, Heart, ShoppingCart, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const {
    id,
    name,
    price,
    originalPrice,
    discount,
    image,
    isNew,
    isFavorite,
    rating,
    description,
    size,
    condition,
  } = product;

  const handleBuyNow = (product) => {
    // Simulasi: langsung ke halaman checkout atau menampilkan ringkasan
    alert(`Simulasi: Anda membeli ${product.name} sekarang!`);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} loading="lazy" />
        {isNew && <span className="new-badge">Baru</span>}
        {discount && <span className="discount-badge">-{discount}%</span>}
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`} 
          onClick={() => onToggleFavorite(id)}
          aria-label="Toggle Favorite"
        >
          <Heart size={20} />
        </button>
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3>{name}</h3>
          <div className="price">
            <span className="current-price">Rp{price.toLocaleString('id-ID')}</span>
            {originalPrice && <span className="original-price">Rp{originalPrice.toLocaleString('id-ID')}</span>}
          </div>
        </div>
        <p className="product-description">{description}</p>
        <div className="product-details">
          <div className="size">
            <span>Ukuran</span>
            <strong>{size}</strong>
          </div>
          <div className="condition">
            <span>Kondisi</span>
            <strong>{condition}</strong>
          </div>
        </div>
        <div className="product-footer">
          <div className="rating">
            <Star size={18} />
            <span>{rating}</span>
          </div>
          <div className="product-actions">
            <button className="buy-now-btn" onClick={() => handleBuyNow(product)}>
              <ShoppingBag size={18} />
              <span>Beli</span>
            </button>
            <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
              <ShoppingCart size={18} />
              <span>Keranjang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;