import React from 'react';

export default function ButtonSpinner({ text = 'Đang xử lý...', iconSize = 18, color = '#ffffff' }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24" 
        fill="none" 
        style={{
          animation: 'buttonSpin 0.75s linear infinite',
          flexShrink: 0
        }}
      >
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke={color} 
          strokeWidth="3" 
          strokeDasharray="31.415 31.415" 
          strokeLinecap="round" 
          style={{ opacity: 0.25 }}
        />
        <path 
          d="M12 2A10 10 0 0 1 22 12" 
          stroke={color} 
          strokeWidth="3" 
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      {text && <span style={{ fontWeight: '600', letterSpacing: '0.2px' }}>{text}</span>}
      <style>{`
        @keyframes buttonSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );
}
