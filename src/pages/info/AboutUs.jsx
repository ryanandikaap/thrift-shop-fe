import React from 'react';
import { Leaf, Award, Users, Truck, Shield, RotateCcw } from 'lucide-react';
import '../../styles/pages/AboutUs.css';

const features = [
  { title: 'Pengiriman Cepat & Aman', description: 'Kami memastikan produk sampai ke tangan Anda dengan cepat dan aman.', icon: 'Truck' },
  { title: 'Jaminan Kualitas', description: 'Setiap produk telah melalui proses kurasi dan pengecekan kualitas yang ketat.', icon: 'Shield' },
  { title: 'Pengembalian Mudah', description: 'Tidak puas? Kami menyediakan proses pengembalian yang mudah dan tanpa ribet.', icon: 'RotateCcw' },
];

const getIconComponent = (iconName) => {
  switch(iconName) {
    case 'Truck': return <Truck size={32} />;
    case 'Shield': return <Shield size={32} />;
    case 'RotateCcw': return <RotateCcw size={32} />;
    case 'Leaf': return <Leaf size={32} />;
    default: return <Truck size={32} />;
  }
};

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <section className="page-hero about-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Tentang <span className="text-gradient-light">ThriftStyle</span></h1>
            <p>Misi kami adalah membawa gaya unik dan berkelanjutan melalui pakaian preloved berkualitas tinggi.</p>
          </div>
        </div>
      </section>

      <main className="about-main">
        <div className="container">
          <div className="section-block mission-vision">
            <div className="text-content">
              <h2>Menciptakan Mode yang Berkelanjutan</h2>
              <p>ThriftStyle lahir dari kecintaan pada fesyen yang unik dan kesadaran akan dampak industri pakaian terhadap lingkungan. Kami percaya bahwa setiap pakaian pantas mendapatkan kesempatan kedua.</p>
              
              <div className="mission-points">
                <div className="point-card">
                  <div className="point-card-icon icon-green"><Leaf size={28} /></div>
                  <h4>Keberlanjutan (Sustainability)</h4>
                  <p>Mengurangi limbah tekstil dengan memperpanjang siklus hidup pakaian.</p>
                </div>
                <div className="point-card">
                  <div className="point-card-icon icon-gold"><Award size={28} /></div>
                  <h4>Kualitas & Kurasi</h4>
                  <p>Memastikan setiap barang memiliki kualitas terbaik melalui proses kurasi yang ketat.</p>
                </div>
                <div className="point-card">
                  <div className="point-card-icon icon-blue"><Users size={28} /></div>
                  <h4>Komunitas Gaya</h4>
                  <p>Membangun komunitas pecinta mode yang menghargai keunikan dan nilai dari barang bekas.</p>
                </div>
              </div>
            </div>
            <div className="image-placeholder about-image-1">
                
            </div>
          </div>
          
          <hr />
          <div className="section-block reverse-layout">
            <div className="image-placeholder about-image-2">
                
            </div>
            <div className="text-content">
              <h2>Proses Kurasi Kami</h2>
              <p>Kami tidak hanya menjual pakaian, kami menawarkan barang-barang dengan cerita. Proses 4 langkah kami menjamin Anda mendapatkan yang terbaik:</p>
              <ul>
                <li>**Sumber:** Kami mencari barang-barang preloved dengan potensi gaya dan kualitas.</li>
                <li>**Inspeksi:** Setiap produk diinspeksi secara ketat untuk cacat, kerusakan, dan keaslian.</li>
                <li>**Pembersihan:** Semua produk dibersihkan dan disanitasi sebelum difoto.</li>
                <li>**Penghargaan:** Kami memberikan harga yang adil berdasarkan kondisi dan keunikan barang.</li>
              </ul>
            </div>
          </div>
          
          <hr />
          <div className="section-block text-center" style={{ gridTemplateColumns: '1fr' }}>
            <h2>Nilai-Nilai Kami</h2>
            <p className="subtitle">Kami menjamin pengalaman berbelanja yang aman dan memuaskan.</p>
            <div className="features-grid" style={{ marginTop: '40px' }}>
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  {getIconComponent(feature.icon)}
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
