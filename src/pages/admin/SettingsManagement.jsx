import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';
import { 
  Settings as SettingsIcon, Coffee, Key, Cloud, Globe, 
  Save, Check, AlertTriangle, Shield, Eye, EyeOff, Mail, Send, Server, Info,
  Plus, Trash2, CheckCircle2, XCircle, Star, Languages
} from 'lucide-react';

const POPULAR_BANKS = [
  { id: 'MB', name: 'MB Bank (Quân Đội)' },
  { id: 'VCB', name: 'Vietcombank' },
  { id: 'TCB', name: 'Techcombank' },
  { id: 'CTG', name: 'VietinBank' },
  { id: 'BIDV', name: 'BIDV' },
  { id: 'VPB', name: 'VPBank' },
  { id: 'TPB', name: 'TPBank' },
  { id: 'VBA', name: 'Agribank' },
  { id: 'ACB', name: 'ACB' },
  { id: 'STB', name: 'Sacombank' },
];

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('donate'); // 'donate' | 'google' | 'cloudinary' | 'smtp' | 'general' | 'languages'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  // Language management state
  const [languagesList, setLanguagesList] = useState([]);
  const [loadingLangs, setLoadingLangs] = useState(false);

  const [settings, setSettings] = useState({
    donateBankId: 'MB',
    donateAccountNo: '0912572421202',
    donateAccountName: 'LÂM CHÍ LỘC',
    googleClientId: '',
    googleClientSecret: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpSecure: false,
    smtpFromName: 'Veltrix Voice',
    siteName: 'Veltrix Voice',
    contactEmail: 'support@veltrix.ai',
    maintenanceMode: false,
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: 'us-east-1'
  });

  useEffect(() => {
    loadSettings();
    loadLanguages();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res.data.setting) {
        setSettings(res.data.setting);
      }
    } catch (err) {
      console.error("Lỗi tải cài đặt:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadLanguages = async () => {
    try {
      setLoadingLangs(true);
      const res = await adminService.getLanguages();
      const fetched = res.data?.languages || [];
      if (fetched.length > 0) {
        setLanguagesList(fetched);
      } else {
        setLanguagesList([
          { code: 'vi', name: 'Tiếng Việt 🇻🇳', isDefault: true, isActive: true },
          { code: 'en', name: 'English 🇬🇧', isDefault: false, isActive: true },
          { code: 'ja', name: '日本語 (Tiếng Nhật) 🇯🇵', isDefault: false, isActive: true },
          { code: 'ko', name: '한국어 (Tiếng Hàn) 🇰🇷', isDefault: false, isActive: true },
          { code: 'zh', name: '中文 (Tiếng Trung) 🇨🇳', isDefault: false, isActive: true },
          { code: 'fr', name: 'Français (Tiếng Pháp) 🇫🇷', isDefault: false, isActive: true }
        ]);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách ngôn ngữ:", err);
      setLanguagesList([
        { code: 'vi', name: 'Tiếng Việt 🇻🇳', isDefault: true, isActive: true },
        { code: 'en', name: 'English 🇬🇧', isDefault: false, isActive: true }
      ]);
    } finally {
      setLoadingLangs(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      Swal.fire({
        icon: 'success',
        title: 'Lưu cài đặt thành công! 🎉',
        text: 'Cấu hình hệ thống đã được cập nhật thành công vào Database.',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#10b981'
      });
      loadSettings();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lưu cài đặt thất bại!',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    const { value: targetEmail } = await Swal.fire({
      title: 'Gửi Email Thử Nghiệm 🚀',
      text: 'Nhập địa chỉ Email nhận thư test (hoặc để trống để gửi tới chính Email SMTP):',
      input: 'email',
      inputValue: settings.smtpUser || settings.contactEmail,
      inputPlaceholder: 'name@example.com',
      showCancelButton: true,
      confirmButtonText: 'Gửi Ngay',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#4b5563'
    });

    if (targetEmail !== undefined) {
      setTestingEmail(true);
      try {
        const res = await adminService.sendTestEmail({ targetEmail });
        Swal.fire({
          icon: 'success',
          title: 'Gửi Email Test Thành Công! 🎉',
          text: res.data.message || 'Vui lòng kiểm tra Hộp thư đến (hoặc thư Rác / Spam).',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          confirmButtonColor: '#10b981'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gửi Email Thử Nghiệm Thất Bại!',
          text: err.response?.data?.error || err.message,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          confirmButtonColor: '#ef4444'
        });
      } finally {
        setTestingEmail(false);
      }
    }
  };

  // Language management Handlers
  const handleAddLanguage = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Thêm Ngôn Ngữ Mới 🌐',
      html:
        '<input id="swal-lang-code" class="swal2-input" placeholder="Mã ISO (VD: ja, ko, zh, fr, de)">' +
        '<input id="swal-lang-name" class="swal2-input" placeholder="Tên hiển thị (VD: 日本語 (Tiếng Nhật) 🇯🇵)">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Thêm Ngôn Ngữ',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      preConfirm: () => {
        const code = document.getElementById('swal-lang-code').value;
        const name = document.getElementById('swal-lang-name').value;
        if (!code || !name) {
          Swal.showValidationMessage('Vui lòng nhập đầy đủ Mã và Tên hiển thị!');
          return false;
        }
        return { code, name };
      }
    });

    if (formValues) {
      try {
        const res = await adminService.createLanguage(formValues);
        Swal.fire({
          icon: 'success',
          title: 'Đã thêm ngôn ngữ thành công!',
          text: res.data.message,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          timer: 1500,
          showConfirmButton: false
        });
        loadLanguages();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi thêm ngôn ngữ',
          text: err.response?.data?.error || err.message,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  const handleToggleLangActive = async (lang) => {
    try {
      await adminService.updateLanguage(lang._id, { isActive: !lang.isActive });
      loadLanguages();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi cập nhật',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    }
  };

  const handleSetDefaultLang = async (lang) => {
    try {
      await adminService.updateLanguage(lang._id, { isDefault: true });
      Swal.fire({
        icon: 'success',
        title: 'Đã đặt ngôn ngữ mặc định!',
        text: `Ngôn ngữ [${lang.name}] hiện là ngôn ngữ mặc định hệ thống.`,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        timer: 1500,
        showConfirmButton: false
      });
      loadLanguages();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi đặt mặc định',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    }
  };

  const handleDeleteLang = async (lang) => {
    const result = await Swal.fire({
      title: `Xóa ngôn ngữ [${lang.name}]?`,
      text: 'Bạn có chắc chắn muốn xóa ngôn ngữ này khỏi hệ thống không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)'
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteLanguage(lang._id);
        Swal.fire({
          icon: 'success',
          title: 'Đã xóa!',
          text: 'Ngôn ngữ đã được xóa khỏi cơ sở dữ liệu.',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          timer: 1500,
          showConfirmButton: false
        });
        loadLanguages();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi xóa ngôn ngữ',
          text: err.response?.data?.error || err.message,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  const vietQrPreviewUrl = `https://img.vietqr.io/image/${settings.donateBankId}-${settings.donateAccountNo}-compact2.png?accountName=${encodeURIComponent(settings.donateAccountName)}&addInfo=${encodeURIComponent('Donate duy tri server')}`;

  return (
    <AdminLayout>
      <div style={{ padding: '24px 32px' }}>
        
        {/* Title Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
            <SettingsIcon color="var(--primary-purple)" size={28} /> Quản Trị Hệ Thống (System Settings)
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Cấu hình Tài khoản Donate, Google OAuth, Cloudinary Storage, Máy Chủ Email SMTP, Quản Lý Ngôn Ngữ & Cài đặt hệ thống chung.
          </p>
        </div>

        {/* MAIN CONTAINER WITH SIDEBAR TABS */}
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* TAB SIDEBAR */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            
            <button
              type="button"
              onClick={() => setActiveTab('donate')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'donate' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: activeTab === 'donate' ? '#f59e0b' : 'var(--text-primary)',
                fontWeight: activeTab === 'donate' ? 'bold' : 'normal',
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Coffee size={18} color="#f59e0b" /> Tài khoản Donate ☕
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('google')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'google' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: activeTab === 'google' ? '#3b82f6' : 'var(--text-primary)',
                fontWeight: activeTab === 'google' ? 'bold' : 'normal',
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Key size={18} color="#3b82f6" /> Google Login (OAuth)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cloudinary')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'cloudinary' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: activeTab === 'cloudinary' ? '#06b6d4' : 'var(--text-primary)',
                fontWeight: activeTab === 'cloudinary' ? 'bold' : 'normal',
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Cloud size={18} color="#06b6d4" /> Cloudinary Storage
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('smtp')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'smtp' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: activeTab === 'smtp' ? '#10b981' : 'var(--text-primary)',
                fontWeight: activeTab === 'smtp' ? 'bold' : 'normal',
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Mail size={18} color="#10b981" /> Máy chủ Email (SMTP)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('aws')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'aws' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                color: activeTab === 'aws' ? '#a855f7' : 'var(--text-primary)',
                fontWeight: activeTab === 'aws' ? 'bold' : 'normal',
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Server size={18} color="#a855f7" /> AWS Polly Voice 🎙️
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('languages')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'languages' ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
                color: activeTab === 'languages' ? '#ec4899' : 'var(--text-primary)',
                fontWeight: activeTab === 'languages' ? 'bold' : 'normal',
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Languages size={18} color="#ec4899" /> Quản Lý Ngôn Ngữ 🌐
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('general')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'general' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                color: activeTab === 'general' ? '#c084fc' : 'var(--text-primary)',
                fontWeight: activeTab === 'general' ? 'bold' : 'normal',
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Globe size={18} color="#c084fc" /> Cài đặt Chung
            </button>

          </div>

          {/* FORM CONTENT */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '28px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải cài đặt...</div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. TAB DONATE */}
                {activeTab === 'donate' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Coffee size={22} /> Cấu hình Tài khoản Donate (VietQR)
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Thông tin Ngân hàng và Mã VietQR hiển thị cho khách hàng khi họ bấm nút "Donate Cà Phê".
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Ngân Hàng Nhận Donate</label>
                          <select 
                            value={settings.donateBankId}
                            onChange={e => setSettings({...settings, donateBankId: e.target.value})}
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                          >
                            {POPULAR_BANKS.map(b => (
                              <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Số Tài Khoản Ngân Hàng</label>
                          <input 
                            type="text" 
                            value={settings.donateAccountNo}
                            onChange={e => setSettings({...settings, donateAccountNo: e.target.value})}
                            placeholder="0912572421202"
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Tên Chủ Tài Khoản (Viết hoa không dấu)</label>
                          <input 
                            type="text" 
                            value={settings.donateAccountName}
                            onChange={e => setSettings({...settings, donateAccountName: e.target.value})}
                            placeholder="LAM CHI LOC"
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                          />
                        </div>
                      </div>

                      {/* VietQR Live Preview Box */}
                      <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>Xem trước Mã VietQR</div>
                        <img 
                          src={vietQrPreviewUrl} 
                          alt="VietQR Preview" 
                          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TAB GOOGLE LOGIN */}
                {activeTab === 'google' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Key size={22} /> Cấu hình Google Login (OAuth 2.0)
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Cho phép khách hàng đăng nhập nhanh bằng tài khoản Google. Lấy API Key từ Google Cloud Console.
                      </p>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Google Client ID</label>
                      <input 
                        type="text" 
                        value={settings.googleClientId}
                        onChange={e => setSettings({...settings, googleClientId: e.target.value})}
                        placeholder="123456789-abc...apps.googleusercontent.com"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Google Client Secret</label>
                      <input 
                        type={showSecrets ? "text" : "password"} 
                        value={settings.googleClientSecret}
                        onChange={e => setSettings({...settings, googleClientSecret: e.target.value})}
                        placeholder="GOCSPX-..."
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      />
                    </div>
                  </div>
                )}

                {/* 3. TAB CLOUDINARY */}
                {activeTab === 'cloudinary' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Cloud size={22} /> Cấu hình Lưu Trữ Cloudinary Storage
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Lưu trữ các file âm thanh MP3 và avatar người dùng trên Cloudinary CDN cao cấp.
                      </p>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Cloud Name</label>
                      <input 
                        type="text" 
                        value={settings.cloudinaryCloudName}
                        onChange={e => setSettings({...settings, cloudinaryCloudName: e.target.value})}
                        placeholder="d-xxxxxx"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>API Key</label>
                      <input 
                        type="text" 
                        value={settings.cloudinaryApiKey}
                        onChange={e => setSettings({...settings, cloudinaryApiKey: e.target.value})}
                        placeholder="123456789012345"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>API Secret</label>
                      <input 
                        type={showSecrets ? "text" : "password"} 
                        value={settings.cloudinaryApiSecret}
                        onChange={e => setSettings({...settings, cloudinaryApiSecret: e.target.value})}
                        placeholder="abcd..."
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      />
                    </div>
                  </div>
                )}

                {/* 4. TAB SMTP EMAIL */}
                {activeTab === 'smtp' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Mail size={22} /> Máy Chủ Email Tự Động (SMTP Setup)
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Cấu hình gửi email tự động xác minh tài khoản, khôi phục mật khẩu & thông báo thanh toán.
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>SMTP Host</label>
                        <input 
                          type="text" 
                          value={settings.smtpHost}
                          onChange={e => setSettings({...settings, smtpHost: e.target.value})}
                          placeholder="smtp.gmail.com"
                          style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>SMTP Port</label>
                        <input 
                          type="number" 
                          value={settings.smtpPort}
                          onChange={e => setSettings({...settings, smtpPort: Number(e.target.value)})}
                          placeholder="587"
                          style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Tài Khoản Gmail / Email SMTP</label>
                        <input 
                          type="email" 
                          value={settings.smtpUser}
                          onChange={e => setSettings({...settings, smtpUser: e.target.value})}
                          placeholder="name@example.com"
                          style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Mật Khẩu Ứng Dụng (App Password)</label>
                        <input 
                          type={showSecrets ? "text" : "password"} 
                          value={settings.smtpPass}
                          onChange={e => setSettings({...settings, smtpPass: e.target.value})}
                          placeholder="Mật khẩu ứng dụng 16 ký tự"
                          style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Tên Người Gửi (Sender Name)</label>
                      <input 
                        type="text" 
                        value={settings.smtpFromName}
                        onChange={e => setSettings({...settings, smtpFromName: e.target.value})}
                        placeholder="Veltrix Voice"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                      <button 
                        type="submit" 
                        disabled={saving}
                        style={{ flex: 1, padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Save size={18} /> {saving ? 'Đang lưu...' : '💾 Lưu Cấu Hình Email'}
                      </button>

                      <button 
                        type="button" 
                        disabled={testingEmail}
                        onClick={handleSendTestEmail}
                        style={{ padding: '14px 24px', background: 'transparent', color: '#3b82f6', border: '1.5px solid #3b82f6', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <Send size={16} /> {testingEmail ? 'Đang Gửi Test...' : '🚀 Gửi Email Test'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 4.5. TAB AWS POLLY TTS */}
                {activeTab === 'aws' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Server size={22} /> Cấu hình AWS Polly AI Voice Engine
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Cấu hình Khóa truy cập AWS IAM để tổng hợp giọng đọc AI đa ngôn ngữ siêu tốc (Anh, Trung, Nhật, Hàn, Tây Ban Nha...).
                      </p>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>AWS Access Key ID</label>
                      <input 
                        type="text" 
                        value={settings.awsAccessKeyId || ''}
                        onChange={e => setSettings({...settings, awsAccessKeyId: e.target.value})}
                        placeholder="AKIA..."
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>AWS Secret Access Key</label>
                      <input 
                        type={showSecrets ? "text" : "password"} 
                        value={settings.awsSecretAccessKey || ''}
                        onChange={e => setSettings({...settings, awsSecretAccessKey: e.target.value})}
                        placeholder="Secret key..."
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>AWS Region (Khu vực máy chủ)</label>
                      <select 
                        value={settings.awsRegion || 'us-east-1'}
                        onChange={e => setSettings({...settings, awsRegion: e.target.value})}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                      >
                        <option value="us-east-1">us-east-1 (N. Virginia)</option>
                        <option value="us-west-2">us-west-2 (Oregon)</option>
                        <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                        <option value="ap-northeast-1">ap-northeast-1 (Tokyo)</option>
                        <option value="eu-west-1">eu-west-1 (Ireland)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 5. TAB QUẢN LÝ NGÔN NGỮ */}
                {activeTab === 'languages' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <Languages size={22} /> Quản Lý Ngôn Ngữ Hệ Thống
                        </h2>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          Bật/Tắt các ngôn ngữ được hỗ trợ, thêm ngôn ngữ mới và thiết lập ngôn ngữ mặc định.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddLanguage}
                        style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)' }}
                      >
                        <Plus size={16} /> Thêm Ngôn Ngữ Mới
                      </button>
                    </div>

                    {loadingLangs ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải danh sách ngôn ngữ...</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {languagesList.map((lang) => (
                          <div 
                            key={lang._id}
                            style={{ 
                              background: 'var(--bg-input)', 
                              border: lang.isDefault ? '2px solid #ec4899' : '1px solid var(--border-color)', 
                              borderRadius: '16px', 
                              padding: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '14px',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>{lang.name}</h3>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '6px', marginTop: '4px', display: 'inline-block' }}>
                                  Mã ISO: <b>{lang.code}</b>
                                </span>
                              </div>

                              {lang.isDefault && (
                                <span style={{ fontSize: '11px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.4)', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Star size={12} fill="#ec4899" /> Mặc Định
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleLangActive(lang)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  border: 'none',
                                  background: lang.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                  color: lang.isActive ? '#10b981' : '#ef4444',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {lang.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                {lang.isActive ? 'Đang Hoạt Động' : 'Đã Ẩn (Tắt)'}
                              </button>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                {!lang.isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetDefaultLang(lang)}
                                    title="Đặt làm ngôn ngữ mặc định"
                                    style={{ padding: '6px 10px', background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                  >
                                    Đặt Mặc Định
                                  </button>
                                )}

                                {!lang.isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLang(lang)}
                                    title="Xóa ngôn ngữ"
                                    style={{ padding: '6px 8px', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. TAB CÀI ĐẶT CHUNG */}
                {activeTab === 'general' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Globe size={22} /> Cài đặt Hệ thống Chung
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Các thông tin hiển thị thương hiệu và chế độ bảo trì hệ thống.
                      </p>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Tên Thương Hiệu Hệ Thống</label>
                      <input 
                        type="text" 
                        value={settings.siteName}
                        onChange={e => setSettings({...settings, siteName: e.target.value})}
                        placeholder="Veltrix Voice"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Email Hỗ Trợ Khách Hàng</label>
                      <input 
                        type="email" 
                        value={settings.contactEmail}
                        onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                        placeholder="support@veltrix.ai"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Chế độ Bảo Trì (Maintenance Mode)</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Khi BẬT, người dùng thông thường sẽ không thể truy cập hệ thống.</div>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: settings.maintenanceMode ? '#ef4444' : '#10b981' }}>
                        <input 
                          type="checkbox" 
                          checked={settings.maintenanceMode} 
                          onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        {settings.maintenanceMode ? 'ĐANG BẢO TRÌ (BẬT)' : 'BÌNH THƯỜNG (TẮT)'}
                      </label>
                    </div>
                  </div>
                )}

                {/* Submit Button for non-SMTP & non-Languages tabs */}
                {activeTab !== 'smtp' && activeTab !== 'languages' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="btn-cta" 
                      style={{ padding: '12px 28px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu Thay Đổi Cài Đặt'}
                    </button>
                  </div>
                )}

              </form>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
