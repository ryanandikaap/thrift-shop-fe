import React, { useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import '../App.css';

const Home = ({ products, onAddToCart, onToggleFavorite }) => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter produk untuk homepage (hanya tampilkan 8 produk teratas)
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .slice(0, 8); // Batasi hanya 8 produk di homepage

  return (
    <>
      <Hero />
      
      <Features />
      
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h2>Produk Thrift Terbaru</h2>
            <p>Temukan barang-barang unik dengan kisah di baliknya</p>
          </div>

          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-content">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <h3>Produk tidak ditemukan</h3>
                <p>Coba cari dengan kata kunci lain atau pilih kategori berbeda</p>
                <button 
                  className="clear-filter-btn"
                  onClick={() => {
                    setSelectedCategory("Semua");
                    setSearchQuery("");
                  }}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
            />
          )}

          {/* CTA Section */}
          <div className="cta-section">
            <div className="cta-content">
              <h3>Ingin melihat lebih banyak produk?</h3>
              <p>Jelajahi koleksi lengkap kami dengan ratusan barang thrift berkualitas.</p>
              <a href="/produk" className="cta-btn secondary">
                Lihat Semua Produk →
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;