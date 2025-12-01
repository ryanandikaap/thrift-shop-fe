import React from 'react';
import { categories } from '../data/dummyData';

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