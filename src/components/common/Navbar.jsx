import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, User, Crown, ArrowRight, Globe, Home, Sun, Moon, LayoutDashboard, Sparkles, Tag, ChevronDown, Coffee, Menu, X } from 'lucide-react';
import { logoutClientAsync } from '../../redux/slices/authSlice';
import { fetchVoices } from '../../redux/slices/ttsSlice';
import { clientService } from '../../services/clientService';
import { formatNumber } from '../../utils/formatters';
import SubscriptionModal from '../client/SubscriptionModal';
import DonateModal from '../common/DonateModal';

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { clientUser } = useSelector((state) => state.auth || {});
  const { t, i18n } = useTranslation();

  const [theme, setTheme] = useState(() => localStorage.getItem('veltrix_theme') || 'dark');
  const [showSubModal, setShowSubModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStudioPage = location.pathname === '/studio';
  const isDashboardPage = location.pathname === '/dashboard';
  const isPricingPage = location.pathname === '/pricing';
  
  // Tất cả các trang ứng dụng (/studio, /dashboard, /pricing) dùng chung Work Header tinh gọn
  const isWorkHeader = isStudioPage || isDashboardPage || isPricingPage;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('veltrix_theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const res = await clientService.getLanguages();
        setLanguages(res?.data?.languages || []);
      } catch (err) {
        console.error('Lỗi tải ngôn ngữ:', err);
      }
    };
    loadLanguages();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await dispatch(logoutClientAsync());
    dispatch(fetchVoices());
    navigate('/');
  };

  // Ưu tiên lấy Tên hiển thị thực (Name từ Google / Form) -> nếu chưa có mới lấy username trước dấu @
  const displayName = clientUser ? (clientUser.name || clientUser.email?.split('@')[0] || 'User') : '';

  return (
    <>
      <header className="navbar-wrapper">
        <nav className="navbar">
          <div className="nav-left">
            {/* Logo Thương Hiệu Veltrix Chính Thức */}
            <Link to="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="https://veltrix-social-fe.vercel.app/assets/logo-veltrix-Cwe8EsKX.png" 
                alt="Veltrix Logo" 
                style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain' }}
              />
              <span>Veltrix <span style={{ color: 'var(--primary-purple)' }}>Voice</span></span>
            </Link>

            {/* Nếu ở Trang Công Việc (/studio, /dashboard, /pricing) -> Dùng Work Header Gọn Gàng */}
            {!isWorkHeader ? (
              <ul className="nav-menu">
                {clientUser && (
                  <li>
                    <Link 
                      to="/dashboard" 
                      className={`nav-link ${isDashboardPage ? 'active' : ''}`}
                      style={{ color: '#c084fc', fontWeight: 'bold' }}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li><a href="/#features" className="nav-link">{t('nav.features')}</a></li>
                <li><a href="/#voices" className="nav-link">{t('nav.voices')}</a></li>
                <li><a href="/#pricing" className="nav-link">{t('nav.pricing')}</a></li>
                <li><a href="/#faq" className="nav-link">{t('nav.faq')}</a></li>
              </ul>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link to="/" className="btn-small" style={{ fontSize: '11.5px', padding: '5px 10px' }}>
                  <Home size={12} /> {t('nav.home')}
                </Link>

                {clientUser && (
                  <>
                    {!isDashboardPage && (
                      <Link 
                        to="/dashboard" 
                        className="btn-small" 
                        style={{ 
                          fontSize: '11.5px', 
                          padding: '5px 10px', 
                          color: '#c084fc',
                          background: 'rgba(168, 85, 247, 0.12)',
                          borderColor: 'rgba(168, 85, 247, 0.3)'
                        }}
                      >
                        <LayoutDashboard size={12} /> {t('nav.dashboard')}
                      </Link>
                    )}

                    {!isStudioPage && (
                      <Link 
                        to="/studio" 
                        className="btn-small" 
                        style={{ 
                          fontSize: '11.5px', 
                          padding: '5px 10px', 
                          color: '#06b6d4',
                          background: 'rgba(6, 182, 212, 0.12)',
                          borderColor: 'rgba(6, 182, 212, 0.3)'
                        }}
                      >
                        <Sparkles size={12} /> {t('nav.studio')}
                      </Link>
                    )}

                    {!isPricingPage && (
                      <Link 
                        to="/pricing" 
                        className="btn-small" 
                        style={{ 
                          fontSize: '11.5px', 
                          padding: '5px 10px', 
                          color: '#10b981',
                          background: 'rgba(16, 185, 129, 0.12)',
                          borderColor: 'rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <Tag size={12} /> {t('nav.pricing')}
                      </Link>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="nav-right" style={{ gap: '6px' }}>
            {/* Nút Donate Cà Phê Duy Trì Server */}
            <button
              onClick={() => setShowDonateModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '16px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#f59e0b',
                fontSize: '11.5px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              title="Ủng hộ ly cà phê duy trì Server cho anh em xài miễn phí"
            >
              <Coffee size={13} color="#f59e0b" /> Donate Cà Phê ☕
            </button>

            {/* Nút Chuyển Đổi Dark Mode / Light Mode */}
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme} 
              title={`Chuyển sang ${theme === 'dark' ? 'Giao diện Sáng' : 'Giao diện Đen Tuyền'}`}
              style={{ padding: '5px 8px', borderRadius: '8px' }}
            >
              {theme === 'dark' ? (
                <Sun size={15} color="#f59e0b" />
              ) : (
                <Moon size={15} color="#8b5cf6" />
              )}
            </button>

            <div className="lang-selector" style={{ position: 'relative' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '5px 8px', borderRadius: '8px', background: 'var(--card-bg)' }}
                onClick={() => setShowLangMenu(!showLangMenu)}
              >
                <Globe size={13} color="var(--primary-purple)" /> 
                <span style={{ fontSize: '11.5px', fontWeight: 'bold' }}>{(i18n.language || 'vi').toUpperCase()}</span>
                <ChevronDown size={13} />
              </div>
              {showLangMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px', minWidth: '120px', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {(languages || []).map(lang => (
                    <div 
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer', borderRadius: '6px', color: i18n.language === lang.code ? 'var(--primary-purple)' : 'var(--text-color)', background: i18n.language === lang.code ? 'rgba(139, 92, 246, 0.1)' : 'transparent', fontWeight: i18n.language === lang.code ? 'bold' : 'normal' }}
                      onMouseEnter={e => { if (i18n.language !== lang.code) e.currentTarget.style.background = 'var(--bg-color)' }}
                      onMouseLeave={e => { if (i18n.language !== lang.code) e.currentTarget.style.background = 'transparent' }}
                    >
                      {lang.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {clientUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* HIỂN THỊ GÓI CƯỚC & TOKEN TRÊN WORK HEADER */}
                {isWorkHeader && (
                  <>
                    <div 
                      onClick={() => setShowSubModal(true)}
                      style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', color: '#06b6d4', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', cursor: 'pointer' }}
                      title="Xem chi tiết gói và lịch sử đăng ký"
                    >
                      <Crown size={12} color="#06b6d4" /> GÓI {clientUser.tier || 'PRO'}
                    </div>

                    <div 
                      onClick={() => setShowSubModal(true)}
                      style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '4px 10px', borderRadius: '16px', fontSize: '11.5px', color: '#c084fc', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', cursor: 'pointer' }}
                      title="Xem số dư Token và lịch sử"
                    >
                      <Zap size={12} fill="#c084fc" /> {formatNumber(clientUser.tokens !== undefined ? clientUser.tokens : 2000)} Token
                    </div>
                  </>
                )}

                {/* Tên Người Dùng */}
                <div 
                  className="user-email-badge" 
                  onClick={() => setShowSubModal(true)}
                  style={{ cursor: 'pointer', padding: '4px 8px', fontSize: '11.5px' }}
                  title={`Email: ${clientUser.email || ''} (Click xem lịch sử gói)`}
                >
                  <User size={13} color="var(--primary-purple)" style={{ flexShrink: 0 }} />
                  <span>{displayName}</span>
                </div>

                {!isWorkHeader && (
                  <Link to="/studio" className="btn-cta" style={{ padding: '6px 14px', fontSize: '12px' }}>
                    {t('nav.studio')} <ArrowRight size={13} />
                  </Link>
                )}

                <button className="btn-small" onClick={handleLogout} style={{ padding: '5px 10px', fontSize: '11.5px' }}>{t('nav.logout')}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link 
                  to="/login" 
                  className="nav-link"
                  style={{ fontSize: '13.5px', fontWeight: '600' }}
                >
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-cta">
                  {t('nav.start_free')}
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Button - Đảm bảo luôn hiển thị trên Mobile */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary, #fff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              zIndex: 1001
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <nav className="mobile-nav-links">
              {clientUser && (
                <>
                  <Link to="/dashboard" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link to="/studio" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <Sparkles size={16} /> {t('nav.studio')}
                  </Link>
                </>
              )}
              <Link to="/pricing" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                <Tag size={16} /> {t('nav.pricing')}
              </Link>
              <a href="/#features" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.features')}
              </a>
              <a href="/#voices" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.voices')}
              </a>
              <a href="/#faq" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.faq')}
              </a>

              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px', paddingTop: '12px' }}>
                {clientUser ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <User size={14} color="var(--primary-purple)" /> {displayName} • <Crown size={12} color="#06b6d4" /> {clientUser.tier || 'PRO'}
                    </div>
                    <button className="btn-small" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ justifyContent: 'center', width: '100%' }}>
                      {t('nav.logout')}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to="/login" className="btn-small" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>
                      {t('nav.login')}
                    </Link>
                    <Link to="/register" className="btn-cta" onClick={() => setMobileMenuOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>
                      {t('nav.start_free')}
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Modal Xem Lịch Sử Đăng Ký */}
      {showSubModal && (
        <SubscriptionModal 
          user={clientUser} 
          onClose={() => setShowSubModal(false)} 
        />
      )}

      {/* Modal Donate Cà Phê */}
      {showDonateModal && (
        <DonateModal 
          onClose={() => setShowDonateModal(false)} 
        />
      )}
    </>
  );
}