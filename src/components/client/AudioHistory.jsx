import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Download, Play, Pause, History, Music, MoreVertical, Trash2 } from 'lucide-react';
import { deleteAudioItem } from '../../redux/slices/ttsSlice';

export default function AudioHistory() {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.tts);
  
  // Trạng thái phát âm thanh: lưu ID bài đang phát và ref tới đối tượng Audio
  const [playingId, setPlayingId] = useState(null);
  const currentAudioRef = useRef(null);

  // Trạng thái menu 3 chấm
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dọn dẹp âm thanh khi component unmount
  useEffect(() => {
    return () => {
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
    a.download = `veltrix_${item.id}.mp3`;
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

    // 2. Nếu đang phát bài khác -> Tắt ngay bài trước đó
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    // 3. Khởi tạo bài hát mới
    const newAudio = new Audio(item.audioUrl);
    currentAudioRef.current = newAudio;
    setPlayingId(item.id);

    // Khi bài đọc phát xong tự động trả lại nút Play ▶
    newAudio.onended = () => {
      setPlayingId(null);
      currentAudioRef.current = null;
    };

    newAudio.onerror = (e) => {
      console.error("Lỗi phát audio:", e);
      setPlayingId(null);
    };

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

  return (
    <div className="history-panel">
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <History size={16} /> Lịch Sử Tạo Audio ({history.length})
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <Music size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>Chưa có lịch sử phát sinh âm thanh nào.</p>
          <p style={{ fontSize: '11.5px', marginTop: '6px' }}>Nhấn <b>Generate Audio</b> để bắt đầu nghe và tải xuống bài đọc của bạn.</p>
        </div>
      ) : (
        history.map((item) => {
          const isPlaying = playingId === item.id;
          const isMenuOpen = menuOpenId === item.id;
          return (
            <div 
              key={item.id} 
              className="history-card"
              style={{
                borderColor: isPlaying ? 'var(--primary-purple)' : 'var(--border-color)',
                background: isPlaying ? 'rgba(168, 85, 247, 0.08)' : 'var(--bg-input)',
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
                    background: 'var(--bg-secondary, #1e1e2e)',
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

              <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', paddingRight: '28px' }}>
                "{item.text}"
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>{item.voiceId}</span>
                <span>{item.time}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {/* Nút Nghe / Tạm dừng biểu tượng || linh hoạt */}
                <button 
                  className="btn-small" 
                  onClick={() => handleTogglePlay(item)}
                  style={{
                    color: isPlaying ? '#c084fc' : 'var(--text-primary)',
                    background: isPlaying ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.06)',
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

                <button className="btn-small" onClick={() => handleDownload(item)}>
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
