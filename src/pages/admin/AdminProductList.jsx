import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error('Gagal mengambil data produk');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Gagal menghapus produk');
        }

        // Refresh daftar produk setelah berhasil menghapus
        fetchProducts();
        alert('Produk berhasil dihapus!');

      } catch (err) {
        setError(err.message);
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <main className="main-content">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Manajemen Produk</h2>
          <Link to="/admin/products/new" className="cta-btn">
            <Plus size={20} /> Tambah Produk
          </Link>
        </div>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama Produk</th>
                <th>Harga</th>
                <th>Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map(product => (
                <tr key={product._id}>
                  <td><img src={`http://localhost:5000${product.image}`} alt={product.name} width="60" style={{ borderRadius: '8px' }} /></td>
                  <td>{product.name}</td>
                  <td>Rp{product.price.toLocaleString('id-ID')}</td>
                  <td>{product.category}</td>
                  <td className="action-buttons">
                    <Link to={`/admin/products/edit/${product._id}`} className="edit-btn">
                      <Edit size={16} /> Edit
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="delete-btn">
                      <Trash2 size={16} /> Hapus
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Belum ada produk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminProductList;