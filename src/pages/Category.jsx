import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Footprints, Watch, ArrowRight } from 'lucide-react';

// Data kategori sekarang didefinisikan di sini, bukan dari dummyData.js
const categoryNames = ["Pakaian", "Sepatu", "Aksesoris"];

// Data visual untuk setiap kategori
const categoryDetails = {
  'Pakaian': {
    itemCount: 120,
    icon: <Shirt size={36} />,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80',
  },
  'Sepatu': {
    itemCount: 75,
    icon: <Footprints size={36} />,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80',
  },
  'Aksesoris': {
    itemCount: 90,
    icon: <Watch size={36} />,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80',
  }
};

// Gabungkan data dari dummyData dengan detail visual
// Filter "Semua" agar tidak ditampilkan di halaman kategori
const categories = categoryNames
  .filter(name => name !== "Semua")
  .map(name => ({
    name: name,
    itemCount: categoryDetails[name]?.itemCount || 0,
    icon: categoryDetails[name]?.icon || <Shirt size={36} />,
    image: categoryDetails[name]?.image || '',
    path: `/produk?kategori=${name.toLowerCase()}`
  }));

const Category = () => {
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