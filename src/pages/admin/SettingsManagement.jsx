import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';
import { 
  Settings as SettingsIcon, Coffee, Key, Cloud, Globe, 
  Save, Check, AlertTriangle, Shield, Eye, EyeOff, Mail, Send, Server, Info 
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
  const [activeTab, setActiveTab] = useState('donate'); // 'donate' | 'google' | 'cloudinary' | 'smtp' | 'general'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

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
    maintenanceMode: false
  });

  useEffect(() => {
    loadSettings();
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      Swal.fire({
        icon: 'success',
        title: 'Lưu cài đặt thành công! 🎉',
        text: 'Cấu hình hệ thống đã được cập nhật thành công vào Database.',
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
      loadSettings();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lưu cài đặt thất bại!',
        text: err.response?.data?.error || err.message,
        background: '#181824',
        color: '#fff',
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
      background: '#181824',
      color: '#fff',
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
          background: '#181824',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gửi Email Thử Nghiệm Thất Bại!',
          text: err.response?.data?.error || err.message,
          background: '#181824',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        });
      } finally {
        setTestingEmail(false);
      }
    }
  };

  const vietQrPreviewUrl = `https://img.vietqr.io/image/${settings.donateBankId}-${settings.donateAccountNo}-compact2.png?accountName=${encodeURIComponent(settings.donateAccountName)}&addInfo=${encodeURIComponent('Donate duy tri server')}`;

  return (
    <AdminLayout>
      <div style={{ padding: '24px 32px' }}>
        
        {/* Title Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SettingsIcon color="var(--primary-purple)" size={28} /> Quản Trị Hệ Thống (System Settings)
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Cấu hình Tài khoản Donate, Google OAuth, Cloudinary Storage, Máy Chủ Email SMTP & Cài đặt hệ thống chung.
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '24px', alignItems: 'start' }}>
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
                            required
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
                            required
                            value={settings.donateAccountName}
                            onChange={e => setSettings({...settings, donateAccountName: e.target.value.toUpperCase()})}
                            placeholder="LAM CHI LOC"
                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                          />
                        </div>
                      </div>

                      {/* Live Preview VietQR Image */}
                      <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>Xem trước Mã VietQR</div>
                        <div style={{ background: '#fff', borderRadius: '12px', padding: '8px', display: 'inline-block' }}>
                          <img 
                            src={vietQrPreviewUrl} 
                            alt="VietQR Preview" 
                            style={{ width: '180px', height: 'auto', display: 'block', borderRadius: '6px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. TAB GOOGLE OAUTH */}
                {activeTab === 'google' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Key size={22} /> Cấu hình Google Login (OAuth 2.0)
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Thông tin Client ID và Client Secret từ Google Cloud Console để phục vụ Đăng nhập Google.
                      </p>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Google Client ID</label>
                      <input 
                        type="text" 
                        value={settings.googleClientId}
                        onChange={e => setSettings({...settings, googleClientId: e.target.value})}
                        placeholder="123456789-abc.apps.googleusercontent.com"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Google Client Secret</label>
                        <button type="button" onClick={() => setShowSecrets(!showSecrets)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                          {showSecrets ? <EyeOff size={14} /> : <Eye size={14} />} {showSecrets ? 'Ẩn' : 'Hiện'} Secret
                        </button>
                      </div>
                      <input 
                        type={showSecrets ? "text" : "password"} 
                        value={settings.googleClientSecret}
                        onChange={e => setSettings({...settings, googleClientSecret: e.target.value})}
                        placeholder="GOCSPX-..."
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                )}

                {/* 3. TAB CLOUDINARY STORAGE */}
                {activeTab === 'cloudinary' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Cloud size={22} /> Cấu hình Cloudinary Storage (Lưu Audio/Ảnh)
                      </h2>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Tài khoản Cloudinary để lưu file MP3 và hình ảnh quảng bá hệ thống.
                      </p>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Cloud Name</label>
                      <input 
                        type="text" 
                        value={settings.cloudinaryCloudName}
                        onChange={e => setSettings({...settings, cloudinaryCloudName: e.target.value})}
                        placeholder="my_cloud_name"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>API Key</label>
                      <input 
                        type="text" 
                        value={settings.cloudinaryApiKey}
                        onChange={e => setSettings({...settings, cloudinaryApiKey: e.target.value})}
                        placeholder="123456789012345"
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold' }}>API Secret</label>
                        <button type="button" onClick={() => setShowSecrets(!showSecrets)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                          {showSecrets ? <EyeOff size={14} /> : <Eye size={14} />} {showSecrets ? 'Ẩn' : 'Hiện'} Secret
                        </button>
                      </div>
                      <input 
                        type={showSecrets ? "text" : "password"} 
                        value={settings.cloudinaryApiSecret}
                        onChange={e => setSettings({...settings, cloudinaryApiSecret: e.target.value})}
                        placeholder="abc123secret..."
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                )}

                {/* 4. TAB MÁY CHỦ GỬI EMAIL (SMTP SERVER) - GIAO DIỆN GỌN 3 TRƯỜNG CHUẨN MẪU */}
                {activeTab === 'smtp' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Green Banner Notice */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                        <Server size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>
                          Máy Chủ Gửi Email (SMTP Server)
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                          Được sử dụng để tự động gửi thông báo đơn hàng, duyệt kích hoạt gói, mã xác nhận và khôi phục mật khẩu cho Khách hàng.
                        </p>
                      </div>
                    </div>

                    {/* Yellow Warning Notice Box */}
                    <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', flexShrink: 0, fontSize: '15px' }}>
                        !
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#f59e0b', marginBottom: '4px' }}>Lưu ý Quan Trọng!</h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>
                          Mật khẩu SMTP không phải là mật khẩu đăng nhập Gmail thông thường. Sếp cần bật <b>Xác minh 2 bước</b> trên Google và tạo <b>'Mật khẩu ứng dụng' (App Password)</b> gồm 16 chữ cái để điền vào đây nha.
                        </p>
                      </div>
                    </div>

                    {/* 3 Input Fields Exact Match */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '4px' }}>
                      
                      {/* Field 1: Email Gửi Đi (SMTP Email) */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)' }}>
                          <span style={{ color: '#ef4444' }}>*</span> <Mail size={16} color="#ef4444" /> Email Gửi Đi (SMTP Email)
                        </label>
                        <input 
                          type="email" 
                          required
                          value={settings.smtpUser}
                          onChange={e => setSettings({...settings, smtpUser: e.target.value})}
                          placeholder="1945musictrending@gmail.com"
                          style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                        />
                      </div>

                      {/* Field 2: Mật khẩu Ứng dụng (SMTP Password) */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            <span style={{ color: '#ef4444' }}>*</span> <Key size={16} color="#f59e0b" /> Mật khẩu Ứng dụng (SMTP Password)
                          </label>
                          <button type="button" onClick={() => setShowSecrets(!showSecrets)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                            {showSecrets ? <EyeOff size={14} /> : <Eye size={14} />} {showSecrets ? 'Ẩn Mã' : 'Xem Mã'}
                          </button>
                        </div>
                        <input 
                          type={showSecrets ? "text" : "password"} 
                          required
                          value={settings.smtpPass}
                          onChange={e => setSettings({...settings, smtpPass: e.target.value})}
                          placeholder="abcd efgh ijkl mnop (Mật khẩu ứng dụng 16 ký tự)"
                          style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13.5px', letterSpacing: showSecrets ? 'normal' : '2px' }}
                        />
                      </div>

                      {/* Field 3: Tên Người Gửi (Sender Name) */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-primary)' }}>
                          <span style={{ color: '#ef4444' }}>*</span> <Globe size={16} color="#3b82f6" /> Tên Người Gửi (Sender Name)
                        </label>
                        <input 
                          type="text" 
                          required
                          value={settings.smtpFromName}
                          onChange={e => setSettings({...settings, smtpFromName: e.target.value})}
                          placeholder="Veltrix Voice"
                          style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13.5px' }}
                        />
                      </div>

                    </div>

                    {/* Bottom Action Buttons: Save & Send Test Email */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                      <button 
                        type="submit" 
                        disabled={saving}
                        style={{ 
                          flex: 1,
                          padding: '14px 24px', 
                          fontSize: '14px', 
                          fontWeight: '800',
                          background: '#10b981', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '12px', 
                          cursor: 'pointer',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Save size={18} /> {saving ? 'ĐANG LƯU...' : '💾 LƯU CẤU HÌNH EMAIL'}
                      </button>

                      <button 
                        type="button" 
                        disabled={testingEmail}
                        onClick={handleSendTestEmail}
                        style={{ 
                          padding: '14px 24px', 
                          fontSize: '14px', 
                          fontWeight: '700',
                          background: 'transparent', 
                          color: '#3b82f6', 
                          border: '1.5px solid #3b82f6', 
                          borderRadius: '12px', 
                          cursor: 'pointer',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Send size={16} /> {testingEmail ? 'Đang Gửi Test...' : '🚀 Gửi Email Test'}
                      </button>
                    </div>

                  </div>
                )}

                {/* 5. TAB CÀI ĐẶT CHUNG */}
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

                {/* Submit Button for non-SMTP tabs */}
                {activeTab !== 'smtp' && (
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
