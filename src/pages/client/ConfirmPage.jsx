import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle2, XCircle, ArrowRight, Mail, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { fetchClientMe } from '../../redux/slices/authSlice';
import LoadingWave from '../../components/common/LoadingWave';
import Swal from 'sweetalert2';

const VELTRIX_LOGO = 'https://veltrix-social-fe.vercel.app/assets/logo-veltrix-Cwe8EsKX.png';

export default function ConfirmPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ success: false, message: '' });
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setStatus({ success: false, message: 'Thiếu mã xác minh tài khoản! Vui lòng kiểm tra lại liên kết trong Email của bạn.' });
      return;
    }

    const confirmAccount = async () => {
      try {
        const res = await api.post('/client/auth/confirm', { token });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          await dispatch(fetchClientMe());
        }
        setStatus({
          success: true,
          message: res.data.message || 'Chúc mừng! Tài khoản Veltrix Voice của bạn đã được xác thực thành công.'
        });
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn (quá 24h).';
        setStatus({ success: false, message: msg });
      } finally {
        setLoading(false);
      }
    };

    confirmAccount();
  }, [token, dispatch]);

  const handleResendEmail = async () => {
    const { value: email } = await Swal.fire({
      title: 'Gửi Lại Email Xác Nhận',
      input: 'email',
      inputLabel: 'Nhập địa chỉ Email đăng ký của bạn:',
      inputPlaceholder: 'example@domain.com',
      showCancelButton: true,
      confirmButtonText: 'Gửi Mail Xác Nhận 🚀',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#8b5cf6',
      background: '#0f172a',
      color: '#fff'
    });

    if (email) {
      setResending(true);
      try {
        const res = await api.post('/client/auth/resend-verification', { email });
        Swal.fire({
          icon: 'success',
          title: 'Thành Công!',
          text: res.data.message || 'Đã gửi lại Email xác thực! Vui lòng kiểm tra hộp thư của bạn.',
          confirmButtonColor: '#8b5cf6',
          background: '#0f172a',
          color: '#fff'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Thất Bại!',
          text: err.response?.data?.error || 'Lỗi gửi lại mail. Vui lòng thử lại sau!',
          confirmButtonColor: '#ef4444',
          background: '#0f172a',
          color: '#fff'
        });
      } finally {
        setResending(false);
      }
    }
  };

  if (loading) {
    return <LoadingWave message="Veltrix Voice • Đang xác nhận tài khoản của bạn..." />;
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
        maxWidth: '480px',
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
          background: status.success 
            ? 'linear-gradient(90deg, #10b981, #06b6d4)' 
            : 'linear-gradient(90deg, #ef4444, #f59e0b)'
        }} />

        {/* Brand Shield Logo */}
        <div style={{ marginBottom: '24px' }}>
          <img 
            src={VELTRIX_LOGO} 
            alt="Veltrix Logo" 
            style={{ width: '64px', height: 'auto', margin: '0 auto', filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 0.4))' }} 
          />
        </div>

        {status.success ? (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#10b981'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>
              Xác Nhận Tài Khoản Thành Công! 🎉
            </h2>

            <p style={{ fontSize: '14.5px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>
              {status.message}
            </p>

            <Link 
              to="/studio" 
              className="btn-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px 24px',
                fontSize: '15px',
                fontWeight: '800',
                borderRadius: '14px',
                textDecoration: 'none'
              }}
            >
              <Sparkles size={18} /> VÀO STUDIO TRẢI NGHIỆM NGAY <ArrowRight size={18} />
            </Link>
          </>
        ) : (
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
              Xác Nhận Thất Bại
            </h2>

            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '28px' }}>
              {status.message}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={handleResendEmail}
                disabled={resending}
                className="btn-cta"
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '700',
                  borderRadius: '12px',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                }}
              >
                <Mail size={16} /> {resending ? 'Đang gửi mail...' : 'Gửi Lại Email Xác Nhận'}
              </button>

              <Link 
                to="/login" 
                className="btn-small"
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  fontSize: '13.5px',
                  borderRadius: '12px',
                  justifyContent: 'center'
                }}
              >
                Quay lại Trang Đăng Nhập
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
