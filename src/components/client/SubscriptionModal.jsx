import React from 'react';
import { X, Crown, Zap, Calendar, History, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatNumber, formatDate } from '../../utils/formatters';

export default function SubscriptionModal({ user, onClose }) {
  if (!user) return null;

  const historyList = user.subscriptionHistory || [
    {
      planName: `Gói ${user.tier || 'PRO'} Khởi Tạo`,
      tier: user.tier || 'PRO',
      tokensGranted: user.tokens || 5000,
      price: '0 VNĐ',
      createdAt: user.createdAt || new Date(),
      status: 'Hoàn thành'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: '32px' }}
      >
        {/* Header Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={20} color="#c084fc" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Gói Đăng Ký & Lịch Sử</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Quản lý dịch vụ và lịch sử các gói tài khoản của bạn</p>
            </div>
          </div>
          <X size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={onClose} />
        </div>

        {/* 1. THẺ GÓI ĐANG SỬ DỤNG HIỆN TẠI */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.08) 100%), var(--bg-input)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              GÓI ĐANG SỬ DỤNG
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Gói {user.tier || 'PRO'} <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Đang hoạt động</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#c084fc" /> Số dư khả dụng: <b style={{ color: '#fff' }}>{formatNumber(user.tokens)} Tokens</b>
            </div>
          </div>

          <Link to="/pricing" className="btn-cta" style={{ fontSize: '12.5px', padding: '10px 16px' }} onClick={onClose}>
            Nâng Cấp <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* 2. LỊCH SỬ ĐĂNG KÝ VÀ SỬ DỤNG GÓI */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <History size={16} color="#8b5cf6" /> Lịch Sử Đăng Ký Gói ({historyList?.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
            {historyList.map((item, idx) => (
              <div 
                key={idx} 
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {item.planName}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {formatDate(item.createdAt)}
                    </span>
                    <span>•</span>
                    <span style={{ color: '#c084fc', fontWeight: 'bold' }}>+{formatNumber(item.tokensGranted)} Tokens</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>{item.price}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', marginTop: '2px' }}>
                    <CheckCircle size={11} color="#10b981" /> {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
