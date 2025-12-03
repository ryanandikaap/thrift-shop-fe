import React, { useState } from 'react';
import OrderHistory from '../components/OrderHistory';
import ProfileEditor from '../components/ProfileEditor';
import { User, ShoppingBag } from 'lucide-react';

const UserProfilePage = ({ user, onUserUpdate, showNotification }) => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <main className="main-content">
      <div className="container">
        <div className="page-header">
          <h2>Profil Saya</h2>
          <p>Kelola informasi akun dan lihat riwayat pesanan Anda.</p>
        </div>

        <div className="profile-layout">
          <div className="profile-tabs">
            <button 
              className={`profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={20} />
              <span>Riwayat Pesanan</span>
            </button>
            <button 
              className={`profile-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              <User size={20} />
              <span>Edit Profil</span>
            </button>
          </div>

          <div className="profile-content">
            {activeTab === 'orders' && <OrderHistory showNotification={showNotification} />}
            {activeTab === 'edit' && <ProfileEditor user={user} onUserUpdate={onUserUpdate} showNotification={showNotification} />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;