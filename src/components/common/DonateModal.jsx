import React, { useState, useEffect } from 'react';
import { X, Coffee, Heart, Copy, Check } from 'lucide-react';
import { clientService } from '../../services/clientService';

const POPULAR_BANKS = [
  { id: 'MB', name: 'MB Bank (Quân Đội)' },
  { id: 'VCB', name: 'Vietcombank' },
  { id: 'TCB', name: 'Techcombank' },
  { id: 'CTG', name: 'VietinBank' },
  { id: 'BIDV', name: 'BIDV' },
  { id: 'VPB', name: 'VPBank' },
  { id: 'TPB', name: 'TPBank' },
  { id: 'VBA', name: 'Agribank' },
  { id: 'ACB', name: 'ACB' },
  { id: 'STB', name: 'Sacombank' },
];

export default function DonateModal({ onClose }) {
  const [bankInfo, setBankInfo] = useState({
    donateBankId: 'MB',
    donateAccountNo: '0912572421202',
    donateAccountName: 'LÂM CHÍ LỘC'
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    clientService.getPublicSettings()
      .then(res => {
        if (res.data) {
          setBankInfo({
            donateBankId: res.data.donateBankId || 'MB',
            donateAccountNo: res.data.donateAccountNo || '0912572421202',
            donateAccountName: res.data.donateAccountName || 'LÂM CHÍ LỘC'
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy thông tin Donate:", err);
        setLoading(false);
      });
  }, []);

  // Sinh URL VietQR động theo chuẩn quốc gia VietQR.io từ MongoDB Database
  const vietQrUrl = `https://img.vietqr.io/image/${bankInfo.donateBankId}-${bankInfo.donateAccountNo}-compact2.png?accountName=${encodeURIComponent(bankInfo.donateAccountName)}&addInfo=${encodeURIComponent('Donate duy tri server')}`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentBankObj = POPULAR_BANKS.find(b => b.id === bankInfo.donateBankId) || { name: bankInfo.donateBankId };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '28px',
          maxWidth: '460px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%'
          }}
        >
          <X size={20} />
        </button>

        {/* Header Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.4)',
          color: '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <Coffee size={28} />
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>
          Mời Admin Ly Cà Phê ☕
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Ủng hộ tự nguyện duy trì Server cho anh em xài miễn phí!
        </p>

        {loading ? (
          <div style={{ padding: '40px', color: 'var(--text-secondary)' }}>Đang tải mã VietQR...</div>
        ) : (
          <>
            {/* MÃ VIETQR QUỐC GIA HIỂN THỊ ĐỘNG */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '12px', display: 'inline-block', marginBottom: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>
              <img 
                src={vietQrUrl} 
                alt="VietQR Donate" 
                style={{ width: '240px', height: 'auto', display: 'block', borderRadius: '8px' }} 
              />
            </div>

            {/* BANK INFO DETAILS */}
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '14px', textAlign: 'left', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{currentBankObj.name}</span>
                <button 
                  onClick={() => handleCopy(bankInfo.donateAccountNo)}
                  style={{ background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.15)', border: 'none', color: copied ? '#10b981' : '#c084fc', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {copied ? <><Check size={12} /> Đã chép</> : <><Copy size={12} /> Chép STK</>}
                </button>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                {bankInfo.donateAccountNo}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Chủ TK: <b>{bankInfo.donateAccountName}</b>
              </div>
            </div>
          </>
        )}

        {/* Humorous note */}
        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          ❤️ Anh em cứ xài thả ga không sao hết nhen. Chúc anh em tạo được nhiều nội dung triệu view! 🎉
        </p>

      </div>
    </div>
  );
}
