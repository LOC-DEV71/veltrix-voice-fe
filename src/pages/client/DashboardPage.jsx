import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Zap, Crown, Music, Key, History, Plus, Copy, Check, Trash2, 
  User, ShieldCheck, ArrowUpRight, Calendar, Sparkles, CreditCard, Play, Download, Clock
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { formatNumber, formatDate } from '../../utils/formatters';

export default function DashboardPage() {
  const { clientUser } = useSelector((state) => state.auth);
  const { history } = useSelector((state) => state.tts);

  // Quản lý API Keys mẫu trong State / LocalStorage
  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem('veltrix_api_keys');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [copiedKeyId, setCopiedKeyId] = useState(null);

  const handleCreateApiKey = () => {
    const newKey = {
      id: Date.now(),
      name: `Default API Key #${apiKeys.length + 1}`,
      key: `sk_veltrix_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };
    const updated = [newKey, ...apiKeys];
    setApiKeys(updated);
    localStorage.setItem('veltrix_api_keys', JSON.stringify(updated));
  };

  const handleDeleteApiKey = (id) => {
    const updated = apiKeys.filter(k => k.id !== id);
    setApiKeys(updated);
    localStorage.setItem('veltrix_api_keys', JSON.stringify(updated));
  };

  const handleCopyKey = (keyString, id) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const displayName = clientUser ? (clientUser.name || clientUser.email.split('@')[0]) : 'Khách Hàng';
  const memberDate = clientUser?.createdAt ? formatDate(clientUser.createdAt) : 'Mới tham gia';

  const historyList = clientUser?.subscriptionHistory || [
    {
      planName: `Gói ${clientUser?.tier || 'PRO'} (2,000 Ký Tự/Ngày)`,
      tier: clientUser?.tier || 'PRO',
      tokensGranted: 2000,
      price: '0 VNĐ',
      createdAt: clientUser?.createdAt || new Date(),
      status: 'Hoàn thành'
    }
  ];

  const currentTokens = clientUser?.tokens !== undefined ? clientUser.tokens : 2000;
  const maxDaily = clientUser?.dailyTokenLimit || currentTokens || 2000;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', paddingBottom: '80px' }}>
      <Navbar />

      <main style={{ maxWidth: '1240px', margin: '32px auto 0', padding: '0 24px' }}>
        
        {/* 1. HEADER PROFILE USER */}
        <div className="dashboard-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '28px 36px',
          marginBottom: '32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--gradient-btn)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '800',
              color: '#fff',
              boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)'
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Dashboard {displayName} <ShieldCheck size={20} color="#06b6d4" />
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Hạn mức sử dụng hàng ngày: <b style={{ color: '#c084fc' }}>{formatNumber(maxDaily)} ký tự/ngày</b> (Làm mới tự động lúc 00:00)
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
              <User size={15} color="var(--primary-purple)" /> {clientUser?.email}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Thành viên từ <b style={{ color: '#fff' }}>{memberDate}</b>
            </div>
          </div>
        </div>

        {/* 2. TOP 3 METRIC CARDS OVERVIEW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          
          {/* Card 1: Token Còn Lại Hôm Nay */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '28px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="#c084fc" /> KÝ TỰ CÒN LẠI HÔM NAY
              </span>
              <span style={{ fontSize: '11px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                Hôm nay
              </span>
            </div>

            <div style={{ fontSize: '34px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {formatNumber(currentTokens)} <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>/ {formatNumber(maxDaily)} ký tự</span>
            </div>

            {/* Thanh Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'var(--bg-input)', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: `${Math.min(100, (currentTokens / maxDaily) * 100)}%`, height: '100%', background: 'var(--gradient-btn)', borderRadius: '10px' }} />
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} color="#06b6d4" /> Tự động làm mới 2,000 ký tự vào 00:00 hàng ngày
            </div>
          </div>

          {/* Card 2: Gói Hiện Tại */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.08) 0%, var(--bg-card) 100%)',
            border: '1px solid var(--primary-purple)',
            borderRadius: '20px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#c084fc', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Crown size={14} color="#c084fc" /> GÓI HIỆN TẠI
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                  Đang hoạt động
                </span>
              </div>

              <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
                Gói {clientUser?.tier || 'PRO'}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                <b>2,000 ký tự/ngày</b> • Reset lúc 00:00 • Truy cập full giọng đọc AI cao cấp
              </div>
            </div>

            <a href="/#pricing" className="btn-cta" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px' }}>
              Nâng cấp gói <ArrowUpRight size={16} />
            </a>
          </div>

          {/* Card 3: File Đã Tạo */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Music size={14} color="#06b6d4" /> FILE AUDIO ĐÃ TẠO
              </span>
              <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                Tổng cộng
              </span>
            </div>

            <div style={{ fontSize: '34px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {history.length} <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}>file</span>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Tổng lượt đã chuyển đổi văn bản thành giọng đọc MP3
            </div>

            <Link to="/studio" className="btn-small" style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '12.5px' }}>
              <Sparkles size={14} color="#c084fc" /> Tạo bài đọc mới trong Studio
            </Link>
          </div>

        </div>

        {/* 3. SECTION API KEYS (TÍCH HỢP DEVELOPER API) */}
        <section style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} color="var(--primary-purple)" /> Quản Lý API Keys (Developer Integration)
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Sử dụng API Key để tích hợp hệ thống giọng nói Veltrix Voice vào ứng dụng của bạn
              </p>
            </div>

            <button className="btn-cta" onClick={handleCreateApiKey} style={{ fontSize: '13px', padding: '8px 16px' }}>
              <Plus size={16} /> Tạo API Key Mới
            </button>
          </div>

          {apiKeys.length === 0 ? (
            <div style={{
              background: 'var(--bg-input)',
              border: '1px dashed var(--border-color)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <Key size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', fontWeight: '600' }}>Chưa có API Key nào được khởi tạo</p>
              <p style={{ fontSize: '12.5px', marginTop: '4px' }}>Bấm <b>Tạo API Key Mới</b> để bắt đầu kết nối API dịch vụ TTS.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {apiKeys.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                      <Key size={16} color="#c084fc" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {item.key}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      className="btn-small"
                      onClick={() => handleCopyKey(item.key, item.id)}
                      style={{ fontSize: '12px' }}
                    >
                      {copiedKeyId === item.id ? <><Check size={13} color="#10b981" /> Đã Copy</> : <><Copy size={13} /> Copy Key</>}
                    </button>
                    <button 
                      className="btn-small" 
                      onClick={() => handleDeleteApiKey(item.id)}
                      style={{ color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                    >
                      <Trash2 size={13} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. SECTION LỊCH SỬ THANH TOÁN (PAYMENT HISTORY TABLE) */}
        <section style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '32px'
        }}>
          <h2 style={{ fontSize: '19px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="#06b6d4" /> Lịch Sử Thanh Toán & Đăng Ký Gói
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>TÊN GÓI DỊCH VỤ</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>GIÁ TIỀN</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>HẠN MỨC CỘNG</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>NGÀY GIAO DỊCH</th>
                  <th style={{ padding: '12px 16px', fontWeight: '700' }}>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {historyList.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#fff' }}>{item.planName}</td>
                    <td style={{ padding: '16px', color: '#10b981', fontWeight: '700' }}>{item.price}</td>
                    <td style={{ padding: '16px', color: '#c084fc', fontWeight: 'bold' }}>+{formatNumber(item.tokensGranted)} Ký tự/ngày</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{formatDate(item.createdAt)}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
