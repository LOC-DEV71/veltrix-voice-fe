import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { clientService } from '../../services/clientService';
import Swal from 'sweetalert2';
import { Trash2, Edit, PlusCircle, Search, Mic, Volume2, Sparkles, RefreshCw, Play, Pause, ShieldCheck } from 'lucide-react';

export default function VoiceManagement() {
  const [voices, setVoices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentVoice, setCurrentVoice] = useState(null);
  
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [playingPreview, setPlayingPreview] = useState(false);
  const audioRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    voiceId: '',
    provider: 'msedge',
    language: 'vi-VN',
    gender: 'Nữ',
    badge: '',
    desc: '',
    sampleText: 'Xin chào, tôi là giọng đọc AI của Veltrix Voice. Rất vui được đồng hành cùng bạn!',
    sampleAudioUrl: '',
    requiredRole: 'FREE',
    status: 'ACTIVE'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resVoices, resPlans] = await Promise.all([
        adminService.getVoices(),
        adminService.getPlans()
      ]);
      setVoices(resVoices.data.voices || []);
      setPlans(resPlans.data.plans || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu giọng đọc và gói cước:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (voice = null) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingPreview(false);
    }

    if (voice) {
      setCurrentVoice(voice);
      setFormData({
        name: voice.name,
        voiceId: voice.voiceId,
        provider: voice.provider || 'msedge',
        language: voice.language || 'vi-VN',
        gender: voice.gender || 'Nữ',
        badge: voice.badge || '',
        desc: voice.desc || '',
        sampleText: voice.sampleText || 'Xin chào, tôi là giọng đọc AI của Veltrix Voice. Rất vui được đồng hành cùng bạn!',
        sampleAudioUrl: voice.sampleAudioUrl || '',
        requiredRole: voice.requiredRole || 'FREE',
        status: voice.status || 'ACTIVE'
      });
    } else {
      setCurrentVoice(null);
      setFormData({
        name: '',
        voiceId: '',
        provider: 'msedge',
        language: 'vi-VN',
        gender: 'Nữ',
        badge: 'Khuyên dùng',
        desc: 'Giọng đọc truyền cảm, tự nhiên, thích hợp làm video ngắn, tin tức, đọc truyện.',
        sampleText: 'Xin chào, tôi là giọng đọc AI của Veltrix Voice. Rất vui được đồng hành cùng bạn!',
        sampleAudioUrl: '',
        requiredRole: 'FREE',
        status: 'ACTIVE'
      });
    }
    setShowModal(true);
  };

  // 1. Thử nghe trực tiếp câu chữ Admin vừa nhập bằng AI
  const handleTestAudio = async () => {
    if (!formData.voiceId) {
      Swal.fire({ icon: 'warning', title: 'Thiếu Voice ID!', text: 'Vui lòng nhập Voice ID trước khi thử giọng!', background: '#181824', color: '#fff', confirmButtonColor: '#f59e0b' });
      return;
    }
    if (!formData.sampleText.trim()) {
      Swal.fire({ icon: 'warning', title: 'Thiếu nội dung!', text: 'Vui lòng nhập văn bản mẫu cho AI đọc thử!', background: '#181824', color: '#fff', confirmButtonColor: '#f59e0b' });
      return;
    }

    if (playingPreview && audioRef.current) {
      audioRef.current.pause();
      setPlayingPreview(false);
      return;
    }

    setGeneratingAudio(true);
    try {
      const response = await clientService.previewTTS({
        text: formData.sampleText,
        voice: formData.voiceId,
        rate: 1,
        pitch: '+0Hz'
      });

      const blob = response.data;
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingPreview(false);
      };

      await audio.play();
      setPlayingPreview(true);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi thử giọng AI!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
    } finally {
      setGeneratingAudio(false);
    }
  };

  // 2. Tự động tạo MP3 mẫu & Cloudinary từ văn bản Admin vừa nhập
  const handleAutoGenerateCloudinarySample = async () => {
    if (!formData.voiceId) {
      Swal.fire({ icon: 'warning', title: 'Thiếu Voice ID!', text: 'Vui lòng nhập Voice ID trước khi tạo MP3 mẫu!', background: '#181824', color: '#fff', confirmButtonColor: '#f59e0b' });
      return;
    }
    if (!formData.sampleText.trim()) {
      Swal.fire({ icon: 'warning', title: 'Thiếu nội dung!', text: 'Vui lòng nhập văn bản mẫu cho AI đọc!', background: '#181824', color: '#fff', confirmButtonColor: '#f59e0b' });
      return;
    }

    setGeneratingAudio(true);
    try {
      const res = await adminService.generateSampleVoiceAudio({
        voiceId: formData.voiceId,
        text: formData.sampleText
      });

      if (res.data.audioUrl) {
        setFormData(prev => ({ ...prev, sampleAudioUrl: res.data.audioUrl }));
        Swal.fire({
          icon: 'success',
          title: 'Tạo MP3 mẫu thành công! 🎉',
          text: 'Đã tổng hợp giọng nói AI từ văn bản mẫu & tự động lưu đường dẫn Cloudinary!',
          background: '#181824',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi tạo MP3 mẫu!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
    } finally {
      setGeneratingAudio(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentVoice) {
        await adminService.updateVoice(currentVoice._id, formData);
        Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Cập nhật thông tin giọng đọc AI thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      } else {
        await adminService.createVoice(formData);
        Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Thêm giọng đọc AI mới thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
    }
  };

  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa giọng đọc [${name}] không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa',
      cancelButtonText: 'Hủy',
      background: '#181824',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#4b5563'
    });

    if (res.isConfirmed) {
      try {
        await adminService.deleteVoice(id);
        Swal.fire({ icon: 'success', title: 'Đã xóa!', text: 'Xóa giọng đọc AI thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
        loadData();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi xóa!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
      }
    }
  };

  const filteredVoices = voices.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.voiceId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Quản lý Giọng đọc AI</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Tùy chỉnh danh sách giọng đọc, nhãn nổi bật, mô tả và liên kết phân quyền với Gói Cước Động từ Database</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-purple)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          <PlusCircle size={18} /> Thêm Giọng Đọc Mới
        </button>
      </div>

      {/* Search Input */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm giọng đọc theo tên, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 38px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Table List */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Tên & Mô tả Giọng đọc</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Nhà Cung Cấp</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Voice ID</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Nhãn Badge</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Cấp độ Gói cước</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Trạng thái</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</td>
                </tr>
              ) : filteredVoices.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Không tìm thấy giọng đọc nào</td>
                </tr>
              ) : (
                filteredVoices.map((voice) => {
                  const reqPlan = plans.find(p => p.code === voice.requiredRole);
                  const planLabel = reqPlan ? `${reqPlan.name} (${reqPlan.code})` : (voice.requiredRole === 'FREE' || voice.requiredRole === 'ROLE_USER' ? 'Tất cả (Miễn phí)' : voice.requiredRole);
                  const isFree = voice.requiredRole === 'FREE' || voice.requiredRole === 'ROLE_USER';

                  const isAws = voice.provider?.includes('AWS') || voice.voiceId.startsWith('aws-');
                  const isGoogle = voice.provider?.includes('Google');

                  return (
                    <tr key={voice._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isAws ? 'rgba(168, 85, 247, 0.15)' : 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                            <Mic size={18} color={isAws ? '#a855f7' : 'var(--primary-purple)'} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {voice.name}
                              {voice.gender && (
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                                  ({voice.gender === 'Female' || voice.gender === 'Nữ' ? 'Nữ' : 'Nam'})
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {voice.desc || 'Chưa có mô tả'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '12px' }}>
                        {isAws ? (
                          <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                            ⚡ AWS Polly
                          </span>
                        ) : isGoogle ? (
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                            🌐 Google TTS
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                            ☁️ Microsoft HD
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>{voice.voiceId}</td>
                      <td style={{ padding: '16px', fontSize: '13px' }}>
                        {voice.badge ? (
                          <span style={{ fontSize: '11px', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                            {voice.badge}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px' }}>
                        {isFree ? (
                          <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>Miễn phí (Tất cả)</span>
                        ) : (
                          <span style={{ color: '#ec4899', fontWeight: 'bold', fontSize: '11px', background: 'rgba(236, 72, 153, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>Yêu cầu {planLabel}</span>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          background: voice.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: voice.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                        }}>
                          {voice.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            onClick={() => handleOpenModal(voice)}
                            style={{ background: '#3b82f6', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                            title="Chỉnh sửa giọng đọc"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(voice._id, voice.name)}
                            style={{ background: '#ef4444', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '640px', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic color="var(--primary-purple)" size={20} /> {currentVoice ? 'Cập Nhật Cấu Hình Giọng Đọc AI' : 'Thêm Giọng Đọc AI Mới'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>Tên Hiển Thị (Name)</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Hoài My (Nữ)" style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13.5px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>Nhà Cung Cấp Engine (TTS Provider)</label>
                  <select 
                    value={formData.provider} 
                    onChange={e => setFormData({...formData, provider: e.target.value})} 
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13.5px', fontWeight: 'bold' }}
                  >
                    <option value="AWS Polly Neural">⚡ AWS Polly Neural (Amazon AWS API)</option>
                    <option value="Microsoft Neural">☁️ Microsoft Neural (Edge HD)</option>
                    <option value="Google TTS">🌐 Google TTS (Google API)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {formData.provider?.includes('AWS') || formData.provider === 'aws' 
                    ? 'Voice ID (Mã Giọng Đọc AWS Polly - ví dụ: Joanna, Matthew, Zhiyu, Kazuha, Lupe)' 
                    : formData.provider?.includes('Google') || formData.provider === 'google'
                    ? 'Voice ID (Mã Ngôn Ngữ Google - ví dụ: vi, en, ja)'
                    : 'Voice ID (Mã Giọng Đọc Microsoft Edge ID - ví dụ: vi-VN-HoaiMyNeural)'}
                </label>
                <input 
                  required 
                  type="text" 
                  value={formData.voiceId} 
                  onChange={e => setFormData({...formData, voiceId: e.target.value})} 
                  placeholder={
                    formData.provider?.includes('AWS') || formData.provider === 'aws'
                      ? 'aws-Joanna / aws-Matthew / aws-Zhiyu / aws-Kazuha / aws-Lupe hoặc Joanna, Matthew...'
                      : formData.provider?.includes('Google') || formData.provider === 'google'
                      ? 'vi / en / ja / ko / zh...'
                      : 'vi-VN-HoaiMyNeural / vi-VN-NamMinhNeural...'
                  } 
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13.5px' }} 
                />
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {formData.provider?.includes('AWS') || formData.provider === 'aws' ? (
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>⚡ Đọc trực tiếp từ Khóa API AWS Polly trong Cài Đặt Hệ Thống (`/admin/settings`).</span>
                  ) : formData.provider?.includes('Google') || formData.provider === 'google' ? (
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>🌐 Sử dụng Engine Google Translate API.</span>
                  ) : (
                    <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>☁️ Sử dụng Engine Microsoft Edge Neural HD.</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>Nhãn Tag (Badge)</label>
                  <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="Khuyên dùng / PRO Only" style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13.5px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>Giới tính</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13.5px' }}>
                    <option value="Nữ">Nữ (Female)</option>
                    <option value="Nam">Nam (Male)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>Yêu Cầu Hạng Gói (Động từ DB)</label>
                  <select 
                    value={formData.requiredRole} 
                    onChange={e => setFormData({...formData, requiredRole: e.target.value})} 
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13.5px' }}
                  >
                    <option value="FREE">Tất cả người dùng (FREE)</option>
                    {plans.map(p => (
                      <option key={p._id} value={p.code}>
                        Chỉ Hạng {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>Mô Tả Đặc Trưng Giọng Đọc</label>
                <input type="text" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="Giọng nữ truyền cảm, tự nhiên, thích hợp làm video ngắn, đọc truyện." style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13.5px' }} />
              </div>

              {/* Ô TÙY CHỈNH VĂN BẢN AI ĐỌC THỬ (CUSTOM SAMPLE TEXT) */}
              <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} /> Nội Dung Văn Bản Cho AI Nói Thử (Custom Sample Text)
                  </label>
                  
                  <button 
                    type="button" 
                    disabled={generatingAudio}
                    onClick={handleTestAudio}
                    style={{ background: playingPreview ? '#ec4899' : '#8b5cf6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {generatingAudio ? <RefreshCw size={14} className="spin" /> : playingPreview ? <Pause size={14} /> : <Play size={14} />}
                    {playingPreview ? 'Đang Phát MP3' : '🔊 Nghe Thử AI Đọc'}
                  </button>
                </div>

                <textarea 
                  rows="3" 
                  value={formData.sampleText} 
                  onChange={e => setFormData({...formData, sampleText: e.target.value})} 
                  placeholder="Nhập nội dung bất kỳ để con AI này nói đoạn văn này khi người dùng bấm nghe thử..."
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Nội dung này sẽ được AI phát âm khi khách bấm nghe thử trên Landing Page hoặc Studio.</span>
                  <button 
                    type="button" 
                    disabled={generatingAudio}
                    onClick={handleAutoGenerateCloudinarySample}
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Sparkles size={13} /> {generatingAudio ? 'Đang tạo Cloudinary...' : 'Lưu Link Audio Cloudinary'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>Đường Dẫn Audio Mẫu MP3 (Sample Audio URL)</label>
                <input type="text" value={formData.sampleAudioUrl} onChange={e => setFormData({...formData, sampleAudioUrl: e.target.value})} placeholder="https://res.cloudinary.com/.../sample.mp3 (Được tự động điền khi bấm nút trên)" style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 24px', background: 'var(--primary-purple)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Cấu Hình Giọng Đọc</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
