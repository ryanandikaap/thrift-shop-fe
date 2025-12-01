import React from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const calculateDiscount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.isNew && <span className="new-badge">Baru</span>}
        <button 
          className={`favorite-btn ${product.isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart size={20} fill={product.isFavorite ? "currentColor" : "none"} />
        </button>
        <div className="discount-badge">
          -{calculateDiscount(product.price, product.originalPrice)}%
        </div>
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3>{product.name}</h3>
          <div className="price">
            <span className="current-price">Rp {product.price.toLocaleString('id-ID')}</span>
            <span className="original-price">Rp {product.originalPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-details">
          <span className="size">Ukuran: {product.size}</span>
          <span className="condition">Kondisi: {product.condition}</span>
        </div>
        <div className="product-footer">
          <div className="rating">
            <Star size={16} fill="currentColor" />
            <span>{product.rating}</span>
          </div>
          <button 
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingBag size={18} />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;