import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, Clock } from 'lucide-react';

const PaymentPage = ({ showNotification }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Pesanan tidak ditemukan');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        showNotification(error.message, 'warning');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, showNotification]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validasi ukuran file (contoh: maks 2MB)
      const maxSizeInBytes = 2 * 1024 * 1024; 
      if (selectedFile.size > maxSizeInBytes) {
        showNotification('Ukuran file terlalu besar. Maksimal 2MB.', 'warning');
        e.target.value = null; // Reset input file
        setFile(null);
        return;
      }
    }
    setFile(selectedFile);
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!file) {
      showNotification('Silakan pilih file bukti pembayaran.', 'warning');
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append('paymentProof', file);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/upload-proof`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengunggah bukti pembayaran.');
        } else {
          throw new Error('Terjadi kesalahan pada server saat mengunggah bukti. Silakan coba lagi nanti.');
        }
      }

      showNotification('Bukti pembayaran berhasil diunggah!', 'success');
      navigate('/produk');

    } catch (error) {
      showNotification(error.message, 'warning');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Memuat detail pesanan...</div>;
  if (!order) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Pesanan tidak ditemukan.</div>;

  return (
    <main className="main-content">
      <div className="container payment-page">
        <div className="payment-header">
          <CheckCircle size={48} className="success-icon" />
          <h2>Pesanan Berhasil Dibuat!</h2>
          <p>Selesaikan pembayaran Anda untuk melanjutkan.</p>
        </div>

        <div className="payment-details">
          <h3>Detail Pembayaran</h3>
          <p><strong>Nomor Pesanan:</strong> {order.orderId}</p>
          <p className="total-amount"><strong>Total Pembayaran:</strong> Rp{order.totalAmount.toLocaleString('id-ID')}</p>
          <p>Silakan transfer ke salah satu rekening berikut:</p>
          <div className="bank-account">
            <p><strong>Bank BCA:</strong> 123-456-7890 (a/n Thrift Shop)</p>
            <p><strong>Bank Mandiri:</strong> 098-765-4321 (a/n Thrift Shop)</p>
          </div>
        </div>

        <div className="upload-proof-section">
          <h3>Unggah Bukti Pembayaran</h3>
          <p>Setelah melakukan transfer, silakan unggah bukti pembayaran Anda di sini.</p>
          <form onSubmit={handleUploadProof} className="upload-form">
            <label htmlFor="file-upload" className="file-upload-label">
              <UploadCloud size={20} />
              <span>{file ? file.name : 'Pilih file gambar...'}</span>
            </label>
            <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" />
            <button type="submit" className="cta-btn" disabled={uploading}>
              {uploading ? 'Mengunggah...' : 'Konfirmasi Pembayaran'}
            </button>
          </form>
        </div>

        <div className="payment-footer">
          <Clock size={16} />
          <span>Pesanan Anda akan diproses setelah pembayaran dikonfirmasi oleh admin.</span>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;