import React, { useState, useEffect } from 'react';
import { 
  Globe, Save, Sparkles, HelpCircle, Layers, ShieldCheck, 
  Zap, Check, RefreshCw, Eye, FileText
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';

export default function PageManagement() {
  const [activeSlug, setActiveSlug] = useState('landing');
  const [activeLang, setActiveLang] = useState('vi'); // 'vi' | 'en'
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchPageContent = async (slug) => {
    setLoading(true);
    try {
      const res = await adminService.getPageContent(slug);
      setFormData(res.data?.page || {});
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

  useEffect(() => {
    fetchPageContent(activeSlug);
  }, [activeSlug]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminService.updatePageContent(activeSlug, formData);
      Swal.fire({
        icon: 'success',
        title: 'Đã lưu thay đổi!',
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

  const isVi = activeLang === 'vi';

  return (
    <AdminLayout>
      <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex' }}>
                <Globe size={22} color="var(--primary-indigo)" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Quản Lý Nội Dung Trang Web
              </h1>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Chỉnh sửa trực tiếp tiêu đề, mô tả, tính năng và câu hỏi thường gặp hiển thị ở các trang người dùng.
            </p>
          </div>

          <button 
            className="btn-cta" 
            onClick={handleSave} 
            disabled={saving || loading}
            style={{ fontSize: '14px', padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {saving ? <RefreshCw size={18} className="spin" /> : <Save size={18} />}
            Lưu Thay Đổi
          </button>
        </div>

        {/* Page Selector Tabs */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveSlug('landing')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              border: activeSlug === 'landing' ? '1px solid var(--primary-indigo)' : '1px solid transparent',
              background: activeSlug === 'landing' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeSlug === 'landing' ? 'var(--primary-indigo)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} /> Trang Landing Page
          </button>
        </div>

        {/* Language Tabs Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '12px 20px', marginBottom: '28px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#06b6d4" /> Đang chỉnh sửa: <span style={{ color: '#c084fc' }}>Landing Page</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-input)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveLang('vi')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                background: isVi ? 'var(--primary-indigo)' : 'transparent',
                color: isVi ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🇻🇳 Bản Tiếng Việt
            </button>
            <button
              onClick={() => setActiveLang('en')}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                background: !isVi ? 'var(--primary-indigo)' : 'transparent',
                color: !isVi ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🇬🇧 English Version
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <RefreshCw size={32} className="spin" color="var(--primary-indigo)" />
            <p style={{ marginTop: '12px', fontWeight: '600' }}>Đang tải nội dung trang...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* 1. HERO BANNER SECTION */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '28px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#c084fc" /> 1. Hero Banner Top (Đầu Trang)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Huy Hiệu Nổi Bật (Hero Badge) ({isVi ? 'VI' : 'EN'}):
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.heroBadgeVi || '') : (formData.heroBadgeEn || '')}
                    onChange={(e) => handleChange(isVi ? 'heroBadgeVi' : 'heroBadgeEn', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Tiêu Đề Chính (Title Start) ({isVi ? 'VI' : 'EN'}):
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.heroTitleVi || '') : (formData.heroTitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'heroTitleVi' : 'heroTitleEn', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Cụm Từ Nổi Bật 1 (Màu Tím):
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.heroTitleHl1Vi || '') : (formData.heroTitleHl1En || '')}
                    onChange={(e) => handleChange(isVi ? 'heroTitleHl1Vi' : 'heroTitleHl1En', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Cụm Từ Nổi Bật 2 (Màu Xanh):
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.heroTitleHl2Vi || '') : (formData.heroTitleHl2En || '')}
                    onChange={(e) => handleChange(isVi ? 'heroTitleHl2Vi' : 'heroTitleHl2En', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Đoạn Văn Giới Thiệu (Hero Subtitle) ({isVi ? 'VI' : 'EN'}):
                </label>
                <textarea 
                  className="input-field"
                  rows={3}
                  value={isVi ? (formData.heroSubtitleVi || '') : (formData.heroSubtitleEn || '')}
                  onChange={(e) => handleChange(isVi ? 'heroSubtitleVi' : 'heroSubtitleEn', e.target.value)}
                  style={{ width: '100%', lineHeight: '1.5' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Nút Nổi Bật 1 (Main CTA):
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.heroCtaMainVi || '') : (formData.heroCtaMainEn || '')}
                    onChange={(e) => handleChange(isVi ? 'heroCtaMainVi' : 'heroCtaMainEn', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Nút Nổi Bật 2 (Secondary CTA):
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.heroCtaSecondaryVi || '') : (formData.heroCtaSecondaryEn || '')}
                    onChange={(e) => handleChange(isVi ? 'heroCtaSecondaryVi' : 'heroCtaSecondaryEn', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* 2. FEATURES SECTION */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '28px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#06b6d4" /> 2. Section Tính Năng Vượt Trội (Features Grid)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Thẻ Phụ (Section Tag):
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.featuresTagVi || '') : (formData.featuresTagEn || '')}
                    onChange={(e) => handleChange(isVi ? 'featuresTagVi' : 'featuresTagEn', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Tiêu Đề Section (Features Title):
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.featuresTitleVi || '') : (formData.featuresTitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'featuresTitleVi' : 'featuresTitleEn', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Cards 1, 2, 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                
                <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#c084fc', marginBottom: '12px' }}>Thẻ 1 (Card 1)</h4>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="Tiêu đề card 1"
                    value={isVi ? (formData.card1TitleVi || '') : (formData.card1TitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'card1TitleVi' : 'card1TitleEn', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <textarea 
                    className="input-field"
                    rows={3}
                    placeholder="Mô tả card 1"
                    value={isVi ? (formData.card1DescVi || '') : (formData.card1DescEn || '')}
                    onChange={(e) => handleChange(isVi ? 'card1DescVi' : 'card1DescEn', e.target.value)}
                    style={{ width: '100%', fontSize: '12.5px' }}
                  />
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#06b6d4', marginBottom: '12px' }}>Thẻ 2 (Card 2)</h4>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="Tiêu đề card 2"
                    value={isVi ? (formData.card2TitleVi || '') : (formData.card2TitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'card2TitleVi' : 'card2TitleEn', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <textarea 
                    className="input-field"
                    rows={3}
                    placeholder="Mô tả card 2"
                    value={isVi ? (formData.card2DescVi || '') : (formData.card2DescEn || '')}
                    onChange={(e) => handleChange(isVi ? 'card2DescVi' : 'card2DescEn', e.target.value)}
                    style={{ width: '100%', fontSize: '12.5px' }}
                  />
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>Thẻ 3 (Card 3)</h4>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="Tiêu đề card 3"
                    value={isVi ? (formData.card3TitleVi || '') : (formData.card3TitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'card3TitleVi' : 'card3TitleEn', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <textarea 
                    className="input-field"
                    rows={3}
                    placeholder="Mô tả card 3"
                    value={isVi ? (formData.card3DescVi || '') : (formData.card3DescEn || '')}
                    onChange={(e) => handleChange(isVi ? 'card3DescVi' : 'card3DescEn', e.target.value)}
                    style={{ width: '100%', fontSize: '12.5px' }}
                  />
                </div>

              </div>
            </div>

            {/* 3. FAQ SECTION */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '28px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} color="#f59e0b" /> 3. Section Câu Hỏi Thường Gặp (FAQ)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    FAQ Tag Line:
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.faqTagVi || '') : (formData.faqTagEn || '')}
                    onChange={(e) => handleChange(isVi ? 'faqTagVi' : 'faqTagEn', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    FAQ Title Header:
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={isVi ? (formData.faqTitleVi || '') : (formData.faqTitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'faqTitleVi' : 'faqTitleEn', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#c084fc', marginBottom: '10px' }}>Câu hỏi 1</h4>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="Câu hỏi 1..."
                    value={isVi ? (formData.faqQ1Vi || '') : (formData.faqQ1En || '')}
                    onChange={(e) => handleChange(isVi ? 'faqQ1Vi' : 'faqQ1En', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <textarea 
                    className="input-field"
                    rows={3}
                    placeholder="Câu trả lời 1..."
                    value={isVi ? (formData.faqA1Vi || '') : (formData.faqA1En || '')}
                    onChange={(e) => handleChange(isVi ? 'faqA1Vi' : 'faqA1En', e.target.value)}
                    style={{ width: '100%', fontSize: '12.5px' }}
                  />
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#06b6d4', marginBottom: '10px' }}>Câu hỏi 2</h4>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="Câu hỏi 2..."
                    value={isVi ? (formData.faqQ2Vi || '') : (formData.faqQ2En || '')}
                    onChange={(e) => handleChange(isVi ? 'faqQ2Vi' : 'faqQ2En', e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <textarea 
                    className="input-field"
                    rows={3}
                    placeholder="Câu trả lời 2..."
                    value={isVi ? (formData.faqA2Vi || '') : (formData.faqA2En || '')}
                    onChange={(e) => handleChange(isVi ? 'faqA2Vi' : 'faqA2En', e.target.value)}
                    style={{ width: '100%', fontSize: '12.5px' }}
                  />
                </div>
              </div>
            </div>

            {/* 4. FOOTER */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '28px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#10b981" /> 4. Chân Trang (Footer Copyright)
              </h3>
              <input 
                type="text" 
                className="input-field"
                value={isVi ? (formData.footerVi || '') : (formData.footerEn || '')}
                onChange={(e) => handleChange(isVi ? 'footerVi' : 'footerEn', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}
