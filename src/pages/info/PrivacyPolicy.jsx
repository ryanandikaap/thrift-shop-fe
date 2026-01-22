import React from 'react';
import '../../styles/pages/InfoPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="info-page">
      <section className="page-hero info-page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Kebijakan Privasi</h1>
            <p>Kami menghargai privasi Anda dan berkomitmen untuk melindunginya.</p>
          </div>
        </div>
      </section>

      <main className="info-page-main">
        <div className="container info-page-content">
          <h2>Informasi yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan informasi pribadi dari Anda ketika Anda mendaftar di situs kami, melakukan pemesanan, atau mengisi formulir. Informasi yang dikumpulkan meliputi:
          </p>
          <ul>
            <li>Nama pengguna dan password (terenkripsi) saat registrasi.</li>
            <li>Nama, alamat email, alamat pengiriman, dan nomor telepon saat melakukan checkout.</li>
          </ul>

          <h2>Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p>
            Informasi yang kami kumpulkan dari Anda dapat digunakan untuk:
          </p>
          <ul>
            <li>Memproses transaksi dan mengirimkan pesanan Anda.</li>
            <li>Mempersonalisasi pengalaman Anda dan merespons kebutuhan individual Anda.</li>
            <li>Meningkatkan layanan pelanggan dan dukungan.</li>
            <li>Mengirim email berkala terkait status pesanan atau informasi lainnya.</li>
          </ul>

          <h2>Keamanan Data</h2>
          <p>
            Kami menerapkan berbagai langkah keamanan untuk menjaga keamanan informasi pribadi Anda. Kami menggunakan enkripsi untuk melindungi informasi sensitif yang dikirimkan secara online. Akses ke informasi pribadi Anda dibatasi hanya untuk karyawan yang membutuhkannya untuk melakukan pekerjaan tertentu (misalnya, layanan pelanggan).
          </p>

          <h2>Pengungkapan kepada Pihak Ketiga</h2>
          <p>
            Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada pihak luar. Ini tidak termasuk pihak ketiga tepercaya yang membantu kami dalam mengoperasikan situs web kami atau melayani Anda, selama pihak-pihak tersebut setuju untuk menjaga kerahasiaan informasi ini.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
