import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, Send, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { clientService } from '../../services/clientService';
import Swal from 'sweetalert2';

export default function TiktokPromoModal({ selectedPlan, user, onClose, onSuccess }) {
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [email, setEmail] = useState(user?.email || '');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  useEffect(() => {
    clientService.getPromoConfig()
      .then(res => {
        setConfig(res.data.config);
        setLoadingConfig(false);
      })
      .catch(err => {
        console.error("Lỗi lấy promo config:", err);
        setLoadingConfig(false);
      });
  }, []);

  const handleCopyHashtags = () => {
    if (!config?.hashtags) return;
    const textToCopy = config.hashtags.join(' ');
    navigator.clipboard.writeText(textToCopy);
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleDownloadImage = () => {
    if (!config?.promoImageUrl) {
      Swal.fire({ icon: 'info', title: 'Thông báo', text: 'Admin chưa cập nhật ảnh quảng bá. Bạn có thể tải ảnh bất kỳ từ trang web để đăng nhé!', background: '#181824', color: '#fff', confirmButtonColor: '#8b5cf6' });
      return;
    }
    // Mở ảnh trong tab mới hoặc trigger download
    window.open(config.promoImageUrl, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanUrl = tiktokUrl.trim();

    if (!cleanEmail || !cleanUrl) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin!',
        text: 'Vui lòng điền đầy đủ Email và Link bài đăng quảng bá.',
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#8b5cf6'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Email không hợp lệ!',
        text: 'Định dạng Email chưa chính xác (ví dụ: user@gmail.com). Vui lòng kiểm tra lại!',
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#8b5cf6'
      });
      return;
    }

    // Validate URL format
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      Swal.fire({
        icon: 'warning',
        title: 'Link chưa đúng định dạng!',
        text: 'Link bài đăng bắt buộc phải bắt đầu bằng http:// hoặc https:// (Ví dụ: https://vt.tiktok.com/...)',
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#8b5cf6'
      });
      return;
    }

    // Validate platform URL if platform is TikTok
    const platform = config?.platformName?.toLowerCase() || 'tiktok';
    if (platform.includes('tiktok') && !cleanUrl.includes('tiktok.com') && !cleanUrl.includes('vt.tiktok') && !cleanUrl.includes('vm.tiktok')) {
      Swal.fire({
        icon: 'error',
        title: 'Chưa đúng Link TikTok!',
        text: 'Vui lòng dán chính xác Link bài đăng/clip TikTok hợp lệ (Ví dụ: https://www.tiktok.com/@user/video/123...)',
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#8b5cf6'
      });
      return;
    }

    setSubmitting(true);
    try {
      await clientService.submitTikTokPromo({
        planId: selectedPlan._id,
        email: cleanEmail,
        tiktokUrl: cleanUrl
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Gửi yêu cầu thành công! 🎉',
        text: `Admin đã nhận được yêu cầu kích hoạt gói ${selectedPlan.name} của bạn. Chúng tôi sẽ kiểm tra link và kích hoạt trong vòng 24h.`,
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gửi thất bại!',
        text: err.response?.data?.error || err.message,
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSubmitting(false);
    }
  };

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
          padding: '28px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
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
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>🎁</span>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {config?.title || `Nhận ${selectedPlan.name} Miễn Phí qua Quảng Bá`}
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Chỉ với 3 bước đơn giản bên dưới để nhận ngay gói <b style={{ color: 'var(--primary-purple)' }}>{selectedPlan.name} ({selectedPlan.tokensPerMonth?.toLocaleString()} tokens/tháng)</b> hoàn toàn miễn phí!
          </p>
        </div>

        {loadingConfig ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Đang tải thông tin chiến dịch...
          </div>
        ) : config?.isActive === false ? (
          <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-input)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <AlertCircle size={36} color="#eab308" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px' }}>Sự kiện quảng bá hiện đang tạm dừng</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Admin hiện đang tạm khóa đăng ký sự kiện này. Vui lòng quay lại sau!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* BƯỚC 1: TẢI ẢNH QUẢNG BÁ */}
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-purple)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: 'var(--primary-purple)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>1</span>
                BƯỚC 1: TẢI ẢNH QUẢNG BÁ HỆ THỐNG
              </div>

              {config?.promoImageUrl ? (
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px' }}>
                  <img 
                    src={config.promoImageUrl} 
                    alt="Promo Banner" 
                    style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Tải ảnh này về để dùng làm ảnh bài đăng hoặc thumbnail trên {config?.platformName || 'mạng xã hội'}.
                    </p>
                    <button 
                      type="button"
                      onClick={handleDownloadImage}
                      className="btn-small" 
                      style={{ fontSize: '12px', gap: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}
                    >
                      <Download size={14} /> Tải ảnh / Xem ảnh gốc
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} color="#eab308" /> Admin chưa cập nhật ảnh banner mẫu. Bạn có thể tự chụp màn hình hoặc dùng ảnh Veltrix Voice để đăng nhé!
                </div>
              )}
            </div>

            {/* BƯỚC 2: SAO CHÉP HASHTAG & HƯỚNG DẪN */}
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-purple)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: 'var(--primary-purple)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>2</span>
                BƯỚC 2: ĐĂNG LÊN {config?.platformName?.toUpperCase() || 'MẠNG XÃ HỘI'} KÈM HASHTAG
              </div>

              {/* Hashtag List */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '10px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {config?.hashtags?.map((tag, idx) => (
                    <span key={idx} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '6px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={handleCopyHashtags}
                  style={{ background: 'transparent', border: 'none', color: copiedHashtags ? '#10b981' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}
                >
                  {copiedHashtags ? <><Check size={14} /> Đã chép</> : <><Copy size={14} /> Chép Hashtags</>}
                </button>
              </div>

              {/* Instructions text */}
              {config?.instructions && (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                  {config.instructions}
                </div>
              )}
            </div>

            {/* BƯỚC 3: DÁN LINK BÀI ĐĂNG & GỬI YÊU CẦU */}
            <form onSubmit={handleSubmit} noValidate style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ background: 'var(--primary-purple)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>3</span>
                BƯỚC 3: DÁN LINK BÀI ĐĂNG ĐỂ XÁC NHẬN
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email tài khoản của bạn</label>
                <input 
                  type="text" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Link bài đăng {config?.platformName || 'Quảng bá'} (URL clip/bài viết)</label>
                <input 
                  type="text" 
                  value={tiktokUrl}
                  onChange={e => setTiktokUrl(e.target.value)}
                  placeholder={`https://${config?.platformName?.toLowerCase() || 'social'}.com/...`}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={onClose} 
                  style={{ padding: '10px 18px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-cta" 
                  style={{ padding: '10px 22px', fontSize: '13px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi yêu cầu kích hoạt gói'} <Send size={14} />
                </button>
              </div>
            </form>

          </div>
        )}
      </div>
    </div>
  );
}
