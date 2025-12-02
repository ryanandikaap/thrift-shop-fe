import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

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
    reviews, 
    description, 
    size, 
    condition 
  } = product;

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        {isNew && <span className="new-badge">Baru</span>}
        {discount && <span className="discount-badge">-{discount}%</span>}
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`} 
          onClick={() => onToggleFavorite(id)}
          aria-label={isFavorite ? "Hapus dari favorit" : "Tambahkan ke favorit"}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
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
        <p className="product-description">
          {description.length > 100 ? description.substring(0, 100) + '...' : description}
        </p>
        <div className="product-details">
          {size && (
            <div className="size">
              <span>Ukuran</span>
              <span>{size}</span>
            </div>
          )}
          {condition && (
            <div className="condition">
              <span>Kondisi</span>
              <span>{condition}</span>
            </div>
          )}
        </div>
        <div className="product-footer">
          <div className="rating">
            <Star size={16} fill="currentColor" />
            <span>{rating} ({reviews})</span>
          </div>
          <button 
            className="add-to-cart-btn" 
            onClick={() => onAddToCart(product)}
            aria-label="Tambahkan ke keranjang"
          >
            <ShoppingCart size={18} />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;