import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AudioWaveform, ArrowLeft, Lock, Mail, Sparkles } from 'lucide-react';
import { loginClientAsync, loginGoogleAsync } from '../../redux/slices/authSlice';
import { fetchVoices } from '../../redux/slices/ttsSlice';

import Swal from 'sweetalert2';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginClientAsync({ email, password }));
    if (loginClientAsync.fulfilled.match(result)) {
      dispatch(fetchVoices());
      navigate('/studio');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại!',
        text: result.payload || 'Email hoặc mật khẩu chưa chính xác.',
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
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

            <button type="submit" className="btn-cta" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '6px' }}>
              {loading ? 'Đang xử lý...' : 'Đăng Nhập Ngay 🚀'}
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
    </div>
  );
}
