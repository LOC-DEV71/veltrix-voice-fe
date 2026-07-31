import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import LoadingWave from '../../components/common/LoadingWave';

const VELTRIX_LOGO = 'https://veltrix-social-fe.vercel.app/assets/logo-veltrix-Cwe8EsKX.png';

export default function DeviceVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErrorMsg('Thiếu mã token xác thực thiết bị!');
      return;
    }

    const fetchInfo = async () => {
      try {
        const res = await api.get(`/client/auth/device-verify-info?token=${token}`);
        setInfo(res.data);
        if (res.data.isVerified) {
          setVerifiedSuccess(true);
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.error || 'Phiên xác thực đã hết hạn hoặc không hợp lệ.');
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [token]);

  const handleSelectCode = async (selectedCode) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.post('/client/auth/verify-device-code', {
        token,
        selectedCode
      });
      if (res.data.success) {
        setVerifiedSuccess(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Số bạn chọn không chính xác! Vui lòng kiểm tra lại con số hiển thị trên màn hình thiết bị mới.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingWave message="Veltrix Security • Đang tải thông tin xác thực thiết bị..." />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #05070c 0%, #0c0e17 50%, #070a14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#fff'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'var(--bg-card, #0a0a0c)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
        borderRadius: '24px',
        padding: '40px 32px',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Top Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: verifiedSuccess 
            ? 'linear-gradient(90deg, #10b981, #06b6d4)' 
            : 'linear-gradient(90deg, #f59e0b, #ec4899)'
        }} />

        {/* Brand Shield Logo */}
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={VELTRIX_LOGO} 
            alt="Veltrix Logo" 
            style={{ width: '64px', height: 'auto', margin: '0 auto', filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 0.4))' }} 
          />
        </div>

        {verifiedSuccess ? (
          <>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#10b981'
            }}>
              <ShieldCheck size={42} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>
              Xác Nhận Thiết Bị Thành Công! 🛡️
            </h2>

            <p style={{ fontSize: '14.5px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '28px' }}>
              Bạn đã xác nhận <b>"Vâng, chính là tôi!"</b>. Màn hình trên thiết bị mới sẽ tự động đăng nhập trong vài giây.
            </p>

            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '16px',
              fontSize: '13.5px',
              color: '#10b981',
              fontWeight: '600'
            }}>
              ✨ IP mới ({info?.ipAddress || 'đã ghi nhận'}) đã được thêm vào Danh Sách Thiết Bị An Toàn của bạn.
            </div>
          </>
        ) : errorMsg && !info ? (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#ef4444'
            }}>
              <XCircle size={36} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>
              Phiên Xác Thực Không Hợp Lệ
            </h2>

            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '28px' }}>
              {errorMsg}
            </p>
          </>
        ) : (
          <>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#f59e0b',
              fontSize: '12.5px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              <ShieldAlert size={15} /> BẢO MẬT THIẾT BỊ MỚI
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>
              Phát Hiện Đăng Nhập Từ Thiết Bị Mới
            </h2>

            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              Tài khoản <b>{info?.email}</b> đang được đăng nhập từ IP mới (<b>{info?.ipAddress}</b>).<br/>
              Hãy chọn con số <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>khớp với số đang hiển thị trên màn hình thiết bị mới</span>:
            </p>

            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#ef4444',
                fontSize: '13.5px',
                fontWeight: '600',
                marginBottom: '20px'
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* 3 NÚT CHỌN SỐ 2 CHỮ SỐ BẢO MẬT */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {(info?.optionCodes || []).map((code) => (
                <button
                  key={code}
                  disabled={submitting}
                  onClick={() => handleSelectCode(code)}
                  style={{
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '2px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '18px',
                    padding: '24px 12px',
                    color: '#fff',
                    fontSize: '32px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#c084fc';
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(168, 85, 247, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
                  }}
                >
                  <span>{code}</span>
                  <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: '600' }}>Bấm Chọn</span>
                </button>
              ))}
            </div>

            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
              🔒 Liên kết này chỉ có hiệu lực trong 10 phút. Nếu không phải bạn đăng nhập, hãy bỏ qua hoặc đổi mật khẩu.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
