import React, { useState, useEffect } from 'react';
import { 
  Globe, Save, Sparkles, HelpCircle, Layers, ShieldCheck, 
  Zap, Check, RefreshCw, Eye, FileText, Plus, Trash2, HelpCircle as QuestionIcon
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
      const data = res.data?.page || {};
      if (!data.faqs || !Array.isArray(data.faqs) || data.faqs.length === 0) {
        data.faqs = [
          {
            qVi: 'Giọng đọc AI tại đây có bản quyền không?',
            qEn: 'Are AI generated voices royalty-free?',
            aVi: 'Tất cả các file âm thanh được tạo ra tại Veltrix Voice đều thuộc quyền sở hữu của bạn. Bạn hoàn toàn có thể sử dụng làm video thương mại trên YouTube, TikTok, Facebook mà không lo vi phạm bản quyền.',
            aEn: 'All audio files generated on Veltrix Voice belong entirely to you. You can use them freely on commercial videos for YouTube, TikTok, Facebook without copyright issues.'
          },
          {
            qVi: 'Cách tính hạn mức sử dụng như thế nào?',
            qEn: 'How does the daily character limit work?',
            aVi: 'Mỗi tài khoản miễn phí sẽ được cấp hạn mức 2,000 ký tự mỗi ngày. Hạn mức sẽ tự động được làm mới lại 2,000 ký tự vào 00:00 đêm hàng ngày.',
            aEn: 'Every free account is granted 2,000 characters daily. The character limit is automatically reset to 2,000 characters at 00:00 UTC daily.'
          }
        ];
      }
      setFormData(data);
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

  const handleFaqChange = (index, field, value) => {
    setFormData(prev => {
      const updatedFaqs = [...(prev.faqs || [])];
      updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const handleAddFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        { qVi: '', qEn: '', aVi: '', aEn: '' }
      ]
    }));
  };

  const handleRemoveFaq = (index) => {
    setFormData(prev => {
      const updatedFaqs = (prev.faqs || []).filter((_, i) => i !== index);
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminService.updatePageContent(activeSlug, formData);
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

  const isVi = activeLang === 'vi';

  const inputStyle = {
    width: '100%',
    background: 'rgba(15, 17, 26, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: '8px',
    letterSpacing: '0.2px'
  };

  return (
    <AdminLayout>
      <div style={{ padding: '28px 36px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ padding: '10px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex' }}>
                <Globe size={24} color="#c084fc" />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#fff', letterSpacing: '-0.5px' }}>
                Quản Lý Nội Dung Trang Web
              </h1>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Biên tập trực tiếp tiêu đề, mô tả, tính năng & thêm bớt câu hỏi FAQ trên Landing Page.
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
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveSlug('landing')}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              border: activeSlug === 'landing' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
              background: activeSlug === 'landing' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)' : 'transparent',
              color: activeSlug === 'landing' ? '#c084fc' : 'var(--text-secondary)',
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

        {/* Language Tabs Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '14px 24px', marginBottom: '32px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="#06b6d4" /> Đang cấu hình giao diện: <span style={{ color: '#c084fc', background: 'rgba(168, 85, 247, 0.15)', padding: '3px 12px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>Landing Page</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: '#0a0c14', padding: '5px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => setActiveLang('vi')}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                background: isVi ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : 'transparent',
                color: isVi ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🇻🇳 Bản Tiếng Việt
            </button>
            <button
              onClick={() => setActiveLang('en')}
              style={{
                padding: '8px 20px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                background: !isVi ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' : 'transparent',
                color: !isVi ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🇬🇧 English Version
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <RefreshCw size={32} className="spin" color="#c084fc" />
            <p style={{ marginTop: '14px', fontWeight: '600', color: '#fff' }}>Đang nạp dữ liệu từ máy chủ...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* 1. HERO BANNER SECTION */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="#c084fc" /> 1. Hero Banner Top (Đầu Trang) ({isVi ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Huy Hiệu Nổi Bật (Hero Badge):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={isVi ? (formData.heroBadgeVi || '') : (formData.heroBadgeEn || '')}
                    onChange={(e) => handleChange(isVi ? 'heroBadgeVi' : 'heroBadgeEn', e.target.value)}
                    placeholder="Ví dụ: Công Nghệ Chuyển Văn Bản AI..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tiêu Đề Đầu (Hero Title Start):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={isVi ? (formData.heroTitleVi || '') : (formData.heroTitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'heroTitleVi' : 'heroTitleEn', e.target.value)}
                    placeholder="Ví dụ: Tạo Giọng Đọc AI..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Cụm Từ Nổi Bật 1 (Highlight 1 - Màu Tím):</label>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, borderLeft: '3px solid #c084fc' }}
                    value={isVi ? (formData.heroTitleHl1Vi || '') : (formData.heroTitleHl1En || '')}
                    onChange={(e) => handleChange(isVi ? 'heroTitleHl1Vi' : 'heroTitleHl1En', e.target.value)}
                    placeholder="Ví dụ: Sống Động / Vivid..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Cụm Từ Nổi Bật 2 (Highlight 2 - Màu Xanh):</label>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, borderLeft: '3px solid #06b6d4' }}
                    value={isVi ? (formData.heroTitleHl2Vi || '') : (formData.heroTitleHl2En || '')}
                    onChange={(e) => handleChange(isVi ? 'heroTitleHl2Vi' : 'heroTitleHl2En', e.target.value)}
                    placeholder="Ví dụ: Tự Nhiên Như Người Thật..."
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Đoạn Văn Giới Thiệu (Hero Subtitle):</label>
                <textarea 
                  style={{ ...inputStyle, lineHeight: '1.6', resize: 'vertical' }}
                  rows={3}
                  value={isVi ? (formData.heroSubtitleVi || '') : (formData.heroSubtitleEn || '')}
                  onChange={(e) => handleChange(isVi ? 'heroSubtitleVi' : 'heroSubtitleEn', e.target.value)}
                  placeholder="Nền tảng Veltrix Voice giúp bạn biến mọi văn bản thành..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>Nút Nổi Bật 1 (Main CTA Button):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={isVi ? (formData.heroCtaMainVi || '') : (formData.heroCtaMainEn || '')}
                    onChange={(e) => handleChange(isVi ? 'heroCtaMainVi' : 'heroCtaMainEn', e.target.value)}
                    placeholder="Dùng Thử Ngay..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Nút Nổi Bật 2 (Secondary CTA Button):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={isVi ? (formData.heroCtaSecondaryVi || '') : (formData.heroCtaSecondaryEn || '')}
                    onChange={(e) => handleChange(isVi ? 'heroCtaSecondaryVi' : 'heroCtaSecondaryEn', e.target.value)}
                    placeholder="Nghe Mẫu Giọng Đọc..."
                  />
                </div>
              </div>
            </div>

            {/* 2. FEATURES SECTION */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={20} color="#06b6d4" /> 2. Section Tính Năng Vượt Trội (Features Grid) ({isVi ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Thẻ Phụ Đầu Section (Features Tag):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={isVi ? (formData.featuresTagVi || '') : (formData.featuresTagEn || '')}
                    onChange={(e) => handleChange(isVi ? 'featuresTagVi' : 'featuresTagEn', e.target.value)}
                    placeholder="TÍNH NĂNG VƯỢT TRỘI..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Tiêu Đề Section (Features Title):</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={isVi ? (formData.featuresTitleVi || '') : (formData.featuresTitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'featuresTitleVi' : 'featuresTitleEn', e.target.value)}
                    placeholder="Tại Sao Nên Chọn Veltrix Voice?..."
                  />
                </div>
              </div>

              {/* Cards 1, 2, 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                
                <div style={{ background: 'rgba(15, 17, 26, 0.6)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#c084fc', marginBottom: '14px' }}>Thẻ 1 (Card 1)</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Tiêu đề:</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={isVi ? (formData.card1TitleVi || '') : (formData.card1TitleEn || '')}
                      onChange={(e) => handleChange(isVi ? 'card1TitleVi' : 'card1TitleEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Mô tả:</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.5', resize: 'vertical' }}
                      rows={3}
                      value={isVi ? (formData.card1DescVi || '') : (formData.card1DescEn || '')}
                      onChange={(e) => handleChange(isVi ? 'card1DescVi' : 'card1DescEn', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 17, 26, 0.6)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#06b6d4', marginBottom: '14px' }}>Thẻ 2 (Card 2)</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Tiêu đề:</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={isVi ? (formData.card2TitleVi || '') : (formData.card2TitleEn || '')}
                      onChange={(e) => handleChange(isVi ? 'card2TitleVi' : 'card2TitleEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Mô tả:</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.5', resize: 'vertical' }}
                      rows={3}
                      value={isVi ? (formData.card2DescVi || '') : (formData.card2DescEn || '')}
                      onChange={(e) => handleChange(isVi ? 'card2DescVi' : 'card2DescEn', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 17, 26, 0.6)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#10b981', marginBottom: '14px' }}>Thẻ 3 (Card 3)</h4>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Tiêu đề:</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={isVi ? (formData.card3TitleVi || '') : (formData.card3TitleEn || '')}
                      onChange={(e) => handleChange(isVi ? 'card3TitleVi' : 'card3TitleEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: '12px' }}>Mô tả:</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.5', resize: 'vertical' }}
                      rows={3}
                      value={isVi ? (formData.card3DescVi || '') : (formData.card3DescEn || '')}
                      onChange={(e) => handleChange(isVi ? 'card3DescVi' : 'card3DescEn', e.target.value)}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 3. DYNAMIC FAQ SECTION */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HelpCircle size={20} color="#f59e0b" /> 3. Quản Lý Danh Sách Câu Hỏi FAQ ({isVi ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'})
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
                    value={isVi ? (formData.faqTagVi || '') : (formData.faqTagEn || '')}
                    onChange={(e) => handleChange(isVi ? 'faqTagVi' : 'faqTagEn', e.target.value)}
                    placeholder="GIẢI ĐÁP THẮC MẮC..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>FAQ Section Header Title:</label>
                  <input 
                    type="text" 
                    style={inputStyle}
                    value={isVi ? (formData.faqTitleVi || '') : (formData.faqTitleEn || '')}
                    onChange={(e) => handleChange(isVi ? 'faqTitleVi' : 'faqTitleEn', e.target.value)}
                    placeholder="Câu Hỏi Thường Gặp (FAQ)..."
                  />
                </div>
              </div>

              {/* Loop Dynamic FAQs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(formData.faqs || []).map((faqItem, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(15, 17, 26, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      padding: '24px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <QuestionIcon size={16} /> Câu Hỏi #{idx + 1}
                      </span>
                      
                      {(formData.faqs || []).length > 1 && (
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
                      <label style={labelStyle}>Nội dung câu hỏi ({isVi ? 'Tiếng Việt' : 'Tiếng Anh'}):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={isVi ? (faqItem.qVi || '') : (faqItem.qEn || '')}
                        onChange={(e) => handleFaqChange(idx, isVi ? 'qVi' : 'qEn', e.target.value)}
                        placeholder="Nhập câu hỏi tại đây..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nội dung câu trả lời ({isVi ? 'Tiếng Việt' : 'Tiếng Anh'}):</label>
                      <textarea 
                        style={{ ...inputStyle, lineHeight: '1.6', resize: 'vertical' }}
                        rows={3}
                        value={isVi ? (faqItem.aVi || '') : (faqItem.aEn || '')}
                        onChange={(e) => handleFaqChange(idx, isVi ? 'aVi' : 'aEn', e.target.value)}
                        placeholder="Nhập nội dung câu trả lời chi tiết tại đây..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. FOOTER */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="#10b981" /> 4. Chân Trang (Footer Copyright Text) ({isVi ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'})
              </h3>
              <input 
                type="text" 
                style={inputStyle}
                value={isVi ? (formData.footerVi || '') : (formData.footerEn || '')}
                onChange={(e) => handleChange(isVi ? 'footerVi' : 'footerEn', e.target.value)}
                placeholder="© 2026 Veltrix Voice Platform..."
              />
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}
