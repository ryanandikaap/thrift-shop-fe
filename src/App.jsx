import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import { dummyProducts } from './data/dummyData';
import './App.css';

function App() {
  const [products, setProducts] = useState(dummyProducts);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} telah ditambahkan ke keranjang!`);
  };

  const handleToggleFavorite = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite } 
        : product
    ));
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      <Header 
        cart={cart}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
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

          <ProductGrid 
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;