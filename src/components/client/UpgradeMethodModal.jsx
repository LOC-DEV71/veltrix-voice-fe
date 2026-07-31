import React from 'react';
import { X, CreditCard, Video, Sparkles, Check, ArrowRight, Gift } from 'lucide-react';

export default function UpgradeMethodModal({ selectedPlan, onClose, onSelectPayment, onSelectTikTok }) {
  if (!selectedPlan) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '640px',
          width: '100%',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#c084fc',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            <Sparkles size={14} /> GÓI ĐÃ CHỌN: {selectedPlan.name} ({selectedPlan.code})
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Chọn phương thức nâng cấp
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Bạn có thể thanh toán trực tiếp hoặc tham gia chiến dịch TikTok Promotion để nhận gói FREE!
          </p>
        </div>

        {/* 2 Options Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          {/* Option 1: Payment */}
          <div 
            onClick={onSelectPayment}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px 20px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-purple)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <CreditCard size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Thanh toán tiền mặt
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Thanh toán qua Ngân hàng / VNPay / MoMo để nâng cấp tự động lập tức.
              </p>
            </div>
            
            <button className="btn-small" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
              Chọn thanh toán <ArrowRight size={14} />
            </button>
          </div>

          {/* Option 2: TikTok Promotion (FREE) */}
          <div 
            onClick={onSelectTikTok}
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
              border: '2px solid #ec4899',
              borderRadius: '16px',
              padding: '24px 20px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 8px 20px rgba(236, 72, 153, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(236, 72, 153, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(236, 72, 153, 0.15)';
            }}
          >
            {/* Free Tag */}
            <div style={{
              position: 'absolute',
              top: '-11px',
              right: '16px',
              background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 10px',
              borderRadius: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Gift size={10} style={{ display: 'inline', marginRight: '3px' }} /> 100% MIỄN PHÍ
            </div>

            <div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.2)',
                color: '#ec4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Video size={24} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
                Quảng bá nhận FREE
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Đăng bài/video quảng bá lên TikTok/MXH kèm hashtag để được kích hoạt gói miễn phí!
              </p>
            </div>

            <button className="btn-cta" style={{ marginTop: '20px', width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }}>
              Quảng bá nhận FREE <Gift size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
