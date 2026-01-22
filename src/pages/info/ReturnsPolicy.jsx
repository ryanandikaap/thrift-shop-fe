import React from 'react';
import '../../styles/pages/InfoPages.css';

const ReturnsPolicy = () => {
  return (
    <div className="info-page">
      <section className="page-hero info-page-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Kebijakan Pengembalian</h1>
            <p>Kepuasan Anda adalah prioritas kami. Berikut adalah panduan untuk pengembalian produk.</p>
          </div>
        </div>
      </section>

      <main className="info-page-main">
        <div className="container info-page-content">
          <h2>Ketentuan Umum</h2>
          <p>
            Kami memahami bahwa terkadang produk yang Anda terima tidak sesuai harapan. Karena sifat produk kami yang merupakan barang bekas (thrift), kami memiliki kebijakan pengembalian yang spesifik. Harap baca dengan saksama.
          </p>

          <h3>Kondisi Pengembalian yang Diterima</h3>
          <ul>
            <li>Produk yang diterima tidak sesuai dengan deskripsi di halaman produk (misalnya, ukuran, warna, atau merek yang salah secara signifikan).</li>
            <li>Terdapat kerusakan atau cacat besar yang tidak disebutkan dalam deskripsi produk.</li>
            <li>Barang yang dikirim salah (bukan barang yang Anda pesan).</li>
          </ul>

          <h3>Kondisi Pengembalian yang Tidak Diterima</h3>
          <ul>
            <li>Perubahan pikiran (tidak jadi suka dengan modelnya).</li>
            <li>Ukuran tidak pas, padahal sudah sesuai dengan deskripsi. Kami sarankan untuk memperhatikan detail ukuran yang kami sediakan.</li>
            <li>Cacat minor yang merupakan karakteristik wajar dari barang bekas dan sudah diinformasikan.</li>
          </ul>

          <h2>Proses Pengembalian</h2>
          <p>
            Jika kondisi Anda memenuhi syarat untuk pengembalian, silakan ikuti langkah berikut:
          </p>
          <ol>
            <li>Hubungi layanan pelanggan kami melalui halaman <a href="/kontak">Kontak</a> maksimal 2x24 jam setelah barang diterima.</li>
            <li>Sertakan nomor pesanan, foto produk yang diterima, dan penjelasan detail mengenai alasan pengembalian.</li>
            <li>Tim kami akan meninjau permintaan Anda dalam 1-2 hari kerja.</li>
            <li>Jika disetujui, Anda akan menerima instruksi untuk mengirimkan kembali produk kepada kami. Biaya pengiriman kembali akan kami tanggung jika kesalahan ada di pihak kami.</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default ReturnsPolicy;
