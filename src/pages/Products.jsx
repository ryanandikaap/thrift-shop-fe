import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // Pastikan path ini benar
import { Filter, XCircle } from 'lucide-react';
import '../styles/pages/Products.css';
const Products = ({ products, onAddToCart, onToggleFavorite, showNotification, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('kategori');

    let tempProducts = [...products];
 
    if (categoryParam) {
      const lowerCaseCategoryParam = categoryParam.toLowerCase();
      tempProducts = tempProducts.filter(product => 
        product.category && product.category.toLowerCase() === lowerCaseCategoryParam
      );
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('');
    }

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
        product.description.toLowerCase().includes(lowerCaseSearchQuery)
      );
    }

    switch (sortOption) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price); 
        break;
      case 'newest':
        tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(tempProducts);
    setCurrentPage(1);

  }, [location.search, products, searchQuery, sortOption]);

  const handleClearFilter = () => {
    navigate('/produk');
    setActiveCategory('');
  };
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  return (
    <main className="products-main">
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Produk Kami</h1>
            <p>Temukan berbagai pilihan produk thrift berkualitas tinggi yang siap memperbarui gaya Anda.</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="products-header">
          <div className="products-header-left">
            <h2>Semua Produk</h2>
            <p className="product-count">{filteredProducts.length} produk ditemukan</p>
          </div>
          <div className="products-header-right">
            <button className="filter-toggle-btn">
              <Filter size={20} />
              Filter
            </button>
            <div className="sort-dropdown">
              <select 
                className="sort-select" 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Urutkan Berdasarkan</option>
                <option value="price-asc">Harga: Termurah ke Termahal</option>
                <option value="price-desc">Harga: Termahal ke Termurah</option>
                <option value="newest">Terbaru</option>
              </select>
              <span className="sort-arrow">▼</span>
            </div>
          </div>
        </div>

        {activeCategory && (
          <div className="active-filters">
            <span className="active-filter">
              Kategori: {activeCategory}
              <button onClick={handleClearFilter} aria-label="Hapus filter kategori">
                <XCircle size={18} />
              </button>
            </span>
            <button className="clear-all-filters" onClick={handleClearFilter}>
              Hapus Semua Filter
            </button>
          </div>
        )}

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            currentProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onToggleFavorite={onToggleFavorite}
                showNotification={showNotification}
                user={user}
              />
            ))
          ) : (
            <div className="no-products-found">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h3>Oops! Produk tidak ditemukan</h3>
              <p>Coba gunakan kata kunci lain atau hapus filter yang sedang aktif.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
              Sebelumnya
            </button>
            <div className="pagination-numbers">
              {[...Array(totalPages).keys()].map(number => (
                <button key={number + 1} onClick={() => paginate(number + 1)} className={`pagination-number ${currentPage === number + 1 ? 'active' : ''}`}>
                  {number + 1}
                </button>
              ))}
            </div>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
              Berikutnya
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;