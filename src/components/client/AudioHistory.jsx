import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Download, Play, Pause, History, Music, MoreVertical, Trash2, Zap, X, GripVertical, FolderInput, FolderPlus, Edit2 } from 'lucide-react';
import { deleteAudioItem, updateItemFolder, updateItemTitle, reorderHistory } from '../../redux/slices/ttsSlice';
import { playAudioGlobal, registerAudioListener } from '../../utils/audioManager';
import { clientService } from '../../services/clientService';
import Swal from 'sweetalert2';

import { useTranslation } from 'react-i18next';

export default function AudioHistory({ pageData }) {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { history = [] } = useSelector((state) => state.tts || {});
  
  const [playingId, setPlayingId] = useState(null);
  const currentAudioRef = useRef(null);

  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);
  const [folderContextMenu, setFolderContextMenu] = useState(null);

  // Trạng thái kéo thả (Drag and Drop)
  const [draggedIndex, setDraggedIndex] = useState(null);

  const getTF = (field, fallback) => {
    if (!pageData) return fallback;
    const currentLang = i18n.language || 'vi';
    const langData = pageData.translations?.[currentLang] || pageData.translations?.vi || {};
    return langData[field] || fallback;
  };

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

  const getFullAudioUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const backendHost = apiBase.replace(/\/api\/?$/, '');
    return `${backendHost}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleDownload = (item) => {
    let downloadUrl = getFullAudioUrl(item.audioUrl);
    
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
    const playUrl = getFullAudioUrl(item.audioUrl);
    if (!playUrl) return;

    if (playingId === item.id && currentAudioRef.current) {
      currentAudioRef.current.pause();
      setPlayingId(null);
      return;
    }

    const newAudio = new Audio(playUrl);
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

  const historyFolderNames = (history || []).map(item => item.folder || 'Mặc định').filter(Boolean);
  const availableFolderFilters = ['Tất cả', ...new Set(['Mặc định', ...userFolders, ...historyFolderNames])];

  const filteredHistory = activeFolderFilter === 'Tất cả' 
    ? (history || []) 
    : (history || []).filter(item => (item.folder || 'Mặc định') === activeFolderFilter);

  // 📁 Xử lý Di Chuyển Thư Mục Cho Bài Đọc
  const handleMoveFolder = async (item) => {
    setMenuOpenId(null);
    const folderOptions = {};
    const allFolderChoices = [...new Set(['Mặc định', ...userFolders])];
    allFolderChoices.forEach(f => {
      folderOptions[f] = `📁 ${f}`;
    });
    folderOptions['__NEW__'] = '➕ Tạo thư mục mới...';

    const { value: selected } = await Swal.fire({
      title: 'Di chuyển thư mục',
      text: `Chọn thư mục mới cho bài đọc "${item.title || 'Bài đọc'}"`,
      input: 'select',
      inputOptions: folderOptions,
      inputValue: item.folder || 'Mặc định',
      showCancelButton: true,
      confirmButtonText: 'Lưu thay đổi 💾',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#8b5cf6'
    });

    if (!selected) return;

    let targetFolder = selected;
    if (selected === '__NEW__') {
      const { value: newName } = await Swal.fire({
        title: 'Tạo Thư Mục Mới',
        input: 'text',
        inputPlaceholder: 'Nhập tên thư mục mới...',
        showCancelButton: true,
        confirmButtonText: 'Tạo ngay',
        cancelButtonText: 'Hủy',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#8b5cf6'
      });
      if (!newName || !newName.trim()) return;
      targetFolder = newName.trim();
      try {
        await clientService.createFolder({ name: targetFolder });
        fetchUserFolders();
        window.dispatchEvent(new CustomEvent('veltrix_folder_changed'));
      } catch (e) {}
    }

    try {
      await clientService.updateAudioFolder(item.id, targetFolder);
      dispatch(updateItemFolder({ id: item.id, folder: targetFolder }));
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Đã di chuyển sang "${targetFolder}"`,
        showConfirmButton: false,
        timer: 2000,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi di chuyển!',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    }
  };

  // ✏️ Xử lý Đổi Tên Bài Đọc / Dự Án
  const handleRenameTitle = async (item) => {
    setMenuOpenId(null);
    const { value: newTitle } = await Swal.fire({
      title: 'Đổi tên bài đọc / dự án',
      input: 'text',
      inputValue: item.title || '',
      inputPlaceholder: 'Nhập tên mới (Ví dụ: Review iPhone 17)...',
      showCancelButton: true,
      confirmButtonText: 'Đổi tên ✏️',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#8b5cf6'
    });

    if (newTitle === undefined) return;

    try {
      await clientService.updateAudioTitle(item.id, newTitle.trim());
      dispatch(updateItemTitle({ id: item.id, title: newTitle.trim() }));
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Đã đổi tên thành công!',
        showConfirmButton: false,
        timer: 1500,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi đổi tên!',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
      });
    }
  };

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
    if (!folderName || folderName === 'Tất cả' || folderName === 'Mặc định') return;

    const result = await Swal.fire({
      title: 'Xóa thư mục dự án?',
      html: `Bạn có chắc muốn xóa thư mục <b>"${folderName}"</b>?<br/><small style="color: var(--text-secondary)">Các bài đọc bên trong sẽ được giữ nguyên và tự động chuyển về thư mục "Mặc định".</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Đồng ý Xóa 🗑️',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)'
    });

    if (!result.isConfirmed) return;

    try {
      await clientService.deleteFolder(folderName);
      if (activeFolderFilter === folderName) {
        setActiveFolderFilter('Tất cả');
      }
      fetchUserFolders();
      window.dispatchEvent(new CustomEvent('veltrix_folder_changed'));

      Swal.fire({
        icon: 'success',
        title: 'Đã xóa thư mục!',
        timer: 1500,
        showConfirmButton: false,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)'
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
  };

  // 🖐️ Xử Lý Kéo Thả Sắp Xếp Bài Đọc (Drag and Drop)
  const handleDragStart = (e, index, item) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnCard = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      dispatch(reorderHistory({ dragIndex: draggedIndex, hoverIndex: dropIndex }));
    }
    setDraggedIndex(null);
  };

  return (
    <div className="history-panel">
      {/* Header Lịch Sử */}
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <History size={16} /> {getTF('historyTitle', 'LỊCH SỬ TẠO AUDIO')} ({filteredHistory?.length || 0})
      </div>

      {availableFolderFilters && availableFolderFilters.length > 0 && (
        <div style={{ marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <select
              value={activeFolderFilter}
              onChange={(e) => setActiveFolderFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
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
                    {f === 'Tất cả' ? `🌐 ${getTF('allFolders', 'Tất cả thư mục')} (${count})` : `📁 ${f === 'Mặc định' ? getTF('defaultFolder', 'Mặc định') : f} (${count})`}
                  </option>
                );
              })}
            </select>
          </div>

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

      {/* 🛑 MENU NỔI CONTEXT MENU CHUỘT PHẢI THƯ MỤC */}
      {folderContextMenu && (
        <div style={{
          position: 'fixed',
          top: folderContextMenu.y,
          left: folderContextMenu.x,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          zIndex: 9999,
          overflow: 'hidden',
          animation: 'fadeInScale 0.15s ease-out'
        }}>
          <button
            onClick={() => handleDeleteFolder(folderContextMenu.folderName)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 16px',
              border: 'none',
              background: 'transparent',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={14} /> Xóa thư mục "{folderContextMenu.folderName}"
          </button>
        </div>
      )}

      {/* Danh Sách Card Audio */}
      <div className="history-list">
        {(!filteredHistory || filteredHistory.length === 0) ? (
          <div className="empty-history" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            <Music size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p>Chưa có lịch sử tạo audio</p>
          </div>
        ) : (
          filteredHistory.map((item, index) => {
            // CARD CHỜ TẠO AUDIO
            if (item.isPending) {
              return (
                <div 
                  key={item.id} 
                  className="history-card pending-card"
                  style={{
                    border: '1px dashed #06b6d4',
                    background: 'rgba(6, 182, 212, 0.05)',
                    position: 'relative',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
            const isDragging = draggedIndex === index;

            return (
              <div 
                key={item.id} 
                className="history-card"
                draggable
                onDragStart={(e) => handleDragStart(e, index, item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnCard(e, index)}
                style={{
                  borderColor: isPlaying ? 'var(--primary-purple)' : isDragging ? '#06b6d4' : 'var(--border-color)',
                  background: isPlaying ? 'rgba(168, 85, 247, 0.08)' : isDragging ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-card)',
                  position: 'relative',
                  opacity: isDragging ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  marginBottom: '10px'
                }}
              >
                {/* 📌 Thanh Header Thẻ: Nút Kéo Thả + Tiêu Đề + Nút 3 Chấm */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', flex: 1 }}>
                    <div 
                      title="Kéo thả để sắp xếp vị trí" 
                      style={{ color: 'var(--text-secondary)', opacity: 0.5, cursor: 'grab', display: 'flex', alignItems: 'center' }}
                    >
                      <GripVertical size={15} />
                    </div>

                    {item.title ? (
                      <div 
                        onClick={() => handleRenameTitle(item)}
                        title="Nhấp để đổi tên dự án"
                        style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--primary-purple)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        📌 {item.title} <Edit2 size={11} style={{ opacity: 0.5 }} />
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleRenameTitle(item)}
                        title="Nhấp để đặt tên dự án"
                        style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.7, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        ✏️ Đặt tên dự án...
                      </div>
                    )}
                  </div>

                  {/* Nút 3 chấm ⋮ góc trên bên phải */}
                  <div style={{ position: 'relative' }} ref={isMenuOpen ? menuRef : null}>
                    <button
                      onClick={() => setMenuOpenId(isMenuOpen ? null : item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        padding: '3px 6px',
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

                    {/* Dropdown menu 3 chấm */}
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
                        minWidth: '150px',
                        overflow: 'hidden',
                        animation: 'fadeInScale 0.15s ease-out'
                      }}>
                        <button
                          onClick={() => handleRenameTitle(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '10px 14px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Edit2 size={14} color="#c084fc" /> Đổi tên
                        </button>

                        <button
                          onClick={() => handleMoveFolder(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '10px 14px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            borderTop: '1px solid var(--border-color)',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <FolderInput size={14} color="#06b6d4" /> Di chuyển
                        </button>

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
                            whiteSpace: 'nowrap',
                            borderTop: '1px solid var(--border-color)',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Đoạn Văn Bản Trích Dẫn */}
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-primary)', 
                  lineHeight: '1.5', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  "{item.text}"
                </div>

                {/* 📁 Hàng Thông Tin: Thư Mục Đổi Nhanh + Giọng Đọc & Thời Gian */}
                <div style={{ 
                  display: 'flex', 
                  justify: 'space-between', 
                  alignItems: 'center', 
                  fontSize: '11px', 
                  color: 'var(--text-secondary)',
                  marginBottom: '12px',
                  gap: '8px',
                  flexWrap: 'nowrap'
                }}>
                  <span 
                    onClick={() => handleMoveFolder(item)}
                    title="Nhấp để di chuyển thư mục"
                    style={{ 
                      background: 'rgba(6, 182, 212, 0.12)', 
                      color: '#06b6d4', 
                      padding: '3px 8px', 
                      borderRadius: '6px', 
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.12)'}
                  >
                    📁 {item.folder || 'Mặc định'} <FolderInput size={11} />
                  </span>

                  <span style={{ whiteSpace: 'nowrap', opacity: 0.8, fontSize: '11px' }}>
                    {item.voiceId} • {item.time}
                  </span>
                </div>
                
                {/* 🎧 Hàng Nút Bấm Thao Tác: Nghe / Tạm dừng + Tải MP3 */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-small" 
                    onClick={() => handleTogglePlay(item)}
                    style={{
                      color: isPlaying ? '#c084fc' : 'var(--text-primary)',
                      background: isPlaying ? 'rgba(168, 85, 247, 0.25)' : 'var(--bg-input)',
                      border: isPlaying ? '1px solid #c084fc' : '1px solid var(--border-color)',
                      flex: 1,
                      justifyContent: 'center'
                    }}
                  >
                    {isPlaying ? (
                      <><Pause size={14} fill="currentColor" color="#c084fc" /> Tạm dừng</>
                    ) : (
                      <><Play size={14} fill="currentColor" /> {getTF('playBtn', 'Nghe')}</>
                    )}
                  </button>

                  <button 
                    className="btn-small" 
                    onClick={() => handleDownload(item)}
                    style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  >
                    <Download size={14} /> {getTF('downloadMp3Btn', 'Tải MP3')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}