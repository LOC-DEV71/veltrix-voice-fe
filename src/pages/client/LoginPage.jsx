import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AudioWaveform, ArrowLeft, Lock, Mail, Sparkles, ShieldAlert, AlertCircle } from 'lucide-react';
import { loginClientAsync, loginGoogleAsync, fetchClientMe } from '../../redux/slices/authSlice';
import { fetchVoices } from '../../redux/slices/ttsSlice';
import api from '../../services/api';
import ButtonSpinner from '../../components/common/ButtonSpinner';

import Swal from 'sweetalert2';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  loading === true;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isUserNotFound, setIsUserNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deviceVerifyData, setDeviceVerifyData] = useState(null);

  // Polling tự động kiểm tra xem người dùng đã bấm chọn số trên Email chưa
  useEffect(() => {
    if (!deviceVerifyData?.sessionToken) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.post('/client/auth/check-device-verify', {
          sessionToken: deviceVerifyData.sessionToken
        });
        if (res.data?.isVerified && res.data?.token) {
          clearInterval(interval);
          localStorage.setItem('token', res.data.token);
          await dispatch(fetchClientMe());
          dispatch(fetchVoices());
          navigate('/studio');
        }
      } catch (err) {
        console.error('Polling device verify error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [deviceVerifyData, dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting || loading) return;

    setErrorMsg('');
    setIsUserNotFound(false);
    setSubmitting(true);

    try {
      const result = await dispatch(loginClientAsync({ email, password }));
      if (loginClientAsync.fulfilled.match(result)) {
        if (result.payload?.requireDeviceVerify) {
          setDeviceVerifyData(result.payload);
          return;
        }
        dispatch(fetchVoices());
        navigate('/studio');
      } else {
        const msg = typeof result.payload === 'string' ? result.payload : 'Email hoặc mật khẩu chưa chính xác.';
        setErrorMsg(msg);
        if (msg.includes('chưa được đăng ký')) {
          setIsUserNotFound(true);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const result = await dispatch(loginGoogleAsync(credentialResponse.credential));
      if (loginGoogleAsync.fulfilled.match(result)) {
        dispatch(fetchVoices());
        navigate('/studio');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập Google thất bại!',
          text: result.payload || 'Vui lòng thử lại sau.',
          background: '#181824',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  return (
    <div className="auth-page-grid" style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-dark)'
    }}>
      {/* Cột trái: Banner thương hiệu Veltrix Voice (ẩn trên mobile) */}
      <div className="auth-left-banner" style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%), var(--bg-card)',
        borderRight: '1px solid var(--border-color)',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Link to="/" className="brand-logo">
          <div className="logo-icon">
            <AudioWaveform size={22} color="#fff" />
          </div>
          <span>Veltrix <span style={{ color: '#8b5cf6' }}>Voice</span></span>
        </Link>

        <div>
          <div className="hero-badge" style={{ marginBottom: '16px' }}>
            <Sparkles size={14} /> Trải nghiệm giọng đọc AI đỉnh cao
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
            Chào Mừng Trở Lại Với <br /> Veltrix Voice 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', maxWidth: '440px' }}>
            Đăng nhập để tiếp tục tạo giọng nói trí tuệ nhân tạo truyền cảm, tải file MP3 và quản lý số dư Token của bạn.
          </p>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          © 2026 Veltrix Voice Platform. Bảo mật và an toàn 100%.
        </div>
      </div>

      {/* Cột phải: Form Đăng Nhập */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none', marginBottom: '32px' }}>
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>

          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Đăng Nhập Khách Hàng</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '28px' }}>
            Chưa có tài khoản? <Link to="/register" style={{ color: '#8b5cf6', fontWeight: 'bold', textDecoration: 'none' }}>Đăng ký tài khoản!</Link>
          </p>

          {/* THÔNG BÁO VALIADTE INLINE KHÔNG GÂY KHÓ CHỊU UX */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              color: '#f87171',
              fontSize: '13.5px',
              lineHeight: '1.5',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.12)'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{errorMsg}</div>
                {isUserNotFound && (
                  <div style={{ marginTop: '8px' }}>
                    <Link 
                      to="/register" 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: '#c084fc', 
                        fontWeight: '700', 
                        fontSize: '13px',
                        textDecoration: 'underline' 
                      }}
                    >
                      🚀 Đăng ký tài khoản mới ngay tại đây!
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Đăng Nhập Email/Password Nằm Ở Trên */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>EMAIL KHÁCH HÀNG</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: '#fff', fontSize: '14px' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>MẬT KHẨU</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: '#fff', fontSize: '14px' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-cta" 
              disabled={loading || submitting} 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '12px', 
                fontSize: '15px', 
                marginTop: '6px',
                opacity: (loading || submitting) ? 0.75 : 1,
                cursor: (loading || submitting) ? 'not-allowed' : 'pointer'
              }}
            >
              {(loading || submitting) ? <ButtonSpinner text="Đang kiểm tra thông tin..." /> : 'Đăng Nhập Ngay 🚀'}
            </button>
          </form>

          {/* Đường Phân Cách */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--text-secondary)', fontSize: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span style={{ padding: '0 12px' }}>HOẶC ĐĂNG NHẬP BẰNG GOOGLE</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

          {/* Nút Đăng Nhập Google Nằm Ở Dưới Cùng */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin 
              onSuccess={handleGoogleSuccess}
              onError={() => Swal.fire({ icon: 'error', title: 'Thất bại!', text: 'Đăng nhập Google thất bại!', background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' })}
              theme="filled_blue"
              shape="pill"
              locale="vi"
            />
          </div>
        </div>
      </div>

      {/* MODAL CẢNH BÁO XÁC THỰC THIẾT BỊ / IP MỚI */}
      {deviceVerifyData && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(5, 7, 12, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            background: '#0c0e17',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            position: 'relative',
            animation: 'fadeInScale 0.3s ease'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#f59e0b',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              <ShieldAlert size={15} /> THIẾT BỊ / IP MỚI CẦN XÁC THỰC
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
              Kiểm Tra Email Của Bạn 📩
            </h3>

            <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              Chúng tôi đã gửi Email cảnh báo bảo mật tới <b>{deviceVerifyData.email}</b>.<br/>
              Vui lòng mở Email trên điện thoại hoặc thiết bị khác và bấm chọn con số bên dưới để xác nhận:
            </p>

            {/* MÃ SỐ 2 CHỮ SỐ NỔI BẬT */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)',
              border: '2px dashed #06b6d4',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <span style={{ 
                fontSize: '52px', 
                fontWeight: '900', 
                color: '#06b6d4', 
                letterSpacing: '4px',
                filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.6))'
              }}>
                {deviceVerifyData.targetCode}
              </span>
              <div style={{ fontSize: '12px', color: '#c084fc', marginTop: '6px', fontWeight: '700' }}>
                👉 Hãy chọn con số này trên màn hình Email link
              </div>
            </div>

            {/* Trạng thái chờ real-time */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#94a3b8',
              fontSize: '13px',
              marginBottom: '24px',
              background: 'rgba(255,255,255,0.03)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: '#06b6d4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span>Đang chờ bạn chọn số trên Email...</span>
            </div>

            <button 
              onClick={() => setDeviceVerifyData(null)}
              className="btn-small"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '13px' }}
            >
              Hủy Đăng Nhập
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
