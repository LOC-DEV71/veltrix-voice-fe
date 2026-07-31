import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientMe } from '../redux/slices/authSlice';
import { Zap } from 'lucide-react';

/**
 * Middleware Frontend bọc phân vùng Client Routes
 * Tự động kiểm tra session / cookie của Client User khi vào các trang Client
 */
export default function ClientMiddleware({ children }) {
  const dispatch = useDispatch();
  const { clientUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientUser) {
      dispatch(fetchClientMe()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [clientUser, dispatch]);

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(24, 20, 48, 0.96) 0%, rgba(10, 10, 18, 0.99) 100%)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* WAVE RIPPLE CONTAINER */}
        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          
          {/* Ripple Ring 1 */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid rgba(168, 85, 247, 0.5)',
              animation: 'rippleExpand 2s cubic-bezier(0, 0.2, 0.8, 1) infinite'
            }}
          />

          {/* Ripple Ring 2 */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid rgba(6, 182, 212, 0.5)',
              animation: 'rippleExpand 2s cubic-bezier(0, 0.2, 0.8, 1) infinite 0.6s'
            }}
          />

          {/* Ripple Ring 3 */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid rgba(236, 72, 153, 0.4)',
              animation: 'rippleExpand 2s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.2s'
            }}
          />

          {/* Center Glowing Brand Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(168, 85, 247, 0.6)',
              animation: 'pulseGlow 2s ease-in-out infinite',
              zIndex: 2
            }}
          >
            <Zap size={30} color="#ffffff" fill="#ffffff" />
          </div>
        </div>

        {/* SOUNDWAVE FREQUENCY BARS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px', marginBottom: '18px' }}>
          <div style={{ width: '4px', background: '#a855f7', borderRadius: '4px', animation: 'waveBar 1.2s ease-in-out infinite 0s' }} />
          <div style={{ width: '4px', background: '#c084fc', borderRadius: '4px', animation: 'waveBar 1.2s ease-in-out infinite 0.15s' }} />
          <div style={{ width: '4px', background: '#06b6d4', borderRadius: '4px', animation: 'waveBar 1.2s ease-in-out infinite 0.3s' }} />
          <div style={{ width: '4px', background: '#38bdf8', borderRadius: '4px', animation: 'waveBar 1.2s ease-in-out infinite 0.45s' }} />
          <div style={{ width: '4px', background: '#ec4899', borderRadius: '4px', animation: 'waveBar 1.2s ease-in-out infinite 0.6s' }} />
        </div>

        {/* SUBTITLE */}
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Veltrix Voice <span style={{ color: '#c084fc' }}>•</span> Đang tải...
        </div>
      </div>
    );
  }

  return children;
}
