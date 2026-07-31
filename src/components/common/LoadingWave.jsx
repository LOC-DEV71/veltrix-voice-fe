import React from 'react';

const VELTRIX_LOGO = 'https://veltrix-social-fe.vercel.app/assets/logo-veltrix-Cwe8EsKX.png';

export default function LoadingWave({ message = 'Đang đồng bộ dữ liệu Veltrix Voice...' }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'linear-gradient(135deg, #05070c 0%, #0c0e17 50%, #070a14 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Container Ripple & Logo */}
      <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        {/* Animated Ripple Circles */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid rgba(168, 85, 247, 0.4)',
          animation: 'rippleExpand 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1)'
        }} />
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid rgba(6, 182, 212, 0.3)',
          animation: 'rippleExpand 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1)',
          animationDelay: '0.6s'
        }} />

        {/* Logo khiên Veltrix */}
        <img 
          src={VELTRIX_LOGO} 
          alt="Veltrix Logo" 
          style={{ width: '56px', height: 'auto', zIndex: 2, animation: 'pulseGlow 2.4s infinite ease-in-out' }} 
        />
      </div>

      {/* Dynamic Equalizer Audio Wave Bars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '42px', marginBottom: '20px' }}>
        <div style={{ width: '4px', background: 'linear-gradient(180deg, #a855f7, #06b6d4)', borderRadius: '4px', animation: 'waveBar 1.2s infinite ease-in-out', animationDelay: '0s' }} />
        <div style={{ width: '4px', background: 'linear-gradient(180deg, #a855f7, #06b6d4)', borderRadius: '4px', animation: 'waveBar 1.2s infinite ease-in-out', animationDelay: '0.2s' }} />
        <div style={{ width: '4px', background: 'linear-gradient(180deg, #3b82f6, #06b6d4)', borderRadius: '4px', animation: 'waveBar 1.2s infinite ease-in-out', animationDelay: '0.4s' }} />
        <div style={{ width: '4px', background: 'linear-gradient(180deg, #a855f7, #ec4899)', borderRadius: '4px', animation: 'waveBar 1.2s infinite ease-in-out', animationDelay: '0.6s' }} />
        <div style={{ width: '4px', background: 'linear-gradient(180deg, #a855f7, #06b6d4)', borderRadius: '4px', animation: 'waveBar 1.2s infinite ease-in-out', animationDelay: '0.8s' }} />
      </div>

      {/* Subtitle / Message */}
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
        {message}
      </div>
    </div>
  );
}
