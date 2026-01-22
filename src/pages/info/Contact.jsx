import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import '../../styles/pages/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setError(data.message || 'Gagal mengirim pesan. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Terjadi kesalahan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
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
              
              {error && (
                <div className="alert alert-error" style={{
                  padding: '12px',
                  marginBottom: '20px',
                  backgroundColor: '#fee',
                  border: '1px solid #fcc',
                  borderRadius: '4px',
                  color: '#c33'
                }}>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" style={{
                  padding: '12px',
                  marginBottom: '20px',
                  backgroundColor: '#efe',
                  border: '1px solid #cfc',
                  borderRadius: '4px',
                  color: '#3c3'
                }}>
                  {success}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Nama Anda" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Alamat Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="email@anda.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subjek</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    placeholder="Subjek pesan Anda" 
                    value={formData.subject}
                    onChange={handleChange}
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Pesan</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="6" 
                    placeholder="Tulis pesan Anda di sini..." 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  ></textarea>
                </div>
                <button type="submit" className="cta-btn" disabled={loading}>
                  {loading ? 'Mengirim...' : 'Kirim Pesan'} <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
