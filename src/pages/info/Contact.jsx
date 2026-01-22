import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import '../../styles/pages/Contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Terima kasih! Pesan Anda telah terkirim (simulasi).');
    e.target.reset();
  };

  return (
    <div className="contact-page">
      <section className="page-hero contact-hero">
        <div className="container">
          <div className="page-hero-content">
            <h1>Hubungi Kami</h1>
            <p>Punya pertanyaan atau masukan? Kami siap membantu Anda.</p>
          </div>
        </div>
      </section>

      <main className="contact-main">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Informasi Kontak</h2>
              <p>Jangan ragu untuk menghubungi kami melalui detail di bawah ini. Tim kami akan merespons sesegera mungkin.</p>
              <ul>
                <li>
                  <MapPin size={24} />
                  <div>
                    <h4>Alamat</h4>
                    <p>Jl. Thrifting No. 123, Jakarta, Indonesia</p>
                  </div>
                </li>
                <li>
                  <Mail size={24} />
                  <div>
                    <h4>Email</h4>
                    <p>info@thriftstyle.com</p>
                  </div>
                </li>
                <li>
                  <Phone size={24} />
                  <div>
                    <h4>Telepon</h4>
                    <p>(021) 1234-5678</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="contact-form-wrapper">
              <h2>Kirim Pesan</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group"><label htmlFor="name">Nama Lengkap</label><input type="text" id="name" name="name" placeholder="Nama Anda" required /></div>
                <div className="form-group"><label htmlFor="email">Alamat Email</label><input type="email" id="email" name="email" placeholder="email@anda.com" required /></div>
                <div className="form-group"><label htmlFor="subject">Subjek</label><input type="text" id="subject" name="subject" placeholder="Subjek pesan Anda" required /></div>
                <div className="form-group"><label htmlFor="message">Pesan</label><textarea id="message" name="message" rows="6" placeholder="Tulis pesan Anda di sini..." required></textarea></div>
                <button type="submit" className="cta-btn">Kirim Pesan <Send size={18} /></button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
