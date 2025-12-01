import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <ShoppingBag size={24} />
              <h3>Thrift<span>Style</span></h3>
            </div>
            <p>Membawa gaya berkelanjutan ke dalam hidup Anda dengan pilihan barang thrift berkualitas.</p>
          </div>
          
          <div className="footer-section">
            <h4>Kategori</h4>
            <ul>
              <li><a href="#">Pakaian Pria</a></li>
              <li><a href="#">Pakaian Wanita</a></li>
              <li><a href="#">Aksesoris</a></li>
              <li><a href="#">Sepatu</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Bantuan</h4>
            <ul>
              <li><a href="#">Cara Berbelanja</a></li>
              <li><a href="#">Pengembalian</a></li>
              <li><a href="#">Kebijakan Privasi</a></li>
              <li><a href="#">Syarat & Ketentuan</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Kontak Kami</h4>
            <p>Jl. Thrifting No. 123, Jakarta</p>
            <p>Email: info@thriftstyle.com</p>
            <p>Telepon: (021) 1234-5678</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2023 ThriftStyle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;