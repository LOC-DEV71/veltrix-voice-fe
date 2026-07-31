import React, { useState, useEffect } from 'react';
import { Cookie, Check, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import { clientService } from '../../services/clientService';

export default function CookieConsentModal() {
  const [show, setShow] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái chấp nhận Cookie/Privacy Consent trong localStorage
    const consentData = localStorage.getItem('veltrix_ip_consent');
    if (!consentData) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(consentData);
        if (parsed.accepted === false) {
          setIsRejected(true);
        }
      } catch (e) {
        // Parse error
      }
    }
  }, []);

  const handleAccept = async () => {
    try {
      // Gọi API ngầm sang Backend để thiết lập Cookie an toàn user_ip
      const res = await clientService.consentIp();
      
      localStorage.setItem('veltrix_ip_consent', JSON.stringify({
        accepted: true,
        ip: res.data.ip,
        timestamp: new Date().toISOString()
      }));

      setShow(false);
      setIsRejected(false);
    } catch (err) {
      console.error("Lỗi xác thực:", err);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('veltrix_ip_consent', JSON.stringify({
      accepted: false,
      timestamp: new Date().toISOString()
    }));
    setShow(false);
    setIsRejected(true);
  };

  return (
    <>
      {/* 1. Modal Banner Tinh Tế & Chuyên Nghiệp */}
      {show && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          left: '24px',
          maxWidth: '520px',
          marginLeft: 'auto',
          zIndex: 3000,
          background: 'rgba(17, 20, 37, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '20px',
          padding: '20px 24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(139, 92, 246, 0.15)',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.18)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Cookie size={22} color="#c084fc" />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Chính Sách Quyền Riêng Tư & Cookie <ShieldCheck size={14} color="#06b6d4" />
                </h4>
                <X size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setShow(false)} />
              </div>

              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                Chúng tôi sử dụng Cookie và dữ liệu kỹ thuật hợp lệ nhằm tối ưu hóa trải nghiệm, duy trì an toàn hệ thống và nâng cao chất lượng dịch vụ Veltrix Voice.
              </p>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  className="btn-cta" 
                  onClick={handleAccept}
                  style={{ fontSize: '12.5px', padding: '8px 18px', borderRadius: '10px' }}
                >
                  <Check size={14} /> Chấp Nhận Tất Cả
                </button>
                <button 
                  className="btn-small" 
                  onClick={handleDecline}
                  style={{ fontSize: '12px', padding: '8px 14px' }}
                >
                  Từ Chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Badge Cảnh Báo Bật Lại Quyền Ngầm */}
      {isRejected && !show && (
        <div 
          onClick={() => setShow(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 2900,
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '8px 16px',
            borderRadius: '30px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <AlertTriangle size={14} /> Đã Từ Chối Cookie (Click để cài đặt lại)
        </div>
      )}
    </>
  );
}
