import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Zap, Crown, Music, Key, History, Plus, Copy, Check, Trash2, 
  User, ShieldCheck, ArrowUpRight, Calendar, Sparkles, CreditCard, Play, Download, Clock, Code, ExternalLink, Globe
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { formatNumber, formatDate } from '../../utils/formatters';
import { clientService } from '../../services/clientService';
import Swal from 'sweetalert2';

export default function DashboardPage() {
  const { clientUser } = useSelector((state) => state.auth);
  const { history } = useSelector((state) => state.tts);

  const [apiKeys, setApiKeys] = useState([]);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [activeTabCode, setActiveTabCode] = useState('cdn');
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(false);

  const fetchApiKeys = async () => {
    try {
      const res = await clientService.getApiKeys();
      setApiKeys(res.data?.apiKeys || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleEditDomains = async (item) => {
    const currentDomainsStr = item.allowedDomains?.join(', ') || '';
    const { value: domainsStr } = await Swal.fire({
      title: '🛡️ Cấu Hình Tên Miền Bảo Mật',
      html: `
        <div style="font-size: 13px; text-align: left; color: #94a3b8; margin-bottom: 12px; line-height: 1.5;">
          Chỉ các Tên Miền (Domain) có tên trong danh sách bên dưới mới được phép sử dụng API Key này. Kẻ xấu copy Key của bạn sang web khác sẽ bị hệ thống chặn ngay lập tức.
          <br/><br/>
          <i>Ví dụ: <b>mycompany.com, blog.mycompany.vn</b> (Phân cách bằng dấu phẩy, để trống nếu muốn cho phép tất cả tên miền).</i>
        </div>
      `,
      input: 'text',
      inputValue: currentDomainsStr,
      inputPlaceholder: 'mysite.com, blogspot.com (hoặc để trống)...',
      showCancelButton: true,
      confirmButtonText: 'Lưu Cấu Hình 🛡️',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#06b6d4'
    });

    if (domainsStr === undefined) return;

    try {
      await clientService.updateApiKey(item._id || item.id, { allowedDomains: domainsStr });
      fetchApiKeys();
      Swal.fire({
        icon: 'success',
        title: 'Đã cập nhật Tên miền Bảo mật!',
        text: domainsStr ? `API Key này chỉ hoạt động trên: ${domainsStr}` : 'API Key cho phép chạy trên tất cả tên miền (*).',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi cập nhật tên miền',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    }
  };

  const handleCreateApiKey = async () => {
    const { value: name } = await Swal.fire({
      title: 'Tạo API Key Mới',
      input: 'text',
      inputPlaceholder: 'Tên ứng dụng / website (Ví dụ: WordPress Blog, Localhost App)...',
      showCancelButton: true,
      confirmButtonText: 'Tạo Key 🔑',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#8b5cf6'
    });

    if (name === undefined) return;

    try {
      const res = await clientService.createApiKey({ name });
      fetchApiKeys();
      Swal.fire({
        icon: 'success',
        title: 'Tạo API Key thành công!',
        html: `API Key của bạn:<br/><code style="color: #c084fc; font-weight: bold; font-size: 14px;">${res.data?.apiKey?.key}</code>`,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tạo API Key',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    }
  };

  const handleDeleteApiKey = async (id) => {
    const res = await Swal.fire({
      title: 'Xóa API Key này?',
      text: 'Các ứng dụng đang dùng Key này sẽ không thể gọi API giọng đọc nữa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa 🗑️',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)'
    });

    if (!res.isConfirmed) return;

    try {
      await clientService.deleteApiKey(id);
      fetchApiKeys();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi xóa API Key',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    }
  };

  const handleCopyKey = (keyString, id) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const activeKeyString = apiKeys.length > 0 ? apiKeys[0].key : 'vk_live_YOUR_API_KEY';
  const siteDomain = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'https://veltrix-voice-be-production.up.railway.app';

  const cdnCodeSnippet = `<!-- 🎙️ Tích hợp Veltrix Voice TTS Tool Widget -->
<script 
  src="${siteDomain}/sdk/v1/veltrix-tts.js" 
  data-apikey="${activeKeyString}" 
  data-target="#my-content-editor">
</script>`;

  const jsInitSnippet = `// ⚡ Khởi tạo Veltrix Voice TTS Tool Widget qua JavaScript
VeltrixTTS.init({
  apiKey: '${activeKeyString}',
  target: '#my-content-editor'
});`;

  const restApiSnippet = `// 🌐 Gọi REST API Trực Tiếp Từ Mọi Ứng Dụng (Localhost & Server)
fetch('${siteDomain}/api/sdk/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '${activeKeyString}'
  },
  body: JSON.stringify({
    text: 'Xin chào! Đây là trải nghiệm giọng đọc Veltrix Voice.',
    voiceId: 'vi-VN-HoaiMyNeural',
    title: 'Tài liệu tích hợp'
  })
})
.then(res => res.json())
.then(data => console.log('Audio URL:', data.audioUrl));`;

  const handleCopyCodeSnippet = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeSnippet(true);
    setTimeout(() => setCopiedCodeSnippet(false), 2000);
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 1. THẺ THÔNG TIN TÀI KHOẢN HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Xin chào, {displayName}!</h1>
              <span style={{ 
                background: 'rgba(168, 85, 247, 0.2)', 
                color: '#c084fc', 
                border: '1px solid #a855f7',
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Crown size={14} /> Gói {clientUser?.tier || 'PRO'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
              Tài khoản dịch vụ Giọng nói Trí tuệ Nhân tạo Veltrix Voice • {clientUser?.email}
            </p>
          </div>

          <Link to="/pricing" className="btn-cta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} /> Nâng Cấp Gói Veltrix <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* 2. THỐNG KÊ TOKEN & TIỆN ÍCH */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Hạn Mức Ký Tự / Ngày</span>
              <Zap size={18} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              {formatNumber(currentTokens)} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ {formatNumber(maxDaily)} Ký tự</span>
            </div>
            <div style={{ background: 'var(--bg-input)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (currentTokens / maxDaily) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span>Tổng Bài Đọc Đã Tạo</span>
              <Music size={18} color="#c084fc" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
              {history?.length || 0} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Audio MP3</span>
            </div>
            <Link to="/studio" style={{ fontSize: '13px', color: '#06b6d4', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="#c084fc" /> Tạo bài đọc mới trong Studio
            </Link>
          </div>

        </div>

        {/* 3. SECTION API KEYS & PRO DEVELOPER HUB */}
        <section style={{
          background: 'linear-gradient(180deg, rgba(20, 22, 36, 0.95) 0%, rgba(13, 14, 22, 0.98) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: '28px',
          padding: '36px',
          marginBottom: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Glow Backdrop */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none'
          }} />

          {/* Header & Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex' }}>
                  <Code size={20} color="#c084fc" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff', letterSpacing: '-0.5px' }}>
                  Developer Integration Hub & Web SDK
                </h2>
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
                Tích hợp trực tiếp công cụ tạo giọng đọc AI Veltrix Voice vào Website, Blog, CMS (WordPress) hoặc App của bạn với 1 dòng mã.
              </p>
            </div>

            <button className="btn-cta" onClick={handleCreateApiKey} style={{ fontSize: '13px', padding: '10px 20px', borderRadius: '14px', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)' }}>
              <Plus size={16} /> Tạo API Key Mới
            </button>
          </div>

          {/* Realtime API System Pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <span style={{ fontSize: '11.5px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '5px 12px', borderRadius: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              API Server: Online ({siteDomain})
            </span>
            <span style={{ fontSize: '11.5px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '5px 12px', borderRadius: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🌐 CORS Allowed: (*) Localhost & All Domains
            </span>
            <span style={{ fontSize: '11.5px', background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '5px 12px', borderRadius: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🔑 Auth: Header <code style={{ color: '#fff' }}>x-api-key</code>
            </span>
          </div>

          {/* Danh Sách API Key */}
          {apiKeys.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed var(--border-color)',
              borderRadius: '20px',
              padding: '36px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginBottom: '32px'
            }}>
              <Key size={40} style={{ opacity: 0.3, marginBottom: '12px' }} color="#c084fc" />
              <p style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff' }}>Chưa có API Key nào được khởi tạo</p>
              <p style={{ fontSize: '13px', marginTop: '4px', maxWidth: '480px', margin: '6px auto 16px' }}>
                Khởi tạo API Key để cấp quyền truy cập dịch vụ giọng đọc AI cho các website và ứng dụng của bạn.
              </p>
              <button className="btn-cta" onClick={handleCreateApiKey} style={{ fontSize: '13px', padding: '8px 18px' }}>
                <Plus size={15} /> Tạo API Key Ngay
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {apiKeys.map((item) => (
                <div 
                  key={item._id || item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(6, 182, 212, 0.2))', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Key size={18} color="#c084fc" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {item.name}
                        <span style={{ fontSize: '10.5px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Active</span>
                        <span style={{ fontSize: '10.5px', background: item.allowedDomains && item.allowedDomains.length > 0 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(148, 163, 184, 0.12)', color: item.allowedDomains && item.allowedDomains.length > 0 ? '#06b6d4' : '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Globe size={11} /> {item.allowedDomains && item.allowedDomains.length > 0 ? item.allowedDomains.join(', ') : 'Tất cả Tên Miền (*)'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', fontFamily: 'Consolas, Monaco, monospace', color: '#06b6d4', marginTop: '4px', letterSpacing: '0.5px' }}>
                        {item.key}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-small"
                      onClick={() => handleEditDomains(item)}
                      style={{ fontSize: '12px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}
                      title="Cấu hình danh sách tên miền được phép sử dụng API Key này"
                    >
                      <Globe size={14} /> Khóa Tên Miền
                    </button>
                    <button 
                      className="btn-small"
                      onClick={() => handleCopyKey(item.key, item._id || item.id)}
                      style={{ fontSize: '12px', padding: '8px 14px', borderRadius: '10px' }}
                    >
                      {copiedKeyId === (item._id || item.id) ? <><Check size={14} color="#10b981" /> Đã Copy Key</> : <><Copy size={14} /> Copy Key</>}
                    </button>
                    <button 
                      className="btn-small" 
                      onClick={() => handleDeleteApiKey(item._id || item.id)}
                      style={{ color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 14px', borderRadius: '10px' }}
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🛠️ BỘ MÃ MẪU & DOCUMENTATION PLAYGROUND */}
          <div style={{
            background: '#090a10',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  onClick={() => setActiveTabCode('cdn')}
                  style={{
                    background: activeTabCode === 'cdn' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)' : 'transparent',
                    color: activeTabCode === 'cdn' ? '#fff' : 'var(--text-secondary)',
                    border: activeTabCode === 'cdn' ? '1px solid rgba(168, 85, 247, 0.5)' : 'none',
                    padding: '8px 16px',
                    borderRadius: '9px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🌐 HTML Script CDN Embed
                </button>
                <button
                  onClick={() => setActiveTabCode('js')}
                  style={{
                    background: activeTabCode === 'js' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)' : 'transparent',
                    color: activeTabCode === 'js' ? '#fff' : 'var(--text-secondary)',
                    border: activeTabCode === 'js' ? '1px solid rgba(6, 182, 212, 0.5)' : 'none',
                    padding: '8px 16px',
                    borderRadius: '9px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  ⚡ React / Next.js SDK
                </button>
                <button
                  onClick={() => setActiveTabCode('rest')}
                  style={{
                    background: activeTabCode === 'rest' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)' : 'transparent',
                    color: activeTabCode === 'rest' ? '#fff' : 'var(--text-secondary)',
                    border: activeTabCode === 'rest' ? '1px solid rgba(16, 185, 129, 0.5)' : 'none',
                    padding: '8px 16px',
                    borderRadius: '9px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🔌 cURL / REST API
                </button>
              </div>

              <button
                className="btn-small"
                onClick={() => handleCopyCodeSnippet(
                  activeTabCode === 'cdn' ? cdnCodeSnippet : activeTabCode === 'js' ? jsInitSnippet : restApiSnippet
                )}
                style={{ fontSize: '12px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.06)' }}
              >
                {copiedCodeSnippet ? <><Check size={14} color="#10b981" /> Đã Copy Snippet</> : <><Copy size={14} /> Copy Đoạn Mã</>}
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <pre style={{
                background: '#040508',
                color: activeTabCode === 'cdn' ? '#c084fc' : activeTabCode === 'js' ? '#38bdf8' : '#34d399',
                padding: '20px',
                borderRadius: '14px',
                fontSize: '13px',
                fontFamily: 'Consolas, Monaco, "Fira Code", monospace',
                overflowX: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {activeTabCode === 'cdn' ? cdnCodeSnippet : activeTabCode === 'js' ? jsInitSnippet : restApiSnippet}
              </pre>
            </div>

            <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={14} color="#06b6d4" /> 
                <span>Script CDN tự động nhận diện Domain <b>{siteDomain}</b> và chạy mượt mà trên mọi môi trường.</span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#c084fc', fontWeight: 'bold' }}>⚡ Powered by VeltrixVoice.autos</span>
            </div>
          </div>
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

      </div>
    </div>
  );
}
