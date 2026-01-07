import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProductCard from '../../components/ProductCard';

const WishlistPage = ({ products, onAddToCart, onToggleFavorite, showNotification, user, onAuthAction }) => {
  const wishlistProducts = products.filter(p => p.isFavorite); 

  return (
    <main className="main-content">
      <div className="container">
        <div className="page-header">
          <h2>Wishlist Saya</h2>
          <p>Produk yang Anda simpan untuk nanti.</p>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="products-grid">
            {wishlistProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                showNotification={showNotification}
                user={user}
                onAuthAction={onAuthAction}
              />
            ))}
          </div>
        ) : (
          <div className="no-products-found">
            <Heart size={80} strokeWidth={1} />
            <h3>Wishlist Anda Kosong</h3>
            <p>Tambahkan produk ke favorit dengan menekan ikon hati, dan produk itu akan muncul di sini.</p>
            <Link to="/produk" className="cta-btn" style={{ marginTop: '20px' }}>
              Jelajahi Produk
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;