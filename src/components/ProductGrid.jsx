import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onAddToCart, onToggleFavorite }) => {
  if (!products || products.length === 0) {
    return null; // Let App.js handle the no products state
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default ProductGrid;