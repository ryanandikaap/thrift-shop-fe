import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <ShoppingBag size={24} />
              <h3>ThriftStyle</h3>
            </div>
            <p>Membawa gaya berkelanjutan ke dalam hidup Anda dengan pilihan barang thrift berkualitas.</p>
          </div>
          
          <div className="footer-section">
            <h4>Kategori</h4>
            <ul>
              <li><Link to="/produk?kategori=pakaian">Pakaian</Link></li>
              <li><Link to="/produk?kategori=sepatu">Sepatu</Link></li>
              <li><Link to="/produk?kategori=aksesoris">Aksesoris</Link></li>
              <li><Link to="/produk">Semua Produk</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Bantuan</h4>
            <ul>
              <li><Link to="/cara-berbelanja">Cara Berbelanja</Link></li>
              <li><Link to="/kebijakan-pengembalian">Pengembalian</Link></li>
              <li><Link to="/kebijakan-privasi">Kebijakan Privasi</Link></li>
              <li><Link to="/syarat-ketentuan">Syarat & Ketentuan</Link></li>
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
          <p>&copy; {new Date().getFullYear()} ThriftStyle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;