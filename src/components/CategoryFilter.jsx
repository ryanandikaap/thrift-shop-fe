import React from 'react';

// Data kategori sekarang didefinisikan di sini, bukan dari dummyData.js
const categories = ["Semua", "Pakaian", "Sepatu", "Aksesoris"];

const CategoryFilter = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="categories">
      {categories.map(category => (
        <button
          key={category}
          className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;