import React from 'react';
import { Star, Heart, ShoppingCart, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components/ProductCard.css';

const ProductCard = ({ product, onAddToCart, onToggleFavorite, showNotification, user, onAuthAction }) => {
  const {
    _id, 
    name,
    price,
    originalPrice,
    discount,
    image,
    isNewArrival,
    isFavorite,
    rating,
    description,
    size,
    condition,
  } = product;

  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.preventDefault();
    navigate(`/produk/${_id}`);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleFavoriteClick = () => {
    onToggleFavorite(_id);
  };

  return (
    <div className="product-card-wrapper">
      <div className="product-card">
        <Link to={`/produk/${_id}`} className="product-card-link">
          <div className="product-image">
            <img src={image.startsWith('http') ? image : `http://localhost:5000${image}`} alt={name} loading="lazy" />
            {isNewArrival && <span className="new-badge">Baru</span>}
            {discount && <span className="discount-badge">-{discount}%</span>}
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
          </div>
        </Link>
        <div className="product-footer">
          <div className="rating">
            <Star size={18} />
            <span>{rating}</span>
          </div>
          <div className="product-actions">
            <button onClick={handleBuyNow} className="buy-now-btn" aria-label={`Beli ${name}`}>
              <ShoppingBag size={18} />
              <span>Beli</span>
            </button>
            <button className="add-to-cart-btn" onClick={handleAddToCart} aria-label={`Tambah ${name} ke keranjang`}>
              <ShoppingCart size={18} />
              <span>Keranjang</span>
            </button>
          </div>
        </div>
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`} 
          onClick={handleFavoriteClick}
          aria-label="Toggle Favorite"
        >
          <Heart size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
