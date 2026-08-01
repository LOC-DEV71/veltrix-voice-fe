import React, { useState, useEffect } from 'react';
import { 
  Globe, Save, Sparkles, HelpCircle, Layers, ShieldCheck, 
  Zap, Check, RefreshCw, Eye, FileText, Plus, Trash2, HelpCircle as QuestionIcon, Languages, Menu, Coffee, ArrowRight, Home, LayoutDashboard, LogOut, Download, Upload
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';

const DEFAULT_LANG_DATA = {
  navHome: 'Trang chủ',
  navDashboard: 'Dashboard',
  navFeatures: 'Tính năng',
  navVoices: 'Giọng đọc AI',
  navPricing: 'Bảng giá',
  navFaq: 'Hỏi đáp',
  navDonate: 'Donate Cà Phê ☕',
  navStudio: 'Vào Studio 🚀',
  navLogout: 'Đăng xuất',
  heroBadge: 'Công Nghệ Chuyển Văn Bản Thành Giọng Nói AI Đỉnh Cao',
  heroTitle: 'Tạo Giọng Đọc AI',
  heroTitleHl1: 'Sống Động',
  heroTitleHl2: 'Tự Nhiên Như Người Thật',
  heroSubtitle: 'Nền tảng Veltrix Voice giúp bạn biến mọi văn bản thành file âm thanh MP3 chất lượng cao chỉ trong vài giây. Phù hợp làm video YouTube, TikTok, Đọc sách nói & Quảng cáo.',
  heroCtaMain: 'Dùng Thử Ngay Bây Giờ',
  heroCtaSecondary: 'Nghe Mẫu Giọng Đọc',
  featuresTag: 'TÍNH NĂNG VƯỢT TRỘI',
  featuresTitle: 'Tại Sao Nên Chọn Veltrix Voice?',
  card1Title: 'Giọng Đọc Neural AI',
  card1Desc: 'Mô hình học sâu tiên tiến phát âm chuẩn ngắt nghỉ, giữ ngữ điệu cảm xúc tự nhiên 99% như giọng người thật.',
  card2Title: 'Xử Lý Siêu Tốc',
  card2Desc: 'Hệ thống Server Cloud mạnh mẽ giúp chuyển đổi văn bản 1,000 ký tự thành MP3 chỉ trong chưa đầy 2 giây.',
  card3Title: 'Bản Quyền Thương Mại',
  card3Desc: 'Sử dụng file MP3 tạo ra cho các dự án kiếm tiền YouTube, TikTok Ads mà không lo bị vi phạm bản quyền.',
  voicesTitle: 'Khám Phá Các Giọng Đọc Đầy Cảm Xúc',
  pricingTag: 'BẢNG GIÁ MINH BẠCH',
  pricingTitle: 'Lựa Chọn Gói Phù Hợp Với Bạn',
  faqTag: 'GIẢI ĐÁP THẮC MẮC',
  faqTitle: 'Câu Hỏi Thường Gặp (FAQ)',
  faqs: [
    {
      q: 'Giọng đọc AI tại đây có bản quyền không?',
      a: 'Tất cả các file âm thanh được tạo ra tại Veltrix Voice đều thuộc quyền sở hữu của bạn. Bạn hoàn toàn có thể sử dụng làm video thương mại trên YouTube, TikTok, Facebook mà không lo vi phạm bản quyền.'
    },
    {
      q: 'Cách tính hạn mức sử dụng như thế nào?',
      a: 'Mỗi tài khoản miễn phí sẽ được cấp hạn mức 2,000 ký tự mỗi ngày. Hạn mức sẽ tự động được làm mới lại 2,000 ký tự vào 00:00 đêm hàng ngày.'
    }
  ],
  footer: '© 2026 Veltrix Voice Platform. Tất cả quyền được bảo lưu.'
};

export default function PageManagement() {
  const [activeSlug, setActiveSlug] = useState('landing');
  const [activeLang, setActiveLang] = useState('vi'); 
  const [languagesList, setLanguagesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    loadLanguages();
  }, []);

  useEffect(() => {
    fetchPageContent(activeSlug);
  }, [activeSlug]);

  const loadLanguages = async () => {
    try {
      const res = await adminService.getLanguages();
      const fetchedLangs = res.data?.languages || [];
      const activeLangs = fetchedLangs.length > 0 ? fetchedLangs.filter(l => l.isActive) : [
        { code: 'vi', name: 'Tiếng Việt 🇻🇳', isActive: true },
        { code: 'en', name: 'English 🇬🇧', isActive: true },
        { code: 'ja', name: '日本語 (Tiếng Nhật) 🇯🇵', isActive: true },
        { code: 'ko', name: '한국어 (Tiếng Hàn) 🇰🇷', isActive: true },
        { code: 'zh', name: '中文 (Tiếng Trung) 🇨🇳', isActive: true },
        { code: 'fr', name: 'Français (Tiếng Pháp) 🇫🇷', isActive: true }
      ];
      setLanguagesList(activeLangs);
      if (activeLangs.length > 0 && !activeLangs.find(l => l.code === activeLang)) {
        setActiveLang(activeLangs[0].code);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách ngôn ngữ:", err);
      setLanguagesList([
        { code: 'vi', name: 'Tiếng Việt 🇻🇳', isActive: true },
        { code: 'en', name: 'English 🇬🇧', isActive: true }
      ]);
    }
  };

  const fetchPageContent = async (slug) => {
    setLoading(true);
    try {
      const res = await adminService.getPageContent(slug);
      const data = res.data?.page || {};
      let pageTranslations = data.translations || {};

      if (Object.keys(pageTranslations).length === 0) {
        pageTranslations = {
          vi: { ...DEFAULT_LANG_DATA },
          en: {
            navHome: 'Home',
            navDashboard: 'Dashboard',
            navFeatures: 'Features',
            navVoices: 'AI Voices',
            navPricing: 'Pricing',
            navFaq: 'FAQ',
            navDonate: 'Buy me a Coffee ☕',
            navStudio: 'Try Studio 🚀',
            navLogout: 'Logout',
            heroBadge: data.heroBadgeEn || 'Top-tier AI Text-to-Speech Technology',
            heroTitle: data.heroTitleEn || 'Create AI Voices',
            heroTitleHl1: data.heroTitleHl1En || 'Vivid',
            heroTitleHl2: data.heroTitleHl2En || 'Natural as Human',
            heroSubtitle: data.heroSubtitleEn || 'Veltrix Voice platform helps you turn any text into high-quality MP3 audio in seconds.',
            heroCtaMain: data.heroCtaMainEn || 'Try It Now',
            heroCtaSecondary: data.heroCtaSecondaryEn || 'Listen to Samples',
            featuresTag: data.featuresTagEn || 'OUTSTANDING FEATURES',
            featuresTitle: data.featuresTitleEn || 'Why Choose Veltrix Voice?',
            card1Title: data.card1TitleEn || 'Neural AI Voices',
            card1Desc: data.card1DescEn || 'Advanced deep learning models pronounce accurately with pauses.',
            card2Title: data.card2TitleEn || 'Lightning Fast',
            card2Desc: data.card2DescEn || 'Powerful Cloud Server system converts text to MP3 in seconds.',
            card3Title: data.card3TitleEn || 'Commercial Rights',
            card3Desc: data.card3DescEn || 'Use generated MP3 files for monetized YouTube and TikTok Ads.',
            faqTag: data.faqTagEn || 'FREQUENTLY ASKED QUESTIONS',
            faqTitle: data.faqTitleEn || 'Frequently Asked Questions (FAQ)',
            faqs: (data.faqs || []).map(f => ({ q: f.qEn, a: f.aEn })),
            footer: data.footerEn || '© 2026 Veltrix Voice Platform. All rights reserved.'
          }
        };
      }

      setTranslations(pageTranslations);
    } catch (err) {
      console.error("Lỗi lấy nội dung trang:", err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tải trang',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    } finally {
      setLoading(false);
    }
  };

  const getLangData = (langCode) => {
    return translations[langCode] || { ...DEFAULT_LANG_DATA, faqs: [...DEFAULT_LANG_DATA.faqs] };
  };

  const handleFieldChange = (field, value) => {
    setTranslations(prev => {
      const currentLangData = prev[activeLang] || { ...DEFAULT_LANG_DATA };
      return {
        ...prev,
        [activeLang]: {
          ...currentLangData,
          [field]: value
        }
      };
    });
  };

  const handleFaqChange = (index, field, value) => {
    setTranslations(prev => {
      const currentLangData = prev[activeLang] || { ...DEFAULT_LANG_DATA };
      const updatedFaqs = [...(currentLangData.faqs || [])];
      updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
      return {
        ...prev,
        [activeLang]: {
          ...currentLangData,
          faqs: updatedFaqs
        }
      };
    });
  };

  const handleAddFaq = () => {
    setTranslations(prev => {
      const currentLangData = prev[activeLang] || { ...DEFAULT_LANG_DATA };
      return {
        ...prev,
        [activeLang]: {
          ...currentLangData,
          faqs: [
            ...(currentLangData.faqs || []),
            { q: '', a: '' }
          ]
        }
      };
    });
  };

  const handleRemoveFaq = (index) => {
    setTranslations(prev => {
      const currentLangData = prev[activeLang] || { ...DEFAULT_LANG_DATA };
      const updatedFaqs = (currentLangData.faqs || []).filter((_, i) => i !== index);
      return {
        ...prev,
        [activeLang]: {
          ...currentLangData,
          faqs: updatedFaqs
        }
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const viData = translations.vi || {};
      const enData = translations.en || {};

      const payload = {
        translations,
        heroBadgeVi: viData.heroBadge,
        heroBadgeEn: enData.heroBadge,
        heroTitleVi: viData.heroTitle,
        heroTitleEn: enData.heroTitle,
        heroTitleHl1Vi: viData.heroTitleHl1,
        heroTitleHl1En: enData.heroTitleHl1,
        heroTitleHl2Vi: viData.heroTitleHl2,
        heroTitleHl2En: enData.heroTitleHl2,
        heroSubtitleVi: viData.heroSubtitle,
        heroSubtitleEn: enData.heroSubtitle,
        heroCtaMainVi: viData.heroCtaMain,
        heroCtaMainEn: enData.heroCtaMain,
        heroCtaSecondaryVi: viData.heroCtaSecondary,
        heroCtaSecondaryEn: enData.heroCtaSecondary,
        featuresTagVi: viData.featuresTag,
        featuresTagEn: enData.featuresTag,
        featuresTitleVi: viData.featuresTitle,
        featuresTitleEn: enData.featuresTitle,
        card1TitleVi: viData.card1Title,
        card1TitleEn: enData.card1Title,
        card1DescVi: viData.card1Desc,
        card1DescEn: enData.card1Desc,
        card2TitleVi: viData.card2Title,
        card2TitleEn: enData.card2Title,
        card2DescVi: viData.card2Desc,
        card2DescEn: enData.card2Desc,
        card3TitleVi: viData.card3Title,
        card3TitleEn: enData.card3Title,
        card3DescVi: viData.card3Desc,
        card3DescEn: enData.card3Desc,
        faqTagVi: viData.faqTag,
        faqTagEn: enData.faqTag,
        faqTitleVi: viData.faqTitle,
        faqTitleEn: enData.faqTitle,
        footerVi: viData.footer,
        footerEn: enData.footer
      };

      const res = await adminService.updatePageContent(activeSlug, payload);
      Swal.fire({
        icon: 'success',
        title: 'Đã lưu thay đổi thành công!',
        text: res.data?.message || 'Nội dung trang đã được cập nhật thành công.',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi lưu dữ liệu',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    } finally {
      setSaving(false);
    }
  };

  // 📥 Tải File Mẫu Bản Dịch JSON
  const handleDownloadTemplate = () => {
    const currentData = getLangData(activeLang);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `veltrix_translation_${activeLang}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    Swal.fire({
      icon: 'success',
      title: 'Đã Tải File Mẫu Dịch!',
      text: `File mẫu veltrix_translation_${activeLang}.json đã được tải về thành công. Bạn hãy điền dịch nghĩa vào và chọn Nhập Tệp để điền tự động.`,
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      timer: 3000,
      showConfirmButton: false
    });
  };

  // 📤 Nhập File Bản Dịch JSON / TXT Đã Chỉnh Sửa
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const textContent = event.target.result;
        let parsedData = {};

        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(textContent);
        } else {
          // Parse TXT format key=value line by line
          const lines = textContent.split(/\r?\n/);
          lines.forEach(line => {
            const index = line.indexOf(':') !== -1 ? line.indexOf(':') : line.indexOf('=');
            if (index !== -1) {
              const key = line.substring(0, index).trim();
              const val = line.substring(index + 1).trim();
              if (key) parsedData[key] = val;
            }
          });
        }

        const count = Object.keys(parsedData).length;
        if (count === 0) {
          throw new Error("Tệp không chứa dữ liệu hợp lệ!");
        }

        setTranslations(prev => {
          const existing = prev[activeLang] || { ...DEFAULT_LANG_DATA };
          return {
            ...prev,
            [activeLang]: {
              ...existing,
              ...parsedData
            }
          };
        });

        Swal.fire({
          icon: 'success',
          title: 'Nhập Bản Dịch Thành Công! 🎉',
          text: `Đã nạp tự động ${count} trường dữ liệu vào ngôn ngữ [${activeLang.toUpperCase()}]! Hãy bấm "Lưu Thay Đổi" để áp dụng.`,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi Đọc File',
          text: 'Tệp tải lên không đúng định dạng JSON/TXT hợp lệ! Lỗi: ' + err.message,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)'
        });
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const currentLangContent = getLangData(activeLang);
  const activeLangObj = languagesList.find(l => l.code === activeLang);

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    letterSpacing: '0.2px'
  };

  const cardContainerStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '32px'
  };

  return (
    <AdminLayout>
      <div style={{ padding: '28px 36px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ padding: '10px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex' }}>
                <Globe size={24} color="var(--primary-purple)" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                Quản Lý Nội Dung Trang Web
              </h1>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Biên tập trực tiếp thanh điều hướng Header, tiêu đề, mô tả, tính năng & FAQ đa ngôn ngữ tự động cho Landing Page.
            </p>
          </div>

          <button 
            className="btn-cta" 
            onClick={handleSave} 
            disabled={saving || loading}
            style={{ fontSize: '14px', padding: '12px 28px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)' }}
          >
            {saving ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
            Lưu Thay Đổi
          </button>
        </div>

        {/* Page Selector Tabs */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveSlug('landing')}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              border: activeSlug === 'landing' ? '1px solid var(--primary-purple)' : '1px solid transparent',
              background: activeSlug === 'landing' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
              color: activeSlug === 'landing' ? 'var(--primary-purple)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} /> 🚀 Landing Page
          </button>
        </div>

        {/* Dynamic Languages Tabs Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '16px 24px', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={18} color="#06b6d4" /> Đang cấu hình ngôn ngữ: <span style={{ color: 'var(--primary-purple)', background: 'rgba(168, 85, 247, 0.15)', padding: '3px 12px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>{activeLangObj?.name || activeLang.toUpperCase()}</span>
            </div>

            {/* Quick Import / Export Tools */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleDownloadTemplate}
                className="btn-small" 
                style={{ fontSize: '12px', padding: '6px 14px', background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Tải về file JSON mẫu để điền bản dịch nghĩa siêu nhanh"
              >
                <Download size={14} /> Tải Mẫu Dịch (.json)
              </button>

              <label 
                className="btn-small" 
                style={{ fontSize: '12px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                title="Tải lên tệp JSON/TXT chứa bản dịch đã điền để tự động chèn vào Form"
              >
                <Upload size={14} /> Nhập File Dịch (.json/.txt)
                <input 
                  type="file" 
                  accept=".json,.txt" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-input)', padding: '5px', borderRadius: '14px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
            {languagesList.map((lang) => {
              const isSelected = activeLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '13px',
                    border: 'none',
                    background: isSelected ? 'var(--primary-purple)' : 'transparent',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <RefreshCw size={32} className="spin" color="var(--primary-purple)" />
            <p style={{ marginTop: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Đang nạp dữ liệu từ máy chủ...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 0. NAVBAR HEADER NAVIGATION SECTION */}
            <div style={cardContainerStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Menu size={20} color="#10b981" /> 0. Thanh Điều Hướng Header (Navbar Menu Items) ({activeLangObj?.name || activeLang.toUpperCase()})
              </h3>

              {/* Row 1: Home & Dashboard */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Nút Trang Chủ (Home):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.navHome || ''}
                    onChange={(e) => handleFieldChange('navHome', e.target.value)}
                    placeholder="Trang chủ / Home / ホーム..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nút Dashboard (Bảng điều khiển):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.navDashboard || ''}
                    onChange={(e) => handleFieldChange('navDashboard', e.target.value)}
                    placeholder="Dashboard / ダッシュボード..."
                  />
                </div>
              </div>

              {/* Row 2: Features, AI Voices, Pricing, FAQ */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>Mục Features (Tính năng):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.navFeatures || ''}
                    onChange={(e) => handleFieldChange('navFeatures', e.target.value)}
                    placeholder="Tính năng..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Mục AI Voices (Giọng đọc AI):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.navVoices || ''}
                    onChange={(e) => handleFieldChange('navVoices', e.target.value)}
                    placeholder="Giọng đọc AI..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Mục Pricing (Bảng giá):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.navPricing || ''}
                    onChange={(e) => handleFieldChange('navPricing', e.target.value)}
                    placeholder="Bảng giá..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Mục FAQ (Hỏi đáp):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.navFaq || ''}
                    onChange={(e) => handleFieldChange('navFaq', e.target.value)}
                    placeholder="Hỏi đáp..."
                  />
                </div>
              </div>

              {/* Row 3: Donate, Studio, Logout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Nút Donate Cà Phê (Donate Button):</label>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, borderLeft: '4px solid #f59e0b' }}
                    value={currentLangContent.navDonate || ''}
                    onChange={(e) => handleFieldChange('navDonate', e.target.value)}
                    placeholder="Donate Cà Phê ☕..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nút Vào Studio (Studio CTA Button):</label>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, borderLeft: '4px solid #8b5cf6' }}
                    value={currentLangContent.navStudio || ''}
                    onChange={(e) => handleFieldChange('navStudio', e.target.value)}
                    placeholder="Vào Studio 🚀..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nút Đăng Xuất (Logout Button):</label>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, borderLeft: '4px solid #ef4444' }}
                    value={currentLangContent.navLogout || ''}
                    onChange={(e) => handleFieldChange('navLogout', e.target.value)}
                    placeholder="Đăng xuất / Logout / ログアウト..."
                  />
                </div>
              </div>
            </div>
            
            {/* 1. HERO BANNER SECTION */}
            <div style={cardContainerStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="#c084fc" /> 1. Hero Banner Top (Nội dung: {activeLangObj?.name || activeLang.toUpperCase()})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Huy Hiệu Nổi Bật (Hero Badge):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.heroBadge || ''}
                    onChange={(e) => handleFieldChange('heroBadge', e.target.value)}
                    placeholder="Ví dụ: Công Nghệ Chuyển Văn Bản AI..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tiêu Đề Đầu (Hero Title Start):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.heroTitle || ''}
                    onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                    placeholder="Ví dụ: Tạo Giọng Đọc AI..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Cụm Từ Nổi Bật 1 (Highlight 1 - Màu Tím):</label>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, borderLeft: '4px solid #c084fc' }}
                    value={currentLangContent.heroTitleHl1 || ''}
                    onChange={(e) => handleFieldChange('heroTitleHl1', e.target.value)}
                    placeholder="Ví dụ: Sống Động..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Cụm Từ Nổi Bật 2 (Highlight 2 - Màu Xanh):</label>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, borderLeft: '4px solid #06b6d4' }}
                    value={currentLangContent.heroTitleHl2 || ''}
                    onChange={(e) => handleFieldChange('heroTitleHl2', e.target.value)}
                    placeholder="Ví dụ: Tự Nhiên Như Người Thật..."
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Đoạn Văn Giới Thiệu (Hero Subtitle):</label>
                <textarea 
                  style={{ ...inputStyle, lineHeight: '1.6', resize: 'vertical' }}
                  rows={3}
                  value={currentLangContent.heroSubtitle || ''}
                  onChange={(e) => handleFieldChange('heroSubtitle', e.target.value)}
                  placeholder="Nền tảng Veltrix Voice giúp bạn biến mọi văn bản thành..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>Nút Nổi Bật 1 (Main CTA Button):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.heroCtaMain || ''}
                    onChange={(e) => handleFieldChange('heroCtaMain', e.target.value)}
                    placeholder="Dùng Thử Ngay..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nút Nổi Bật 2 (Secondary CTA Button):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.heroCtaSecondary || ''}
                    onChange={(e) => handleFieldChange('heroCtaSecondary', e.target.value)}
                    placeholder="Nghe Mẫu Giọng Đọc..."
                  />
                </div>
              </div>
            </div>

            {/* 2. FEATURES SECTION */}
            <div style={cardContainerStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} color="#06b6d4" /> 2. Section Tính Năng Vượt Trội ({activeLangObj?.name || activeLang.toUpperCase()})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Thẻ Phụ Đầu Section (Features Tag):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.featuresTag || ''}
                    onChange={(e) => handleFieldChange('featuresTag', e.target.value)}
                    placeholder="TÍNH NĂNG VƯỢT TRỘI..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tiêu Đề Section (Features Title):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.featuresTitle || ''}
                    onChange={(e) => handleFieldChange('featuresTitle', e.target.value)}
                    placeholder="Tại Sao Nên Chọn Veltrix Voice?..."
                  />
                </div>
              </div>

              {/* Cards 1, 2, 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                
                <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#c084fc', marginBottom: '14px' }}>Thẻ 1 (Card 1)</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Tiêu đề:</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.card1Title || ''}
                      onChange={(e) => handleFieldChange('card1Title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Mô tả:</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.5', resize: 'vertical' }}
                      rows={3}
                      value={currentLangContent.card1Desc || ''}
                      onChange={(e) => handleFieldChange('card1Desc', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#06b6d4', marginBottom: '14px' }}>Thẻ 2 (Card 2)</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Tiêu đề:</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.card2Title || ''}
                      onChange={(e) => handleFieldChange('card2Title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Mô tả:</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.5', resize: 'vertical' }}
                      rows={3}
                      value={currentLangContent.card2Desc || ''}
                      onChange={(e) => handleFieldChange('card2Desc', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#10b981', marginBottom: '14px' }}>Thẻ 3 (Card 3)</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Tiêu đề:</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.card3Title || ''}
                      onChange={(e) => handleFieldChange('card3Title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Mô tả:</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.5', resize: 'vertical' }}
                      rows={3}
                      value={currentLangContent.card3Desc || ''}
                      onChange={(e) => handleFieldChange('card3Desc', e.target.value)}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 3. SHOWCASE GIỌNG ĐỌC AI SECTION */}
            <div style={cardContainerStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="#a855f7" /> 3. Section Giọng Đọc AI ({activeLangObj?.name || activeLang.toUpperCase()})
              </h3>

              <div>
                <label style={labelStyle}>Tiêu Đề Section Giọng Đọc AI (Voices Title):</label>
                <input 
                  type="text" 
                  style={inputStyle}
                  value={currentLangContent.voicesTitle || ''}
                  onChange={(e) => handleFieldChange('voicesTitle', e.target.value)}
                  placeholder="Khám Phá Các Giọng Đọc Đầy Cảm Xúc..."
                />
              </div>
            </div>

            {/* 4. PRICING SECTION */}
            <div style={cardContainerStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="#10b981" /> 4. Section Bảng Giá ({activeLangObj?.name || activeLang.toUpperCase()})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>Thẻ Phụ Đầu Section (Pricing Tag):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.pricingTag || ''}
                    onChange={(e) => handleFieldChange('pricingTag', e.target.value)}
                    placeholder="BẢNG GIÁ MINH BẠCH..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tiêu Đề Section (Pricing Title):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.pricingTitle || ''}
                    onChange={(e) => handleFieldChange('pricingTitle', e.target.value)}
                    placeholder="Lựa Chọn Gói Phù Hợp Với Bạn..."
                  />
                </div>
              </div>
            </div>

            {/* 5. DYNAMIC FAQ SECTION */}
            <div style={cardContainerStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HelpCircle size={20} color="#f59e0b" /> 5. Danh Sách Câu Hỏi FAQ ({activeLangObj?.name || activeLang.toUpperCase()})
                </h3>

                <button 
                  className="btn-small" 
                  onClick={handleAddFaq}
                  style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '13px', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Thêm Câu Hỏi Mới
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
                <div>
                  <label style={labelStyle}>FAQ Tag Line:</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.faqTag || ''}
                    onChange={(e) => handleFieldChange('faqTag', e.target.value)}
                    placeholder="GIẢI ĐÁP THẮC MẮC..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>FAQ Section Header Title:</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={currentLangContent.faqTitle || ''}
                    onChange={(e) => handleFieldChange('faqTitle', e.target.value)}
                    placeholder="Câu Hỏi Thường Gặp (FAQ)..."
                  />
                </div>
              </div>

              {/* Loop Dynamic FAQs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(currentLangContent.faqs || []).map((faqItem, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '20px',
                      padding: '24px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-purple)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <QuestionIcon size={16} /> Câu Hỏi #{idx + 1}
                      </span>
                      
                      {(currentLangContent.faqs || []).length > 1 && (
                        <button 
                          className="btn-small" 
                          onClick={() => handleRemoveFaq(idx)}
                          style={{ color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px' }}
                        >
                          <Trash2 size={14} /> Xóa Câu Hỏi
                        </button>
                      )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={labelStyle}>Nội dung câu hỏi ({activeLangObj?.name || activeLang.toUpperCase()}):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={faqItem.q || ''}
                        onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                        placeholder="Nhập câu hỏi tại đây..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nội dung câu trả lời ({activeLangObj?.name || activeLang.toUpperCase()}):</label>
                      <textarea 
                        style={{ ...inputStyle, lineHeight: '1.6', resize: 'vertical' }}
                        rows={3}
                        value={faqItem.a || ''}
                        onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                        placeholder="Nhập nội dung câu trả lời chi tiết tại đây..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. FOOTER */}
            <div style={cardContainerStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="#10b981" /> 4. Chân Trang (Footer Text) ({activeLangObj?.name || activeLang.toUpperCase()})
              </h3>
              <input 
                type="text" 
                style={inputStyle}
                value={currentLangContent.footer || ''}
                onChange={(e) => handleFieldChange('footer', e.target.value)}
                placeholder="© 2026 Veltrix Voice Platform..."
              />
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}
