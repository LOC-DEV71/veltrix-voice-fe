import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Mic, ShieldCheck, KeyRound, 
  Settings, LogOut, CreditCard, Video
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdminAsync } from '../../redux/slices/authSlice';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { type: 'divider', label: 'QUẢN LÝ' },
  { label: 'Người dùng', icon: Users, path: '/admin/users' },
  { label: 'Giọng đọc', icon: Mic, path: '/admin/voices' },
  { label: 'Gói dịch vụ', icon: CreditCard, path: '/admin/plans' },
  { label: 'TikTok Promo', icon: Video, path: '/admin/promos' },
  { type: 'divider', label: 'HỆ THỐNG' },
  { label: 'Nhóm quyền', icon: KeyRound, path: '/admin/roles' },
  { label: 'Tài khoản Admin', icon: ShieldCheck, path: '/admin/accounts' },
  { label: 'Cài đặt', icon: Settings, path: '/admin/settings' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { adminAccount } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAdminAsync());
    navigate('/admin/login');
  };

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '64px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <img
          src="https://veltrix-social-fe.vercel.app/assets/logo-veltrix-Cwe8EsKX.png"
          alt="Veltrix"
          style={{ width: '32px', height: '32px', borderRadius: '8px' }}
        />
        <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
          Veltrix Admin
        </span>
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {MENU_ITEMS.map((item, idx) => {
          if (item.type === 'divider') {
            return (
              <div key={idx} style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                padding: '16px 12px 8px',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {item.label}
              </div>
            );
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                color: isActive ? 'var(--primary-indigo)' : 'var(--text-primary)',
                background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? '700' : '500',
                fontSize: '14.5px',
                transition: 'all 0.2s ease',
                opacity: isActive ? 1 : 0.8
              }}
              onMouseEnter={(e) => {
                if(!isActive) {
                  e.currentTarget.style.background = 'var(--bg-input)';
                }
              }}
              onMouseLeave={(e) => {
                if(!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={18} color={isActive ? 'var(--primary-indigo)' : 'var(--text-secondary)'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout at bottom */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
