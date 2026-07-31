import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Download, Play, Pause, History, Music, MoreVertical, Trash2, Zap, X } from 'lucide-react';
import { deleteAudioItem } from '../../redux/slices/ttsSlice';
import { playAudioGlobal, registerAudioListener } from '../../utils/audioManager';
import { clientService } from '../../services/clientService';
import Swal from 'sweetalert2';

export default function AudioHistory() {
  const dispatch = useDispatch();
  // ✅ SỬA 1: Gán mặc định history = [] nếu state.tts hoặc history bị undefined/null
  const { history = [] } = useSelector((state) => state.tts || {});
  
  // Trạng thái phát âm thanh: lưu ID bài đang phát và ref tới đối tượng Audio
  const [playingId, setPlayingId] = useState(null);
  const currentAudioRef = useRef(null);

  // Trạng thái menu 3 chấm
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  // Trạng thái Menu Chuột Phải Thư Mục (Context Menu)
  const [folderContextMenu, setFolderContextMenu] = useState(null);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
      setFolderContextMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dọn dẹp âm thanh khi component unmount + Đăng ký Global Audio Manager
  useEffect(() => {
    const unregister = registerAudioListener((activeAudio) => {
      if (currentAudioRef.current && currentAudioRef.current !== activeAudio) {
        currentAudioRef.current.pause();
        setPlayingId(null);
      }
    });

    return () => {
      unregister();
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const handleDownload = (item) => {
    let downloadUrl = item.audioUrl;
    
    // Nếu là link Cloudinary, chèn cờ fl_attachment để ép trình duyệt tải file xuống
    if (downloadUrl && downloadUrl.includes('res.cloudinary.com')) {
      downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    const cleanTitle = item.title ? item.title.replace(/[^a-zA-Z0-9_ -]/g, '').trim() : '';
    a.download = cleanTitle ? `${cleanTitle}.mp3` : `veltrix_${item.id}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTogglePlay = (item) => {
    // 1. Nếu đang phát đúng bài này -> Tạm dừng (Pause)
    if (playingId === item.id && currentAudioRef.current) {
      currentAudioRef.current.pause();
      setPlayingId(null);
      return;
    }

    // 2. Khởi tạo bài hát mới
    const newAudio = new Audio(item.audioUrl);
    currentAudioRef.current = newAudio;
    setPlayingId(item.id);

    newAudio.onerror = (e) => {
      console.error("Lỗi phát audio:", e);
      setPlayingId(null);
    };

    playAudioGlobal(newAudio, () => {
      setPlayingId(null);
      currentAudioRef.current = null;
    });

    newAudio.play().catch(err => {
      console.error("Không thể phát audio:", err);
      setPlayingId(null);
    });
  };

  const handleDelete = (item) => {
    // Nếu đang phát bài này thì tắt trước
    if (playingId === item.id && currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setPlayingId(null);
    }
    setMenuOpenId(null);
    dispatch(deleteAudioItem(item.id));
  };

  const [userFolders, setUserFolders] = useState([]);
  const [activeFolderFilter, setActiveFolderFilter] = useState('Tất cả');

  // Lấy danh sách thư mục đã tạo của người dùng từ CSDL
  const fetchUserFolders = async () => {
    try {
      const res = await clientService.getFolders();
      const names = (res.data?.folders || []).map(f => f.name);
      setUserFolders(names);
    } catch (e) {}
  };

  useEffect(() => {
    fetchUserFolders();
    const handleFolderChange = () => fetchUserFolders();
    window.addEventListener('veltrix_folder_changed', handleFolderChange);
    return () => window.removeEventListener('veltrix_folder_changed', handleFolderChange);
  }, []);

  // Tổng hợp tất cả thư mục (từ CSDL + từ Lịch sử phát sinh)
  const historyFolderNames = (history || []).map(item => item.folder || 'Mặc định').filter(Boolean);
  const availableFolderFilters = ['Tất cả', ...new Set(['Mặc định', ...userFolders, ...historyFolderNames])];

  const filteredHistory = activeFolderFilter === 'Tất cả' 
    ? (history || []) 
    : (history || []).filter(item => (item.folder || 'Mặc định') === activeFolderFilter);

  // Xử lý Sự Kiện Chuột Phải Vừa Nhấp Vào Thư Mục
  const handleFolderContextMenu = (e, folderName) => {
    if (folderName === 'Tất cả' || folderName === 'Mặc định') return;
    e.preventDefault();
    e.stopPropagation();
    setFolderContextMenu({
      x: e.clientX,
      y: e.clientY,
      folderName
    });
  };

  const handleDeleteFolder = async (folderName) => {
    setFolderContextMenu(null);
    const result = await Swal.fire({
      title: `Xóa Thư Mục "${folderName}"?`,
      text: "Bạn có chắc chắn muốn xóa thư mục này? (Các bài đọc trong thư mục này sẽ giữ nguyên nhưng chuyển về Thư mục Mặc định)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý xóa 🗑️',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await clientService.deleteFolder(encodeURIComponent(folderName));
        if (activeFolderFilter === folderName) {
          setActiveFolderFilter('Tất cả');
        }

        // Bắn event thông báo xóa thư mục để sync với TextEditor
        window.dispatchEvent(new CustomEvent('veltrix_folder_changed'));

        Swal.fire({
          icon: 'success',
          title: 'Đã xóa thư mục!',
          text: `Đã xóa thư mục "${folderName}" thành công.`,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi xóa thư mục',
          text: err.response?.data?.error || err.message,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  return (
    <div className="history-panel">
      {/* Header Lịch Sử */}
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <History size={16} /> Lịch Sử Tạo Audio ({filteredHistory?.length || 0})
      </div>

      {/* 📁 BỘ LỌC THƯ MỤC DỰ ÁN DẠNG DROPDOWN CHUẨN UX */}
      {availableFolderFilters && availableFolderFilters.length > 0 && (
        <div style={{ marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <select
              value={activeFolderFilter}
              onChange={(e) => setActiveFolderFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {availableFolderFilters.map(f => {
                const count = f === 'Tất cả' 
                  ? (history || []).length 
                  : (history || []).filter(item => (item.folder || 'Mặc định') === f).length;
                return (
                  <option key={f} value={f} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                    {f === 'Tất cả' ? `🌐 Tất cả thư mục (${count})` : `📁 ${f} (${count})`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Nút Xóa Thư Mục Được Chọn (nếu là thư mục tự tạo) */}
          {activeFolderFilter !== 'Tất cả' && activeFolderFilter !== 'Mặc định' && (
            <button
              onClick={() => handleDeleteFolder(activeFolderFilter)}
              className="btn-small"
              style={{
                padding: '8px 10px',
                fontSize: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title={`Xóa thư mục "${activeFolderFilter}"`}
            >
              <Trash2 size={13} /> Xóa
            </button>
          )}
        </div>
      )}

      {/* Danh Sách Thẻ Lịch Sử */}
      {(!filteredHistory || filteredHistory.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <Music size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>Chưa có lịch sử phát sinh âm thanh nào trong thư mục này.</p>
          <p style={{ fontSize: '11.5px', marginTop: '6px' }}>Nhấn <b>Generate Audio</b> để bắt đầu nghe và tải xuống bài đọc của bạn.</p>
        </div>
      ) : (
        filteredHistory.map((item) => {
          // CARD CHỜ OPTIMISTIC KHI ĐANG TỔNG HỢP AUDIO
          if (item.isPending) {
            return (
              <div 
                key={item.id} 
                className="history-card"
                style={{
                  border: '1px dashed #06b6d4',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
                  position: 'relative',
                  boxShadow: '0 0 16px rgba(6, 182, 212, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    color: '#06b6d4', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    padding: '3px 8px',
                    borderRadius: '12px'
                  }}>
                    <Zap size={13} className="spin" /> ⚡ ĐANG TẠO AUDIO AI...
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.time}</span>
                </div>

                {item.title && (
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-purple)', marginBottom: '4px' }}>
                    📌 {item.title}
                  </div>
                )}

                <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', opacity: 0.9 }}>
                  "{item.text}"
                </div>

                {/* SÓNG ÂM THANH ANIMATION SỐNG ĐỘNG */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#c084fc', marginRight: '6px', fontWeight: '600' }}>AI Spectrum:</span>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '14px' }}>
                    <div className="wave-bar" style={{ animationDelay: '0.1s' }} />
                    <div className="wave-bar" style={{ animationDelay: '0.3s' }} />
                    <div className="wave-bar" style={{ animationDelay: '0.2s' }} />
                    <div className="wave-bar" style={{ animationDelay: '0.4s' }} />
                    <div className="wave-bar" style={{ animationDelay: '0.15s' }} />
                  </div>
                </div>
                <style>{`
                  .wave-bar {
                    width: 3px;
                    height: 100%;
                    background: #06b6d4;
                    border-radius: 2px;
                    animation: waveJump 0.8s ease-in-out infinite alternate;
                  }
                  @keyframes waveJump {
                    0% { height: 20%; background: #a855f7; }
                    100% { height: 100%; background: #06b6d4; }
                  }
                `}</style>
              </div>
            );
          }

          const isPlaying = playingId === item.id;
          const isMenuOpen = menuOpenId === item.id;
          return (
            <div 
              key={item.id} 
              className="history-card"
              style={{
                borderColor: isPlaying ? 'var(--primary-purple)' : 'var(--border-color)',
                background: isPlaying ? 'rgba(168, 85, 247, 0.08)' : 'var(--bg-card)',
                position: 'relative'
              }}
            >
              {/* Nút 3 chấm ⋮ góc trên bên phải */}
              <div style={{ position: 'absolute', top: '8px', right: '8px' }} ref={isMenuOpen ? menuRef : null}>
                <button
                  onClick={() => setMenuOpenId(isMenuOpen ? null : item.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '4px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  title="Tùy chọn"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    zIndex: 100,
                    minWidth: '140px',
                    overflow: 'hidden',
                    animation: 'fadeInScale 0.15s ease-out'
                  }}>
                    <button
                      onClick={() => handleDelete(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '10px 14px',
                        border: 'none',
                        background: 'transparent',
                        color: '#f87171',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Trash2 size={14} /> Xóa bài đọc
                    </button>
                  </div>
                )}
              </div>

              {/* Tên Dự Án (Nếu có) */}
              {item.title && (
                <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--primary-purple)', marginBottom: '4px', paddingRight: '24px' }}>
                  📌 {item.title}
                </div>
              )}

              <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', paddingRight: '28px' }}>
                "{item.text}"
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                <span style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', padding: '2px 6px', borderRadius: '6px', fontWeight: '600' }}>
                  📁 {item.folder || 'Mặc định'}
                </span>
                <span>{item.voiceId} • {item.time}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {/* Nút Nghe / Tạm dừng */}
                <button 
                  className="btn-small" 
                  onClick={() => handleTogglePlay(item)}
                  style={{
                    color: isPlaying ? '#c084fc' : 'var(--text-primary)',
                    background: isPlaying ? 'rgba(168, 85, 247, 0.25)' : 'var(--bg-input)',
                    borderColor: isPlaying ? '#a855f7' : 'var(--border-color)',
                    fontWeight: isPlaying ? 'bold' : 'normal'
                  }}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={12} fill="currentColor" color="#c084fc" /> Tạm dừng
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" /> Nghe
                    </>
                  )}
                </button>

                <button className="btn-small" onClick={() => handleDownload(item)} style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                  <Download size={12} /> Tải MP3
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}