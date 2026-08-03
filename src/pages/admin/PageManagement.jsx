import React, { useState, useEffect } from 'react';
import { 
  Globe, Save, Sparkles, HelpCircle, Layers, ShieldCheck, 
  Zap, Check, RefreshCw, Eye, FileText, Plus, Trash2, HelpCircle as QuestionIcon, Languages, Menu, Coffee, ArrowRight, Home, LayoutDashboard, LogOut, Download, Upload, Code
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

const DEFAULT_PRICING_LANG_DATA = {
  heroTitle: 'Nâng cấp để làm nhiều hơn',
  heroTitleHl1: 'làm nhiều hơn',
  heroSubtitle: 'Chọn gói dịch vụ phù hợp để tối ưu hóa quy trình sản xuất nội dung của bạn với công nghệ AI hàng đầu.',
  cycleMonthly: 'Theo tháng',
  cycleYearly: 'Theo năm',
  discountBadge: 'Tiết kiệm đến 70%',
  faqTitle: 'Câu hỏi thường gặp',
  faqs: [
    {
      q: 'Tôi có thể hủy gói đăng ký bất cứ lúc nào không?',
      a: 'Có, bạn có thể hủy gói đăng ký bất cứ lúc nào trong phần cài đặt tài khoản. Sau khi hủy, bạn vẫn có quyền truy cập vào các tính năng Pro cho đến hết chu kỳ thanh toán hiện tại.'
    },
    {
      q: 'Phút / Ký tự lượt đọc có được cộng dồn sang tháng sau không?',
      a: 'Hạn mức Token của các gói trả phí sẽ được làm mới hàng tháng và không cộng dồn. Với gói Miễn Phí, hạn mức 2,000 ký tự sẽ được tự động làm mới vào 00:00 đêm mỗi ngày.'
    },
    {
      q: 'Chính sách hoàn tiền của Veltrix Voice như thế nào?',
      a: 'Chúng tôi hỗ trợ hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với chất lượng dịch vụ và chưa sử dụng quá 10% hạn mức Token của gói.'
    },
    {
      q: 'Tôi có thể xuất file dưới định dạng nào?',
      a: 'Tất cả các gói đều hỗ trợ xuất file định dạng âm thanh MP3 chuẩn HD sắc nét (up to 320kbps) và file nén ZIP cho bài đọc dài.'
    }
  ]
};

const DEFAULT_DASHBOARD_LANG_DATA = {
  welcomeText: 'Xin chào',
  accountSubtext: 'Tài khoản dịch vụ Giọng nói Trí tuệ Nhân tạo Veltrix Voice',
  upgradeBtn: 'Nâng Cấp Gói Veltrix',
  statLimitTitle: 'Hạn Mức Ký Tự / Ngày',
  statLimitUnit: 'Ký tự',
  statAudioTitle: 'Tổng Bài Đọc Đã Tạo',
  statCreateLink: 'Tạo bài đọc mới trong Studio',
  hubTitle: 'Developer Integration Hub & Web SDK',
  hubSubtitle: 'Tích hợp trực tiếp công cụ tạo giọng đọc AI Veltrix Voice vào Website, Blog, CMS (WordPress) hoặc App của bạn với 1 dòng mã.',
  createKeyBtn: 'Tạo API Key Mới',
  noKeysTitle: 'Chưa có API Key nào được khởi tạo',
  noKeysDesc: 'Khởi tạo API Key để cấp quyền truy cập dịch vụ giọng đọc AI cho các website và ứng dụng của bạn.',
  lockDomainBtn: 'Khóa Tên Miền',
  copyKeyBtn: 'Copy Key',
  deleteBtn: 'Xóa',
  tabCdn: 'Tích hợp CDN Script',
  tabJs: 'Khởi tạo JS SDK',
  tabRest: 'Gọi REST API Direct',
  copyCodeBtn: 'Copy Đoạn Mã',
  subHistoryTitle: 'Lịch Sử Thanh Toán & Đăng Ký Gói',
  thPlan: 'TÊN GÓI DỊCH VỤ',
  thPrice: 'GIÁ TIỀN',
  thQuota: 'HẠN MỨC CỘNG',
  thDate: 'NGÀY GIAO DỊCH',
  thStatus: 'TRẠNG THÁI',

  // Modal Tên Miền & Key
  domainModalTitle: '🛡️ Cấu Hình Tên Miền Bảo Mật',
  domainModalDesc: 'Chỉ các Tên Miền (Domain) có tên trong danh sách bên dưới mới được phép sử dụng API Key này. Kẻ xấu copy Key của bạn sang web khác sẽ bị hệ thống chặn ngay lập tức.',
  domainModalExample: 'Ví dụ: mycompany.com, blog.mycompany.vn (Phân cách bằng dấu phẩy, để trống nếu muốn cho phép tất cả tên miền).',
  domainModalPlaceholder: 'mysite.com, blogspot.com (hoặc để trống)...',
  saveConfigBtn: 'Lưu Cấu Hình 🛡️',
  cancelBtn: 'Hủy',
  createKeyModalTitle: 'Tạo API Key Mới',
  createKeyPlaceholder: 'Tên ứng dụng / website (Ví dụ: WordPress Blog, Localhost App)...',
  confirmCreateKeyBtn: 'Tạo Key 🔑',
  deleteKeyModalTitle: 'Xóa API Key này?',
  deleteKeyModalText: 'Các ứng dụng đang dùng Key này sẽ không thể gọi API giọng đọc nữa.',
  confirmDeleteKeyBtn: 'Đồng ý xóa 🗑️'
};

const DEFAULT_STUDIO_LANG_DATA = {
  voiceSettingsTitle: 'CÀI ĐẶT GIỌNG ĐỌC AI',
  listenSampleBtn: 'Nghe thử',
  stopSampleBtn: 'Dừng thử',
  loadingSampleBtn: 'Đang tải...',
  titlePlaceholder: 'Tên bài đọc / dự án (Ví dụ: Review iPhone 16...)',
  defaultFolder: 'Mặc định',
  addFolderBtn: '+ Thư mục',
  speedLabel: 'Tốc độ đọc',
  pitchLabel: 'Độ cao giọng (Pitch)',
  defaultText: 'Xin chào! Đây là ứng dụng tạo giọng nói trí tuệ nhân tạo được xây dựng với chuẩn kiến trúc Redux Toolkit và MVC.',
  charCountLabel: 'Ký tự',
  tokenCostLabel: 'Token tiêu hao',
  sampleTextBtn: 'Văn bản mẫu',
  pauseBtn: '+ Ngắt 0.5s',
  clearBtn: 'Xóa sạch',
  previewBtn: 'Nghe trước',
  generateBtn: 'Generate Audio',
  historyTitle: 'LỊCH SỬ TẠO AUDIO',
  allFolders: 'Tất cả thư mục',
  playBtn: 'Nghe',
  downloadMp3Btn: 'Tải MP3'
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
    setTranslations({}); // Clear previous tab translations
    try {
      const res = await adminService.getPageContent(slug);
      const data = res.data?.page || {};
      let pageTranslations = data.translations || {};

      let defaultData = DEFAULT_LANG_DATA;
      if (slug === 'pricing') defaultData = DEFAULT_PRICING_LANG_DATA;
      if (slug === 'dashboard') defaultData = DEFAULT_DASHBOARD_LANG_DATA;
      if (slug === 'studio') defaultData = DEFAULT_STUDIO_LANG_DATA;

      if (Object.keys(pageTranslations).length === 0) {
        pageTranslations = {
          vi: { ...defaultData, faqs: [...(defaultData.faqs || [])] },
          en: slug === 'pricing' ? {
            heroTitle: 'Upgrade to do more',
            heroTitleHl1: 'do more',
            heroSubtitle: 'Choose the right plan to optimize your content creation workflow with industry-leading AI technology.',
            cycleMonthly: 'Monthly',
            cycleYearly: 'Yearly',
            discountBadge: 'Save up to 70%',
            faqTitle: 'Frequently asked questions',
            faqs: [
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time in account settings.'
              },
              {
                q: 'Will unused usage carry over to next month?',
                a: 'Paid plan limits refresh monthly and do not carry over.'
              }
            ]
          } : slug === 'dashboard' ? {
            welcomeText: 'Welcome',
            accountSubtext: 'Veltrix Voice AI Speech Platform Account',
            upgradeBtn: 'Upgrade Veltrix Plan',
            statLimitTitle: 'Daily Character Limit',
            statLimitUnit: 'characters',
            statAudioTitle: 'Total Audio Generated',
            statCreateLink: 'Create new audio in Studio',
            hubTitle: 'Developer Integration Hub & Web SDK',
            hubSubtitle: 'Integrate Veltrix Voice AI Text-to-Speech tool into your Website, Blog, CMS (WordPress) or App with a single line of code.',
            createKeyBtn: 'Create New API Key',
            noKeysTitle: 'No API Keys Created Yet',
            noKeysDesc: 'Create an API Key to grant access to AI voice synthesis services for your websites and applications.',
            tabCdn: 'CDN Script Integration',
            tabJs: 'JS SDK Initialization',
            tabRest: 'Call REST API Direct',
            subHistoryTitle: 'Subscription & Quota History'
          } : slug === 'studio' ? {
            voiceSettingsTitle: 'AI VOICE SETTINGS',
            listenSampleBtn: 'Listen Sample',
            stopSampleBtn: 'Stop Sample',
            loadingSampleBtn: 'Loading...',
            titlePlaceholder: 'Audio / project title (e.g. iPhone 16 Review...)',
            defaultFolder: 'Default',
            addFolderBtn: '+ Folder',
            speedLabel: 'Reading Speed',
            pitchLabel: 'Pitch',
            defaultText: 'Hello! This is an AI voice generation application built with Redux Toolkit and MVC architecture.',
            charCountLabel: 'Characters',
            tokenCostLabel: 'Tokens Used',
            sampleTextBtn: 'Sample Text',
            pauseBtn: '+ Pause 0.5s',
            clearBtn: 'Clear All',
            previewBtn: 'Preview',
            generateBtn: 'Generate Audio',
            historyTitle: 'AUDIO GENERATION HISTORY',
            allFolders: 'All Folders',
            playBtn: 'Play',
            downloadMp3Btn: 'Download MP3'
          } : {
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
    let defaultData = DEFAULT_LANG_DATA;
    if (activeSlug === 'pricing') defaultData = DEFAULT_PRICING_LANG_DATA;
    if (activeSlug === 'studio') defaultData = DEFAULT_STUDIO_LANG_DATA;
    return translations[langCode] || { ...defaultData, faqs: [...(defaultData.faqs || [])] };
  };

  const handleFieldChange = (field, value) => {
    setTranslations(prev => {
      let defaultData = DEFAULT_LANG_DATA;
      if (activeSlug === 'pricing') defaultData = DEFAULT_PRICING_LANG_DATA;
      if (activeSlug === 'studio') defaultData = DEFAULT_STUDIO_LANG_DATA;
      const currentLangData = prev[activeLang] || { ...defaultData };
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
      const defaultData = activeSlug === 'pricing' ? DEFAULT_PRICING_LANG_DATA : DEFAULT_LANG_DATA;
      const currentLangData = prev[activeLang] || { ...defaultData };
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

  // 📥 Tải File Mẫu Bản Dịch JSON theo Trang & Ngôn Ngữ
  const handleDownloadTemplate = () => {
    const currentData = getLangData(activeLang);
    const pageNameStr = activeSlug === 'pricing' ? 'pricing' : 'landing';
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `veltrix_${pageNameStr}_translation_${activeLang}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    Swal.fire({
      icon: 'success',
      title: 'Đã Tải File Mẫu Dịch!',
      text: `File mẫu veltrix_${pageNameStr}_translation_${activeLang}.json đã được tải về. Bạn hãy dịch và nhập lại file này.`,
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      timer: 3000,
      showConfirmButton: false
    });
  };

  // 📤 Nhập File Bản Dịch JSON / TXT Đã Chỉnh Sửa theo Trang & Ngôn Ngữ
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
          const defaultData = activeSlug === 'pricing' ? DEFAULT_PRICING_LANG_DATA : DEFAULT_LANG_DATA;
          const existing = prev[activeLang] || { ...defaultData };
          return {
            ...prev,
            [activeLang]: {
              ...existing,
              ...parsedData
            }
          };
        });

        const pageTitleText = activeSlug === 'pricing' ? 'Trang Bảng Giá' : 'Landing Page';
        Swal.fire({
          icon: 'success',
          title: 'Nhập Bản Dịch Thành Công! 🎉',
          text: `Đã nạp tự động ${count} trường dữ liệu vào [${pageTitleText}] - Ngôn ngữ [${activeLang.toUpperCase()}]! Hãy bấm "Lưu Thay Đổi" để áp dụng.`,
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
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '28px', flexWrap: 'wrap' }}>
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

          <button
            onClick={() => setActiveSlug('pricing')}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              border: activeSlug === 'pricing' ? '1px solid #10b981' : '1px solid transparent',
              background: activeSlug === 'pricing' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeSlug === 'pricing' ? '#10b981' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Layers size={16} /> 💎 Trang Bảng Giá (Pricing)
          </button>

          <button
            onClick={() => setActiveSlug('dashboard')}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              border: activeSlug === 'dashboard' ? '1px solid #06b6d4' : '1px solid transparent',
              background: activeSlug === 'dashboard' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeSlug === 'dashboard' ? '#06b6d4' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={16} /> 📊 Trang Dashboard (Dev Hub)
          </button>

          <button
            onClick={() => setActiveSlug('studio')}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              border: activeSlug === 'studio' ? '1px solid #a855f7' : '1px solid transparent',
              background: activeSlug === 'studio' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
              color: activeSlug === 'studio' ? '#c084fc' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Code size={16} /> 🎙️ Trang Studio (Dashboard)
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

            {activeSlug === 'landing' && (
              <React.Fragment>
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

            {/* 6. FOOTER */}
            <div style={cardContainerStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="#10b981" /> 6. Chân Trang (Footer Text) ({activeLangObj?.name || activeLang.toUpperCase()})
              </h3>
              <input 
                type="text" 
                style={inputStyle}
                value={currentLangContent.footer || ''}
                onChange={(e) => handleFieldChange('footer', e.target.value)}
                placeholder="© 2026 Veltrix Voice Platform..."
              />
            </div>
          </React.Fragment>
        )}

        {activeSlug === 'pricing' && (
          <React.Fragment>
                {/* 1. HERO BANNER TRANG BẢNG GIÁ */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} color="#10b981" /> 1. Hero Banner Trang Bảng Giá ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <label style={labelStyle}>Tiêu Đề Đầu (Hero Title):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.heroTitle || ''}
                        onChange={(e) => handleFieldChange('heroTitle', e.target.value)}
                        placeholder="Nâng cấp để làm nhiều hơn..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Từ Khóa Nổi Bật Tím (Title Highlight):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.heroTitleHl1 || ''}
                        onChange={(e) => handleFieldChange('heroTitleHl1', e.target.value)}
                        placeholder="làm nhiều hơn..."
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Mô Tả Phụ (Hero Subtitle):</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.6', resize: 'vertical' }}
                      rows={2}
                      value={currentLangContent.heroSubtitle || ''}
                      onChange={(e) => handleFieldChange('heroSubtitle', e.target.value)}
                      placeholder="Chọn gói dịch vụ phù hợp để tối ưu hóa quy trình..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Nút 'Theo Tháng' (Monthly Cycle Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.cycleMonthly || ''}
                        onChange={(e) => handleFieldChange('cycleMonthly', e.target.value)}
                        placeholder="Theo tháng..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút 'Theo Năm' (Yearly Cycle Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.cycleYearly || ''}
                        onChange={(e) => handleFieldChange('cycleYearly', e.target.value)}
                        placeholder="Theo năm..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Huy Hiệu Giảm Giá (Discount Badge):</label>
                      <input 
                        type="text" 
                        style={{ ...inputStyle, borderLeft: '4px solid #10b981' }}
                        value={currentLangContent.discountBadge || ''}
                        onChange={(e) => handleFieldChange('discountBadge', e.target.value)}
                        placeholder="Tiết kiệm đến 70%..."
                      />
                    </div>
                  </div>
                </div>

                {/* 2. DYNAMIC FAQ SECTION TRANG BẢNG GIÁ */}
                <div style={cardContainerStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <HelpCircle size={20} color="#f59e0b" /> 2. Danh Sách FAQ Trang Bảng Giá ({activeLangObj?.name || activeLang.toUpperCase()})
                    </h3>

                    <button 
                      className="btn-small" 
                      onClick={handleAddFaq}
                      style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '13px', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={16} /> Thêm Câu Hỏi Mới
                    </button>
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={labelStyle}>Tiêu Đề Section FAQ (FAQ Title):</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.faqTitle || ''}
                      onChange={(e) => handleFieldChange('faqTitle', e.target.value)}
                      placeholder="Câu hỏi thường gặp..."
                    />
                  </div>

                  {/* List of FAQ Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(currentLangContent.faqs || []).map((faqItem, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#f59e0b', margin: 0 }}>
                            Câu Hỏi #{idx + 1}
                          </h4>
                          <button 
                            onClick={() => handleRemoveFaq(idx)}
                            style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>

                        <div style={{ marginBottom: '14px' }}>
                          <label style={labelStyle}>Nội dung câu hỏi ({activeLangObj?.name || activeLang.toUpperCase()}):</label>
                          <input 
                            type="text" 
                            style={inputStyle}
                            value={faqItem.q || ''}
                            onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                            placeholder="Nhập câu hỏi..."
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Nội dung câu trả lời ({activeLangObj?.name || activeLang.toUpperCase()}):</label>
                          <textarea 
                            style={{ ...inputStyle, lineHeight: '1.6', resize: 'vertical' }}
                            rows={3}
                            value={faqItem.a || ''}
                            onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                            placeholder="Nhập câu trả lời..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            )}

            {activeSlug === 'dashboard' && (
              <React.Fragment>
                {/* 0. HEADER & STAT CARDS */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} color="#06b6d4" /> 0. Thông Tin Header & Thống Kê ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={labelStyle}>Lời Chào Header (Welcome Text):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.welcomeText || ''}
                        onChange={(e) => handleFieldChange('welcomeText', e.target.value)}
                        placeholder="Xin chào..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Mô Tả Tài Khoản (Account Subtext):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.accountSubtext || ''}
                        onChange={(e) => handleFieldChange('accountSubtext', e.target.value)}
                        placeholder="Tài khoản dịch vụ Giọng nói AI..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Nâng Cấp (Upgrade Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.upgradeBtn || ''}
                        onChange={(e) => handleFieldChange('upgradeBtn', e.target.value)}
                        placeholder="Nâng Cấp Gói Veltrix..."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Tiêu Đề Hạn Mức (Stat Limit Title):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.statLimitTitle || ''}
                        onChange={(e) => handleFieldChange('statLimitTitle', e.target.value)}
                        placeholder="Hạn Mức Ký Tự / Ngày..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Đơn Vị Ký Tự (Stat Unit):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.statLimitUnit || ''}
                        onChange={(e) => handleFieldChange('statLimitUnit', e.target.value)}
                        placeholder="Ký tự..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Tiêu Đề Thống Kê Bài Đọc (Stat Audio Title):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.statAudioTitle || ''}
                        onChange={(e) => handleFieldChange('statAudioTitle', e.target.value)}
                        placeholder="Tổng Bài Đọc Đã Tạo..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Link Tạo Bài Đọc Mới (Create Audio Link):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.statCreateLink || ''}
                        onChange={(e) => handleFieldChange('statCreateLink', e.target.value)}
                        placeholder="Tạo bài đọc mới trong Studio..."
                      />
                    </div>
                  </div>
                </div>

            {activeSlug === 'dashboard' && (
              <React.Fragment>
                {/* 1. DEVELOPER HUB & API SDK */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Code size={20} color="#a855f7" /> 1. Developer Integration Hub & API SDK ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Tiêu Đề Hub (Developer Hub Title):</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.hubTitle || ''}
                      onChange={(e) => handleFieldChange('hubTitle', e.target.value)}
                      placeholder="Developer Integration Hub & Web SDK..."
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>Mô Tả Phụ (Hub Subtitle):</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.6', resize: 'vertical' }}
                      rows={2}
                      value={currentLangContent.hubSubtitle || ''}
                      onChange={(e) => handleFieldChange('hubSubtitle', e.target.value)}
                      placeholder="Tích hợp trực tiếp công cụ tạo giọng đọc AI Veltrix Voice vào Website..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Tên Nút Tạo API Key (Create Key Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.createKeyBtn || ''}
                        onChange={(e) => handleFieldChange('createKeyBtn', e.target.value)}
                        placeholder="Tạo API Key Mới..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Tiêu Đề Chưa Có API Key (No Keys Title):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.noKeysTitle || ''}
                        onChange={(e) => handleFieldChange('noKeysTitle', e.target.value)}
                        placeholder="Chưa có API Key nào được khởi tạo..."
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <label style={labelStyle}>Mô Tả Hướng Dẫn Chưa Có API Key (No Keys Description):</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.5', resize: 'vertical' }}
                      rows={2}
                      value={currentLangContent.noKeysDesc || ''}
                      onChange={(e) => handleFieldChange('noKeysDesc', e.target.value)}
                      placeholder="Khởi tạo API Key để cấp quyền truy cập dịch vụ giọng đọc AI..."
                    />
                  </div>
                </div>

                {/* 2. INTEGRATION CODE TABS */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={20} color="#06b6d4" /> 2. Tiêu Đề Các Tab Tích Hợp Mã Code ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Tab 1 (CDN Script Integration):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.tabCdn || ''}
                        onChange={(e) => handleFieldChange('tabCdn', e.target.value)}
                        placeholder="Tích hợp CDN Script..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Tab 2 (JS SDK Initialization):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.tabJs || ''}
                        onChange={(e) => handleFieldChange('tabJs', e.target.value)}
                        placeholder="Khởi tạo JS SDK..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Tab 3 (Call REST API Direct):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.tabRest || ''}
                        onChange={(e) => handleFieldChange('tabRest', e.target.value)}
                        placeholder="Gọi REST API Direct..."
                      />
                    </div>
                  </div>
                </div>

                {/* 3. HISTORY TITLES */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} color="#10b981" /> 3. Tiêu Đề Mục Lịch Sử Thanh Toán ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div>
                    <label style={labelStyle}>Mục Lịch Sử Gói Cước (Subscription History Title):</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.subHistoryTitle || ''}
                      onChange={(e) => handleFieldChange('subHistoryTitle', e.target.value)}
                      placeholder="Lịch Sử Gói Cước & Nạp Hạn Mức..."
                    />
                  </div>
                </div>

                {/* 4. MODAL & POPUP DIALOGS */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} color="#f59e0b" /> 4. Thông Tin Các Modal Pop-up ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Tiêu Đề Modal Bảo Mật Tên Miền (Domain Modal Title):</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.domainModalTitle || ''}
                      onChange={(e) => handleFieldChange('domainModalTitle', e.target.value)}
                      placeholder="🛡️ Cấu Hình Tên Miền Bảo Mật..."
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Mô Tả Modal Bảo Mật Tên Miền (Domain Modal Description):</label>
                    <textarea 
                      style={{ ...inputStyle, lineHeight: '1.5', resize: 'vertical' }}
                      rows={2}
                      value={currentLangContent.domainModalDesc || ''}
                      onChange={(e) => handleFieldChange('domainModalDesc', e.target.value)}
                      placeholder="Chỉ các Tên Miền (Domain) có tên trong danh sách..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={labelStyle}>Ví Dụ Tên Miền (Domain Example):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.domainModalExample || ''}
                        onChange={(e) => handleFieldChange('domainModalExample', e.target.value)}
                        placeholder="Ví dụ: mycompany.com..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Gợi Ý Nhập Tên Miền (Domain Placeholder):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.domainModalPlaceholder || ''}
                        onChange={(e) => handleFieldChange('domainModalPlaceholder', e.target.value)}
                        placeholder="mysite.com, blogspot.com..."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Nút Lưu Cấu Hình (Save Config Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.saveConfigBtn || ''}
                        onChange={(e) => handleFieldChange('saveConfigBtn', e.target.value)}
                        placeholder="Lưu Cấu Hình 🛡️..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Hủy Modal (Cancel Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.cancelBtn || ''}
                        onChange={(e) => handleFieldChange('cancelBtn', e.target.value)}
                        placeholder="Hủy..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Xác Nhận Tạo Key (Create Key Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.confirmCreateKeyBtn || ''}
                        onChange={(e) => handleFieldChange('confirmCreateKeyBtn', e.target.value)}
                        placeholder="Tạo Key 🔑..."
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}

            {activeSlug === 'studio' && (
              <React.Fragment>
                {/* 1. KHU VỰC CÀI ĐẶT GIỌNG ĐỌC AI & CONTROL */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Volume2 size={20} color="#a855f7" /> 1. Khu Vực Cài Đặt Giọng Đọc AI & Điều Chỉnh ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={labelStyle}>Tiêu Đề Khối Giọng Đọc (Voice Settings Title):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.voiceSettingsTitle || ''}
                        onChange={(e) => handleFieldChange('voiceSettingsTitle', e.target.value)}
                        placeholder="CÀI ĐẶT GIỌNG ĐỌC AI..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Nghe Thử Mẫu (Listen Sample Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.listenSampleBtn || ''}
                        onChange={(e) => handleFieldChange('listenSampleBtn', e.target.value)}
                        placeholder="Nghe thử..."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Nhãn Tốc Độ Đọc (Speed Label):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.speedLabel || ''}
                        onChange={(e) => handleFieldChange('speedLabel', e.target.value)}
                        placeholder="Tốc độ đọc..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nhãn Độ Cao Giọng (Pitch Label):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.pitchLabel || ''}
                        onChange={(e) => handleFieldChange('pitchLabel', e.target.value)}
                        placeholder="Độ cao giọng (Pitch)..."
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SOẠN THẢO VĂN BẢN & NÚT THAO TÁC */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Code size={20} color="#06b6d4" /> 2. Khu Vực Soạn Thảo & Nút Thao Tác ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Gợi Ý Tên Bài Đọc / Dự Án (Title Placeholder):</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.titlePlaceholder || ''}
                      onChange={(e) => handleFieldChange('titlePlaceholder', e.target.value)}
                      placeholder="Tên bài đọc / dự án (Ví dụ: Review iPhone 16...)..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={labelStyle}>Thư Mục Mặc Định (Default Folder):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.defaultFolder || ''}
                        onChange={(e) => handleFieldChange('defaultFolder', e.target.value)}
                        placeholder="Mặc định..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Thêm Thư Mục (Add Folder Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.addFolderBtn || ''}
                        onChange={(e) => handleFieldChange('addFolderBtn', e.target.value)}
                        placeholder="+ Thư mục..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Kịch Bản Mẫu (Sample Text Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.sampleTextBtn || ''}
                        onChange={(e) => handleFieldChange('sampleTextBtn', e.target.value)}
                        placeholder="Văn bản mẫu..."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={labelStyle}>Nút Ngắt Giọng (Pause Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.pauseBtn || ''}
                        onChange={(e) => handleFieldChange('pauseBtn', e.target.value)}
                        placeholder="+ Ngắt 0.5s..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Xóa Sạch (Clear Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.clearBtn || ''}
                        onChange={(e) => handleFieldChange('clearBtn', e.target.value)}
                        placeholder="Xóa sạch..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Nghe Trước (Preview Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.previewBtn || ''}
                        onChange={(e) => handleFieldChange('previewBtn', e.target.value)}
                        placeholder="Nghe trước..."
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Nút Tạo Audio Chính (Generate Audio Button):</label>
                    <input 
                      type="text" 
                      style={inputStyle}
                      value={currentLangContent.generateBtn || ''}
                      onChange={(e) => handleFieldChange('generateBtn', e.target.value)}
                      placeholder="Generate Audio..."
                    />
                  </div>
                </div>

                {/* 3. LỊCH SỬ TẠO AUDIO DANH SÁCH */}
                <div style={cardContainerStyle}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} color="#10b981" /> 3. Mục Lịch Sử Bài Đọc MP3 ({activeLangObj?.name || activeLang.toUpperCase()})
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Tiêu Đề Lịch Sử Audio (Audio History Title):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.historyTitle || ''}
                        onChange={(e) => handleFieldChange('historyTitle', e.target.value)}
                        placeholder="LỊCH SỬ TẠO AUDIO..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Phát/Nghe (Play Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.playBtn || ''}
                        onChange={(e) => handleFieldChange('playBtn', e.target.value)}
                        placeholder="Nghe..."
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Nút Tải File MP3 (Download Button):</label>
                      <input 
                        type="text" 
                        style={inputStyle}
                        value={currentLangContent.downloadMp3Btn || ''}
                        onChange={(e) => handleFieldChange('downloadMp3Btn', e.target.value)}
                        placeholder="Tải MP3..."
                      />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}

          </div>
        )}

      </div>
    </AdminLayout>
  );
}
