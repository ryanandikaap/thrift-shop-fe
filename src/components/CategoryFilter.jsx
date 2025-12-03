import React from 'react';

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