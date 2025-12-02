import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onAddToCart, onToggleFavorite }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard 
          key={product._id} 
          product={product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default ProductGrid;