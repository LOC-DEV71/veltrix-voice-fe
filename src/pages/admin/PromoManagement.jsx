import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';
import { 
  CheckCircle, XCircle, ExternalLink, Image, Hash, FileText, 
  Upload, Save, Clock, Check, AlertCircle, Video, Search 
} from 'lucide-react';

export default function PromoManagement() {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'config'
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [plans, setPlans] = useState([]);
  // Config State
  const [config, setConfig] = useState({
    title: 'Sự Kiện Quảng Bá Nhận Gói Miễn Phí',
    platformName: 'TikTok',
    applicablePlans: [],
    promoImageUrl: '',
    hashtags: [],
    instructions: '',
    isActive: true
  });
  const [hashtagsInput, setHashtagsInput] = useState('');
  const [selectedImageBase64, setSelectedImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  // Note modal state for approve/reject
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' | 'reject'
  const [adminNote, setAdminNote] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    loadRequests();
    loadConfig();
    loadPlans();
  }, [filterStatus]);

  const loadPlans = async () => {
    try {
      const res = await adminService.getPlans();
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error("Lỗi tải danh sách gói:", err);
    }
  };

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await adminService.getPromoRequests(filterStatus);
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error("Lỗi tải danh sách yêu cầu:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const loadConfig = async () => {
    try {
      const res = await adminService.getPromoConfig();
      const cfg = res.data.config;
      if (cfg) {
        setConfig({
          title: cfg.title || 'Sự Kiện Quảng Bá Nhận Gói Miễn Phí',
          platformName: cfg.platformName || 'TikTok',
          applicablePlans: cfg.applicablePlans || [],
          promoImageUrl: cfg.promoImageUrl || '',
          hashtags: cfg.hashtags || [],
          instructions: cfg.instructions || '',
          isActive: cfg.isActive !== undefined ? cfg.isActive : true
        });
        setHashtagsInput(cfg.hashtags?.join(', ') || '');
        setImagePreview(cfg.promoImageUrl || '');
      }
    } catch (err) {
      console.error("Lỗi tải cấu hình:", err);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({ icon: 'warning', title: 'Ảnh quá lớn!', text: 'Dung lượng ảnh quảng bá tối đa 5MB. Vui lòng chọn ảnh nhỏ hơn!', background: '#181824', color: '#fff', confirmButtonColor: '#f59e0b' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageBase64(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      await adminService.updatePromoConfig({
        title: config.title,
        platformName: config.platformName,
        applicablePlans: config.applicablePlans,
        promoImageBase64: selectedImageBase64 || undefined,
        hashtags: hashtagsInput,
        instructions: config.instructions,
        isActive: config.isActive
      });

      Swal.fire({
        icon: 'success',
        title: 'Lưu cấu hình thành công! 🎉',
        text: 'Chiến dịch Quảng bá TikTok / Mạng xã hội đã được cập nhật.',
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });

      setSelectedImageBase64('');
      loadConfig();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lưu cấu hình thất bại!',
        text: err.response?.data?.error || err.message,
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleOpenActionModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setAdminNote(type === 'approve' ? 'Đã kiểm tra clip TikTok hợp lệ. Nâng cấp gói thành công!' : 'Clip TikTok không hợp lệ hoặc thiếu hashtag quy định.');
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest) return;
    setProcessingAction(true);
    try {
      if (actionType === 'approve') {
        const res = await adminService.approvePromoRequest(selectedRequest._id, adminNote);
        Swal.fire({
          icon: 'success',
          title: 'Đã duyệt kích hoạt gói! 🎉',
          text: res.data.message || "Tài khoản người dùng đã được nâng cấp cước thành công.",
          background: '#181824',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      } else {
        const res = await adminService.rejectPromoRequest(selectedRequest._id, adminNote);
        Swal.fire({
          icon: 'info',
          title: 'Đã từ chối yêu cầu!',
          text: res.data.message || "Đã phản hồi lý do từ chối cho người dùng.",
          background: '#181824',
          color: '#fff',
          confirmButtonColor: '#f59e0b'
        });
      }
      setSelectedRequest(null);
      loadRequests();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi xử lý!',
        text: err.response?.data?.error || err.message,
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setProcessingAction(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px 32px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Video color="#ec4899" size={28} /> Quản lý TikTok Promotion
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Duyệt yêu cầu nhận gói FREE qua quảng bá TikTok & Cấu hình hình ảnh, hashtag cho chiến dịch.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '4px' }}>
            <button 
              onClick={() => setActiveTab('requests')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'requests' ? 'var(--primary-purple)' : 'transparent',
                color: activeTab === 'requests' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Danh sách Yêu cầu ({requests.length})
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'config' ? 'var(--primary-purple)' : 'transparent',
                color: activeTab === 'config' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cấu hình Chiến dịch
            </button>
          </div>
        </div>

        {/* TAB 1: DANH SÁCH YÊU CẦU DUYỆT */}
        {activeTab === 'requests' && (
          <div>
            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Lọc trạng thái:</span>
              {['', 'PENDING', 'APPROVED', 'REJECTED'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    background: filterStatus === st ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-card)',
                    color: filterStatus === st ? '#c084fc' : 'var(--text-secondary)',
                    borderColor: filterStatus === st ? '#c084fc' : 'var(--border-color)',
                    fontSize: '12.5px',
                    fontWeight: filterStatus === st ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {st === '' ? 'Tất cả' : st === 'PENDING' ? '⏳ Chờ duyệt' : st === 'APPROVED' ? '✅ Đã duyệt' : '❌ Đã từ chối'}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '16px 20px' }}>Người dùng / Email</th>
                    <th style={{ padding: '16px 20px' }}>Gói đăng ký</th>
                    <th style={{ padding: '16px 20px' }}>Link Clip TikTok</th>
                    <th style={{ padding: '16px 20px' }}>Ngày gửi</th>
                    <th style={{ padding: '16px 20px' }}>Trạng thái</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRequests ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>Chưa có yêu cầu quảng bá TikTok nào.</td>
                    </tr>
                  ) : requests.map(req => (
                    <tr key={req._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      
                      {/* User */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{req.user?.name || 'N/A'}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{req.email || req.user?.email}</div>
                      </td>

                      {/* Plan */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '4px 10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                          {req.planName} ({req.planCode})
                        </span>
                      </td>

                      {/* TikTok Link */}
                      <td style={{ padding: '16px 20px' }}>
                        <a 
                          href={req.tiktokUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: '#ec4899', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 'bold', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          <ExternalLink size={14} /> View TikTok Clip
                        </a>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                        {new Date(req.createdAt).toLocaleString('vi-VN')}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 20px' }}>
                        {req.status === 'PENDING' ? (
                          <span style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 'bold' }}>
                            ⏳ Chờ duyệt
                          </span>
                        ) : req.status === 'APPROVED' ? (
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 'bold' }}>
                            ✅ Đã duyệt
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 'bold' }}>
                            ❌ Từ chối
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        {req.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleOpenActionModal(req, 'approve')}
                              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <CheckCircle size={14} /> Duyệt & Nâng gói
                            </button>
                            <button
                              onClick={() => handleOpenActionModal(req, 'reject')}
                              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <XCircle size={14} /> Từ chối
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {req.adminNote || 'Hoàn tất'}
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CẤU HÌNH CHIẾN DỊCH */}
        {activeTab === 'config' && (
          <form onSubmit={handleSaveConfig} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '28px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* 0. THÔNG TIN CHUNG CHIẾN DỊCH & BẬT/TẮT */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Tên Sự kiện / Chiến dịch
                </label>
                <input 
                  type="text" 
                  value={config.title} 
                  onChange={e => setConfig({...config, title: e.target.value})}
                  placeholder="Sự Kiện Quảng Bá Nhận Gói Miễn Phí"
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Nền tảng / Mạng xã hội
                </label>
                <input 
                  type="text" 
                  value={config.platformName} 
                  onChange={e => setConfig({...config, platformName: e.target.value})}
                  placeholder="TikTok / YouTube / Facebook..."
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* Trạng thái Bật / Tắt sự kiện */}
            <div style={{ background: 'var(--bg-input)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Trạng thái Chiến dịch Quảng Bá</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bật hoặc Tắt tính năng Quảng bá nhận gói trên giao diện Khách hàng.</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', color: config.isActive ? '#10b981' : '#ef4444' }}>
                <input 
                  type="checkbox" 
                  checked={config.isActive} 
                  onChange={e => setConfig({...config, isActive: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                {config.isActive ? 'Đang Hoạt Động (BẬT)' : 'Đã Tạm Dừng (TẮT)'}
              </label>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

            {/* CÁC GÓI ĐƯỢC ÁP DỤNG SỰ KIỆN */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Chọn các Gói áp dụng Sự kiện này
              </label>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Tích chọn gói nào client được phép chọn quảng bá nhận FREE. (Nếu không chọn gói nào = Áp dụng cho TẤT CẢ các gói trả phí).
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {plans.filter(p => p.code !== 'FREE').map(plan => {
                  const isChecked = config.applicablePlans?.includes(plan.code);
                  return (
                    <label 
                      key={plan._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: isChecked ? 'rgba(168, 85, 247, 0.15)' : 'var(--bg-input)',
                        border: '1px solid ' + (isChecked ? '#c084fc' : 'var(--border-color)'),
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: isChecked ? 'bold' : 'normal',
                        color: isChecked ? '#c084fc' : 'var(--text-primary)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          let updatedPlans = [...(config.applicablePlans || [])];
                          if (e.target.checked) {
                            if (!updatedPlans.includes(plan.code)) updatedPlans.push(plan.code);
                          } else {
                            updatedPlans = updatedPlans.filter(code => code !== plan.code);
                          }
                          setConfig({...config, applicablePlans: updatedPlans});
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      {plan.name} ({plan.code})
                    </label>
                  );
                })}
              </div>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

            {/* 1. UPLOAD ẢNH QUẢNG BÁ */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px', flex: 1 }}>
                Ảnh quảng bá hệ thống (Promo Banner Image)
              </label>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Tải lên hình ảnh quảng cáo Veltrix Voice. Ảnh này sẽ hiển thị ở màn hình Client để người dùng tải về đăng TikTok/MXH.
              </p>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '220px', height: '140px', background: 'var(--bg-input)', border: '2px dashed var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '10px' }}>
                      <Image size={32} style={{ marginBottom: '6px', opacity: 0.5 }} />
                      <div style={{ fontSize: '11px' }}>Chưa có ảnh</div>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label className="btn-small" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', background: 'var(--primary-purple)', color: '#fff' }}>
                    <Upload size={16} /> Chọn ảnh mới (Max 5MB)
                    <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ display: 'none' }} />
                  </label>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Hoặc dán URL ảnh có sẵn:
                  </div>
                  <input 
                    type="url" 
                    value={config.promoImageUrl} 
                    onChange={e => {
                      setConfig({...config, promoImageUrl: e.target.value});
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://res.cloudinary.com/..."
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

            {/* 2. HASHTAGS QUY ĐỊNH */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Danh sách Hashtags quy định (Ngăn cách bằng dấu phẩy)
              </label>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Người dùng bắt buộc phải gắn các hashtags này trong bài đăng của họ.
              </p>
              <input 
                type="text" 
                value={hashtagsInput} 
                onChange={e => setHashtagsInput(e.target.value)}
                placeholder="#VeltrixVoice, #AIVoice, #VoiceGenerator..."
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13.5px' }}
              />
            </div>

            <hr style={{ borderColor: 'var(--border-color)', opacity: 0.5 }} />

            {/* 3. HƯỚNG DẪN CHI TIẾT */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Hướng dẫn chi tiết cho Client
              </label>
              <textarea 
                rows={5} 
                value={config.instructions} 
                onChange={e => setConfig({...config, instructions: e.target.value})}
                placeholder="1. Tải ảnh quảng bá bên dưới về máy..."
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button 
                type="submit" 
                disabled={savingConfig}
                className="btn-cta" 
                style={{ padding: '12px 28px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Save size={16} /> {savingConfig ? 'Đang lưu...' : 'Lưu thay đổi Cấu hình'}
              </button>
            </div>

          </form>
        )}

        {/* MODAL DUYỆT / TỪ CHỐI */}
        {selectedRequest && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-primary)' }}>
                {actionType === 'approve' ? '✅ Xác nhận Duyệt & Nâng cấp Gói' : '❌ Từ chối Yêu cầu TikTok Promo'}
              </h3>
              
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Người dùng: <b>{selectedRequest.email}</b> | Gói: <b style={{ color: '#c084fc' }}>{selectedRequest.planName}</b>
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Ghi chú gửi người dùng / Lưu vết Admin</label>
                <textarea 
                  rows={3} 
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button 
                  onClick={handleConfirmAction}
                  disabled={processingAction}
                  style={{ 
                    padding: '8px 20px', 
                    background: actionType === 'approve' ? '#10b981' : '#ef4444', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontWeight: 'bold' 
                  }}
                >
                  {processingAction ? 'Đang xử lý...' : actionType === 'approve' ? 'Xác nhận Nâng gói' : 'Xác nhận Từ chối'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
