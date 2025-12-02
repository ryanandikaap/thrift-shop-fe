import React, { useState } from 'react';
import { Filter, Grid, List, ChevronDown, ChevronUp, X } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { 
  categories, 
  conditions, 
  sizes, 
  sortOptions 
} from '../data/dummyData';
import '../App.css';

const Products = ({ products, onAddToCart, onToggleFavorite }) => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedCondition, setSelectedCondition] = useState("Semua Kondisi");
  const [selectedSize, setSelectedSize] = useState("Semua Ukuran");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  // Filter produk
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
      const matchesCondition = selectedCondition === "Semua Kondisi" || product.condition === selectedCondition;
      const matchesSize = selectedSize === "Semua Ukuran" || product.size === selectedSize;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesCategory && matchesCondition && matchesSize && matchesPrice;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case "popular":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleClearFilters = () => {
    setSelectedCategory("Semua");
    setSelectedCondition("Semua Kondisi");
    setSelectedSize("Semua Ukuran");
    setSortBy("default");
    setPriceRange({ min: 0, max: 1000000 });
  };

  const calculateDiscount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleFavoriteClick = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(productId);
  };

  const handleAddToCartClick = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="products-page">
      {/* Hero Banner untuk Products Page */}
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Koleksi Thrift Lengkap</h1>
            <p>Temukan barang preloved berkualitas dengan harga terbaik. Setiap produk memiliki cerita uniknya sendiri.</p>
          </div>
        </div>
      </section>

      <main className="products-main">
        <div className="container">
          {/* Page Header dengan Filter Controls */}
          <div className="products-header">
            <div className="products-header-left">
              <h2>Semua Produk</h2>
              <p className="product-count">{filteredProducts.length} produk ditemukan</p>
            </div>
            
            <div className="products-header-right">
              {/* View Toggle */}
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={20} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List size={20} />
                </button>
              </div>

              {/* Sort Options */}
              <div className="sort-dropdown">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="sort-arrow" />
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                Filter
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="active-filters-container">
            <div className="active-filters">
              <div className="active-filters-left">
                {selectedCategory !== "Semua" && (
                  <span className="active-filter">
                    {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory("Semua")}
                      aria-label={`Remove ${selectedCategory} filter`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {selectedCondition !== "Semua Kondisi" && (
                  <span className="active-filter">
                    {selectedCondition}
                    <button 
                      onClick={() => setSelectedCondition("Semua Kondisi")}
                      aria-label={`Remove ${selectedCondition} filter`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {selectedSize !== "Semua Ukuran" && (
                  <span className="active-filter">
                    Ukuran: {selectedSize}
                    <button 
                      onClick={() => setSelectedSize("Semua Ukuran")}
                      aria-label={`Remove size ${selectedSize} filter`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {(priceRange.min > 0 || priceRange.max < 1000000) && (
                  <span className="active-filter">
                    Harga: Rp {priceRange.min.toLocaleString('id-ID')} - Rp {priceRange.max.toLocaleString('id-ID')}
                    <button 
                      onClick={() => setPriceRange({ min: 0, max: 1000000 })}
                      aria-label="Remove price filter"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
              
              {(selectedCategory !== "Semua" || selectedCondition !== "Semua Kondisi" || 
                selectedSize !== "Semua Ukuran" || priceRange.min > 0 || priceRange.max < 1000000) && (
                <button 
                  className="clear-all-filters"
                  onClick={handleClearFilters}
                >
                  Hapus Semua Filter
                </button>
              )}
            </div>
          </div>

          <div className="products-content">
            {/* Sidebar Filters */}
            <aside className={`products-sidebar ${showFilters ? 'show' : ''}`}>
              <div className="sidebar-header">
                <h3>Filter Produk</h3>
                <div className="sidebar-header-actions">
                  <button 
                    className="clear-filters-btn"
                    onClick={handleClearFilters}
                  >
                    Hapus Semua
                  </button>
                  <button 
                    className="close-filters-btn"
                    onClick={() => setShowFilters(false)}
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="filter-section">
                <h4>Kategori</h4>
                <div className="filter-categories">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`filter-category-btn ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                      <span className="category-count">
                        {category === "Semua" 
                          ? products.length 
                          : products.filter(p => p.category === category).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <h4>Range Harga</h4>
                <div className="price-range">
                  <div className="price-range-values">
                    <span>Rp {priceRange.min.toLocaleString('id-ID')}</span>
                    <span>Rp {priceRange.max.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="price-range-slider">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="price-slider min"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="price-slider max"
                    />
                    <div className="price-range-track">
                      <div 
                        className="price-range-selected"
                        style={{
                          left: `${(priceRange.min / 1000000) * 100}%`,
                          width: `${((priceRange.max - priceRange.min) / 1000000) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Condition Filter */}
              <div className="filter-section">
                <h4>Kondisi</h4>
                <div className="condition-filter">
                  {conditions.map(condition => (
                    <button
                      key={condition}
                      className={`condition-btn ${selectedCondition === condition ? 'active' : ''}`}
                      onClick={() => setSelectedCondition(condition)}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="filter-section">
                <h4>Ukuran</h4>
                <div className="size-filter">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button (Mobile) */}
              <button 
                className="apply-filters-btn"
                onClick={() => setShowFilters(false)}
              >
                Terapkan Filter
              </button>
            </aside>

            {/* Main Products Area */}
            <div className="products-main-area">
              {/* Products Display */}
              {filteredProducts.length === 0 ? (
                <div className="no-products-found">
                  <div className="no-products-content">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"/>
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    </svg>
                    <h3>Produk Tidak Ditemukan</h3>
                    <p>Tidak ada produk yang sesuai dengan filter yang Anda pilih.</p>
                    <button 
                      className="clear-filter-btn"
                      onClick={handleClearFilters}
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              ) : viewMode === "grid" ? (
                <ProductGrid 
                  products={filteredProducts}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                />
              ) : (
                <div className="products-list-view">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-list-item">
                      <div className="product-list-image">
                        <img src={product.image} alt={product.name} />
                        {product.isNew && <span className="new-badge">Baru</span>}
                        <div className="discount-badge">
                          -{calculateDiscount(product.price, product.originalPrice)}%
                        </div>
                      </div>
                      <div className="product-list-info">
                        <div className="product-list-header">
                          <h3>{product.name}</h3>
                          <div className="product-list-meta">
                            <span className="category-tag">{product.category}</span>
                            <span className="size-tag">Ukuran: {product.size}</span>
                            <span className="condition-tag">Kondisi: {product.condition}</span>
                          </div>
                        </div>
                        <p className="product-list-description">{product.description}</p>
                        <div className="product-list-footer">
                          <div className="price-rating">
                            <div className="price">
                              <span className="current-price">Rp {product.price.toLocaleString('id-ID')}</span>
                              <span className="original-price">Rp {product.originalPrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="rating">
                              ⭐ {product.rating}
                            </div>
                          </div>
                          <div className="product-list-actions">
                            <button 
                              className={`favorite-btn ${product.isFavorite ? 'active' : ''}`}
                              onClick={(e) => handleFavoriteClick(product.id, e)}
                              aria-label={product.isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                              {product.isFavorite ? '❤️' : '🤍'}
                            </button>
                            <button 
                              className="add-to-cart-btn"
                              onClick={(e) => handleAddToCartClick(product, e)}
                            >
                              + Keranjang
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination (optional) */}
              {filteredProducts.length > 8 && (
                <div className="pagination">
                  <button className="pagination-btn disabled">← Sebelumnya</button>
                  <div className="pagination-numbers">
                    <button className="pagination-number active">1</button>
                    <button className="pagination-number">2</button>
                    <button className="pagination-number">3</button>
                    <span className="pagination-dots">...</span>
                    <button className="pagination-number">5</button>
                  </div>
                  <button className="pagination-btn">Selanjutnya →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;