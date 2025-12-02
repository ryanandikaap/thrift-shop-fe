import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UploadCloud, Loader2 } from 'lucide-react';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'Pakaian',
    size: '',
    condition: 'Baik',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/products/${id}`);
          if (!response.ok) throw new Error('Produk tidak ditemukan');
          const data = await response.json();
          setProduct(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setIsUploading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal meng-upload gambar');

      setProduct(prev => ({ ...prev, image: data.image }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const url = isEditing ? `http://localhost:5000/api/products/${id}` : 'http://localhost:5000/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyimpan produk');
      }

      alert(`Produk berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}!`);
      navigate('/admin/products');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="container">
        <div className="page-header">
          <h2>{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Nama Produk</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Harga</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Deskripsi</label>
            <textarea name="description" value={product.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>URL Gambar</label>
            <div className="image-upload-wrapper">
              <input type="file" id="image-upload" onChange={handleImageUpload} accept="image/*" />
              <label htmlFor="image-upload" className="image-upload-label">
                {isUploading ? (
                  <Loader2 size={24} className="spinner" />
                ) : (
                  <UploadCloud size={24} />
                )}
                <span>{isUploading ? 'Mengupload...' : 'Pilih atau jatuhkan gambar'}</span>
              </label>
              {product.image && (
                <div className="image-preview">
                  <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt="Pratinjau Produk" />
                </div>
              )}
            </div>
            {/* Input tersembunyi untuk menyimpan path gambar */}
            <input type="hidden" name="image" value={product.image} required />
          </div>
          <div className="form-group">
            <label>Kategori</label>
            <select name="category" value={product.category} onChange={handleChange}>
              <option value="Pakaian">Pakaian</option>
              <option value="Sepatu">Sepatu</option>
              <option value="Aksesoris">Aksesoris</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ukuran</label>
            <input type="text" name="size" value={product.size} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Kondisi</label>
            <select name="condition" value={product.condition} onChange={handleChange}>
              <option value="Baru">Baru</option>
              <option value="Seperti Baru">Seperti Baru</option>
              <option value="Sangat Baik">Sangat Baik</option>
              <option value="Baik">Baik</option>
              <option value="Cukup">Cukup</option>
            </select>
          </div>
          <button type="submit" className="cta-btn" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Produk')}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminProductForm;