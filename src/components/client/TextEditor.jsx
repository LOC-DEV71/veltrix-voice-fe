import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setText, addHistoryItem, replaceHistoryItem, removeHistoryItem, setRate, setPitch } from '../../redux/slices/ttsSlice';
import { updateTokens } from '../../redux/slices/authSlice';
import { clientService } from '../../services/clientService';
import Swal from 'sweetalert2';
import { Sparkles, RefreshCw, Volume2, Settings2, Play, Pause, Zap, FolderPlus, FileText, Folder, Trash2, FileCode, Eraser, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playAudioGlobal, registerAudioListener } from '../../utils/audioManager';

export default function TextEditor() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { text, selectedVoice, rate, pitch } = useSelector((state) => state.tts);
  const { clientUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  
  // Trạng thái nghe trước & dự án
  const [previewLoading, setPreviewLoading] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Mặc định');
  const [folders, setFolders] = useState(['Mặc định']);
  const audioRef = useRef(null);

  const sampleScripts = [
    {
      title: '🎬 Quảng cáo TikTok / Shopee',
      text: 'Siêu phẩm đã cập bến! Đừng bỏ lỡ cơ hội sở hữu sản phẩm hot nhất mùa hè này với ưu đãi cực khủng giảm đến 50%. Nhấp ngay vào giỏ hàng góc dưới bên trái!'
    },
    {
      title: '📖 Truyện ngắn / Thuyết minh',
      text: 'Đêm hôm ấy, ngọn gió heo may khẽ lùa qua khe cửa sổ. Căn phòng chìm trong tĩnh lặng, chỉ còn tiếng tích tắc đều đặn của chiếc đồng hồ cổ.'
    },
    {
      title: '📰 Bản tin Tin Tức AI',
      text: 'Chào mừng quý vị và các bạn đến với bản tin công nghệ Veltrix Voice. Hôm nay chúng tôi xin gửi tới quý vị những cập nhật mới nhất về trí tuệ nhân tạo.'
    }
  ];

  const handleSelectSample = async () => {
    const inputOptions = {};
    sampleScripts.forEach((s, idx) => {
      inputOptions[idx] = s.title;
    });

    const { value: selectedIndex } = await Swal.fire({
      title: 'Chọn Kịch Bản Mẫu',
      input: 'select',
      inputOptions,
      inputPlaceholder: '-- Chọn chủ đề văn bản mẫu --',
      showCancelButton: true,
      confirmButtonText: 'Chèn kịch bản ✨',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#8b5cf6'
    });

    if (selectedIndex !== undefined && sampleScripts[selectedIndex]) {
      const script = sampleScripts[selectedIndex];
      dispatch(setText(script.text));
      if (!projectTitle) {
        setProjectTitle(script.title.replace(/[^a-zA-Z0-9 -]/g, '').trim());
      }
    }
  };

  const handleClearText = () => {
    dispatch(setText(''));
  };

  const handleInsertPause = () => {
    dispatch(setText((text || '') + ' ... '));
  };

  useEffect(() => {
    const unregister = registerAudioListener((activeAudio) => {
      if (audioRef.current && audioRef.current !== activeAudio) {
        audioRef.current.pause();
        setIsPlayingPreview(false);
      }
    });

    return () => {
      unregister();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fetchFolders = () => {
    if (clientUser) {
      clientService.getFolders().then(res => {
        const folderNames = (res.data?.folders || []).map(f => f.name);
        if (!folderNames.includes('Mặc định')) folderNames.unshift('Mặc định');
        setFolders(folderNames);
      }).catch(err => console.error('Lỗi lấy folders:', err));
    }
  };

  // Lấy danh sách thư mục của người dùng & lắng nghe thay đổi
  useEffect(() => {
    fetchFolders();
    const handleFolderChange = () => fetchFolders();
    window.addEventListener('veltrix_folder_changed', handleFolderChange);
    return () => window.removeEventListener('veltrix_folder_changed', handleFolderChange);
  }, [clientUser]);

  const handleCreateFolder = async () => {
    const { value: folderName } = await Swal.fire({
      title: 'Tạo Thư Mục Dự Án Mới',
      input: 'text',
      inputPlaceholder: 'Nhập tên thư mục (Ví dụ: Video Tiktok, Truyện Audio...)',
      showCancelButton: true,
      confirmButtonText: 'Tạo ngay 🚀',
      cancelButtonText: 'Hủy',
      background: 'var(--bg-card)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#8b5cf6'
    });

    if (folderName && folderName.trim()) {
      try {
        const res = await clientService.createFolder({ name: folderName.trim() });
        const newName = res.data?.folder?.name || folderName.trim();
        setFolders(prev => [...new Set([...prev, newName])]);
        setSelectedFolder(newName);
        
        // Bắn event đồng bộ lập tức sang AudioHistory tab
        window.dispatchEvent(new CustomEvent('veltrix_folder_changed'));

        Swal.fire({
          icon: 'success',
          title: 'Đã tạo thư mục!',
          text: `Đã thêm thư mục "${newName}" thành công.`,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi tạo thư mục',
          text: err.response?.data?.error || err.message,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)'
        });
      }
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder || selectedFolder === 'Mặc định') return;
    const result = await Swal.fire({
      title: `Xóa Thư Mục "${selectedFolder}"?`,
      text: "Bạn có chắc muốn xóa thư mục này? (Các bài đọc cũ sẽ chuyển về Thư mục Mặc định)",
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
        await clientService.deleteFolder(encodeURIComponent(selectedFolder));
        setSelectedFolder('Mặc định');
        window.dispatchEvent(new CustomEvent('veltrix_folder_changed'));
        Swal.fire({
          icon: 'success',
          title: 'Đã xóa thư mục!',
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

  const checkAuthAndConsent = () => {
    if (!clientUser) {
      Swal.fire({
        icon: 'info',
        title: 'Yêu cầu đăng nhập!',
        text: 'Vui lòng đăng nhập để sử dụng tính năng tạo giọng nói AI.',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#8b5cf6'
      });
      return false;
    }
    const consentData = localStorage.getItem('veltrix_ip_consent');
    if (consentData) {
      try {
        const parsed = JSON.parse(consentData);
        if (parsed.accepted === false) {
          Swal.fire({
            icon: 'warning',
            title: 'Từ chối điều khoản!',
            text: 'Bạn đã từ chối Điều khoản An ninh & Cookie! Vui lòng chấp nhận quyền ở góc dưới bên phải màn hình để tiếp tục tạo giọng nói.',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            confirmButtonColor: '#f59e0b'
          });
          return false;
        }
      } catch (e) {}
    }
    if (!text.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu nội dung!',
        text: 'Vui lòng nhập văn bản muốn chuyển thành giọng nói.',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#8b5cf6'
      });
      return false;
    }
    return true;
  };

  const handlePreview = async () => {
    if (!checkAuthAndConsent()) return;

    if (isPlayingPreview && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
      return;
    }

    setPreviewLoading(true);
    try {
      const response = await clientService.previewTTS({
        text: text.slice(0, 150),
        voice: selectedVoice,
        rate,
        pitch: pitch !== 0 ? `${pitch > 0 ? '+' : ''}${pitch}Hz` : '+0Hz'
      });

      const blob = response.data;
      const audioUrl = URL.createObjectURL(blob);
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

      newAudio.onerror = () => {
        setIsPlayingPreview(false);
      };

      playAudioGlobal(newAudio, () => {
        setIsPlayingPreview(false);
        audioRef.current = null;
      });

      await newAudio.play();
      setIsPlayingPreview(true);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Nghe thử thất bại!',
        text: err.response?.data?.error || err.message,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#ef4444'
      });
      setIsPlayingPreview(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!checkAuthAndConsent()) return;
    
    // Tắt preview nếu đang phát
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
    }

    // ⚡ OPTIMISTIC UPDATE: TẠO CARD CHỜ TRONG LỊCH SỬ LẬP TỨC KÈM TÊN DỰ ÁN VÀ THƯ MỤC
    const tempId = `temp_${Date.now()}`;
    const tempHistoryItem = {
      id: tempId,
      text: text,
      title: projectTitle.trim() || '',
      folder: selectedFolder || 'Mặc định',
      voiceId: selectedVoice,
      isPending: true,
      time: new Date().toLocaleTimeString('vi-VN')
    };

    dispatch(addHistoryItem(tempHistoryItem));
    setLoading(true);

    try {
      const response = await clientService.generateTTS({
        text,
        voice: selectedVoice,
        rate,
        pitch: pitch !== 0 ? `${pitch > 0 ? '+' : ''}${pitch}Hz` : '+0Hz',
        title: projectTitle.trim(),
        folder: selectedFolder
      });

      const blob = response.data;
      const cloudAudioUrl = response.headers['x-audio-url'];
      const audioUrl = cloudAudioUrl || URL.createObjectURL(blob);

      const remainingTokens = response.headers['x-remaining-tokens'];
      if (remainingTokens !== undefined) {
        dispatch(updateTokens(parseInt(remainingTokens)));
      }

      const realHistoryItem = {
        id: response.headers['x-audio-id'] || tempId,
        text,
        title: projectTitle.trim() || '',
        folder: selectedFolder || 'Mặc định',
        voiceId: selectedVoice,
        audioUrl,
        time: new Date().toLocaleTimeString('vi-VN')
      };

      // Thay thế card chờ bằng card Audio thật đã hoàn thành
      dispatch(replaceHistoryItem({ tempId, realItem: realHistoryItem }));
    } catch (err) {
      // Nếu có lỗi -> Gỡ bỏ card chờ khỏi danh sách lịch sử
      dispatch(removeHistoryItem(tempId));

      let errMsg = err.message;
      if (err.response?.data instanceof Blob) {
        const textError = await err.response.data.text();
        try {
          const jsonError = JSON.parse(textError);
          errMsg = jsonError.error || err.message;
        } catch (e) {
          errMsg = textError;
        }
      } else if (err.response?.data?.error) {
        errMsg = err.response.data.error;
      }

      Swal.fire({
        icon: 'error',
        title: 'Tạo giọng nói thất bại!',
        text: errMsg,
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-panel">
      {/* 📁 BẢNG THÔNG TIN DỰ ÁN VÀ THƯ MỤC LƯU MỚI */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', background: 'var(--bg-input)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Tên Dự Án / Bài Đọc */}
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color="var(--primary-purple)" />
          <input 
            type="text" 
            placeholder="Tên bài đọc / dự án (Ví dụ: Review iPhone 16...)" 
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        {/* Chọn Thư Mục Dự Án */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Folder size={16} color="#06b6d4" />
          <select 
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {folders.map(f => (
              <option key={f} value={f} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                📁 {f}
              </option>
            ))}
          </select>

          <button 
            type="button" 
            onClick={handleCreateFolder}
            className="btn-small" 
            style={{ padding: '8px 10px', fontSize: '12px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--primary-purple)', border: '1px solid var(--border-color)' }}
            title="Tạo thư mục mới"
          >
            <FolderPlus size={14} /> + Thư mục
          </button>

          {selectedFolder !== 'Mặc định' && (
            <button 
              type="button" 
              onClick={handleDeleteFolder}
              className="btn-small" 
              style={{ padding: '8px 10px', fontSize: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              title={`Xóa thư mục "${selectedFolder}"`}
            >
              <Trash2 size={14} /> Xóa
            </button>
          )}
        </div>
      </div>

      {/* Tùy chỉnh giọng đọc (Tốc độ & Pitch) */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '30px', background: 'var(--bg-card)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <Settings2 size={14} /> {t('studio.editor.speed')}
            </span>
            <b style={{ color: '#06b6d4' }}>{rate}x</b>
          </div>
          <input 
            type="range" 
            min="0.5" max="2" step="0.1" 
            value={rate} 
            onChange={(e) => dispatch(setRate(parseFloat(e.target.value)))}
            style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <Volume2 size={14} /> {t('studio.editor.pitch')}
            </span>
            <b style={{ color: '#c084fc' }}>{pitch > 0 ? `+${pitch}` : pitch}Hz</b>
          </div>
          <input 
            type="range" 
            min="-50" max="50" step="5" 
            value={pitch} 
            onChange={(e) => dispatch(setPitch(parseInt(e.target.value)))}
            style={{ width: '100%', accentColor: '#c084fc', cursor: 'pointer' }}
          />
        </div>
      </div>

      <div className="editor-box" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none' }}>
        <textarea 
          className="editor-input"
          placeholder={t('studio.editor.placeholder')}
          value={text}
          onChange={(e) => dispatch(setText(e.target.value))}
          style={{ minHeight: '200px', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
        />
        <div className="editor-actions" style={{ background: 'var(--bg-input)', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {t('studio.editor.characters')}: <b style={{ color: 'var(--text-primary)' }}>{text?.length}</b> &nbsp;•&nbsp; 
              {t('studio.editor.tokens')}: <b style={{ color: '#c084fc', fontWeight: '700' }}>{text?.length}</b>
            </div>

            {/* Quick Editor Utilities */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                type="button" 
                onClick={handleSelectSample} 
                className="btn-small" 
                style={{ fontSize: '11.5px', padding: '4px 8px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.2)' }}
                title="Chọn kịch bản mẫu"
              >
                <FileCode size={13} /> Văn bản mẫu
              </button>

              <button 
                type="button" 
                onClick={handleInsertPause} 
                className="btn-small" 
                style={{ fontSize: '11.5px', padding: '4px 8px', background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.2)' }}
                title="Chèn dấu ngắt giọng"
              >
                <Clock size={13} /> + Ngắt 0.5s
              </button>

              {text && (
                <button 
                  type="button" 
                  onClick={handleClearText} 
                  className="btn-small" 
                  style={{ fontSize: '11.5px', padding: '4px 8px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  title="Xóa toàn bộ văn bản"
                >
                  <Eraser size={13} /> Xóa sạch
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-small"
              onClick={handlePreview}
              disabled={previewLoading || loading}
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              {previewLoading ? (
                <><RefreshCw size={16} className="spin" color="#f59e0b" /> {t('studio.editor.loading')}</>
              ) : isPlayingPreview ? (
                <><Pause size={16} fill="currentColor" color="#f59e0b" /> {t('studio.editor.stop_preview')}</>
              ) : (
                <><Play size={16} fill="currentColor" /> {t('studio.editor.preview')}</>
              )}
            </button>
            <button 
              className="btn-cta"
              onClick={handleGenerate}
              disabled={loading || previewLoading}
            >
              {loading ? (
                <><RefreshCw size={18} className="spin" /> {t('studio.editor.processing')}</>
              ) : (
                <><Sparkles size={18} /> {t('studio.editor.generate')}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
