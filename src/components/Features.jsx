import React from 'react';
import { Truck, Shield, RotateCcw } from 'lucide-react';

// Data fitur sekarang didefinisikan di sini, bukan dari dummyData.js
const features = [
  { title: 'Pengiriman Cepat & Aman', description: 'Kami memastikan produk sampai ke tangan Anda dengan cepat dan aman.', icon: 'Truck' },
  { title: 'Jaminan Kualitas', description: 'Setiap produk telah melalui proses kurasi dan pengecekan kualitas yang ketat.', icon: 'Shield' },
  { title: 'Pengembalian Mudah', description: 'Tidak puas? Kami menyediakan proses pengembalian yang mudah dan tanpa ribet.', icon: 'RotateCcw' },
];
 
const Features = () => {
  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'Truck': return <Truck size={32} />;
      case 'Shield': return <Shield size={32} />;
      case 'RotateCcw': return <RotateCcw size={32} />;
      default: return <Truck size={32} />;
    }
  };

  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {getIconComponent(feature.icon)}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;