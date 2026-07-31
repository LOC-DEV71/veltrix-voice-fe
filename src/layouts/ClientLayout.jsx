import React from 'react';
import Navbar from '../components/common/Navbar';
import CookieConsentModal from '../components/common/CookieConsentModal';

export default function ClientLayout({ children }) {
  return (
    <div className="client-layout">
      <Navbar />
      <main className="client-main">
        {children}
      </main>
      {/* Banner Hỏi Quyền Thu Thập IP & Thiết Bị Chống Gian Lận Token */}
      <CookieConsentModal />
    </div>
  );
}
