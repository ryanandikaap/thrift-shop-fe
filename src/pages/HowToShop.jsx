import React from 'react';
import { Search, MousePointerClick, ShoppingCart, Truck } from 'lucide-react';

const HowToShop = () => {
  return (
    <div className="info-page">
      <section className="page-hero info-page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Cara Berbelanja</h1>
            <p>Ikuti langkah-langkah mudah ini untuk mendapatkan barang impian Anda.</p>
          </div>
        </div>
      </section>

      <main className="info-page-main">
        <div className="container info-page-content">
          <div className="step-by-step">
            <div className="step-item">
              <div className="step-icon">
                <Search size={40} />
              </div>
              <h3>1. Temukan Produk</h3>
              <p>Jelajahi koleksi kami melalui halaman 'Produk' atau gunakan fitur pencarian di bagian atas halaman untuk menemukan item spesifik yang Anda inginkan.</p>
            </div>

            <div className="step-item">
              <div className="step-icon">
                <MousePointerClick size={40} />
              </div>
              <h3>2. Pilih & Beli</h3>
              <p>Klik pada produk untuk melihat detail lengkapnya. Jika Anda sudah yakin, klik tombol 'Beli Sekarang' untuk melanjutkan ke proses checkout.</p>
            </div>

            <div className="step-item">
              <div className="step-icon">
                <ShoppingCart size={40} />
              </div>
              <h3>3. Checkout & Isi Data</h3>
              <p>Isi detail pengiriman Anda dengan lengkap dan benar. Pastikan semua informasi sudah sesuai sebelum melanjutkan ke langkah berikutnya.</p>
            </div>

            <div className="step-item">
              <div className="step-icon">
                <Truck size={40} />
              </div>
              <h3>4. Lakukan Pembayaran & Konfirmasi</h3>
              <p>Setelah membuat pesanan, Anda akan diarahkan ke halaman pembayaran. Lakukan transfer sesuai nominal dan unggah bukti pembayaran Anda. Pesanan Anda akan segera kami proses setelah konfirmasi!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowToShop;