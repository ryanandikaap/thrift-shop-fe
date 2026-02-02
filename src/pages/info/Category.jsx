import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Footprints, Watch, ArrowRight } from 'lucide-react';
import '../../styles/pages/Category.css';

const categoryNames = ["Pakaian", "Sepatu", "Aksesoris"];

const categoryDetails = {
  'Pakaian': {
    icon: <Shirt size={36} />,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80',
  },
  'Sepatu': {
    icon: <Footprints size={36} />,
    image: 'https://images.unsplash.com/photo-1622760806364-5ccac8096b59?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  'Aksesoris': {
    icon: <Watch size={36} />,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80',
  }
};

const Category = ({ products = [] }) => {
  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      if (!product?.category) {
        return acc;
      }
      const key = product.category.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const categories = categoryNames.map(name => ({
    name: name,
    itemCount: categoryCounts[name.toLowerCase()] || 0,
    icon: categoryDetails[name]?.icon || <Shirt size={36} />,
    image: categoryDetails[name]?.image || '',
    path: `/produk?kategori=${name.toLowerCase()}`
  }));

  return (
    <main className="category-main">
      <div className="container">
        <div className="page-header">
          <h2>Jelajahi Kategori</h2>
          <p>Temukan item favorit Anda berdasarkan kategori yang telah kami siapkan.</p>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link 
              to={category.path} 
              key={index} 
              className="category-card image-card" 
              style={{ backgroundImage: `url(${category.image})` }}
            >
              <div className="card-overlay">
                <div className="category-icon-wrapper">
                  {category.icon}
                </div>
                <h3>{category.name}</h3>
                <p>
                  {category.itemCount} Items <ArrowRight size={16} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Category;
