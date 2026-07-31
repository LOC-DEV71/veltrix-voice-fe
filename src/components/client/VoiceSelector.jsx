import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedVoice } from '../../redux/slices/ttsSlice';
import { Lock, Volume2, Pause, RefreshCw } from 'lucide-react';
import { clientService } from '../../services/clientService';

export default function VoiceSelector() {
  const dispatch = useDispatch();
  const { voices, selectedVoice } = useSelector((state) => state.tts);
  
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [loadingVoiceId, setLoadingVoiceId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlaySample = async (voice) => {
    // Nếu đang phát mẫu giọng này -> Tạm dừng
    if (playingVoiceId === voice.id && audioRef.current) {
      audioRef.current.pause();
      setPlayingVoiceId(null);
      return;
    }

    // Tắt mẫu giọng đọc trước đó nếu đang phát
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    try {
      let audioUrl;

      // Ưu tiên dùng sampleAudioUrl đã có sẵn từ DB (Cloudinary) — phát tức thì
      if (voice.sampleAudioUrl) {
        audioUrl = voice.sampleAudioUrl;
      } else {
        // Fallback: gọi API preview nếu chưa có sample sẵn
        setLoadingVoiceId(voice.id);
        const sampleText = `Xin chào! Tôi là giọng đọc ${voice.name}. Rất vui được đồng hành cùng bạn trên Veltrix Voice.`;
        const response = await clientService.previewTTS({
          text: sampleText,
          voice: voice.id
        });
        const blob = response.data;
        audioUrl = URL.createObjectURL(blob);
      }

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

      newAudio.onended = () => {
        setPlayingVoiceId(null);
        audioRef.current = null;
      };

      newAudio.onerror = () => {
        setPlayingVoiceId(null);
      };

      await newAudio.play();
      setPlayingVoiceId(voice.id);
    } catch (err) {
      console.error("Lỗi nghe thử giọng:", err);
      setPlayingVoiceId(null);
    } finally {
      setLoadingVoiceId(null);
    }
  };

  return (
    <div className="sidebar-panel">
      <div className="panel-header">CÀI ĐẶT GIỌNG ĐỌC AI</div>
      <div className="voice-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {voices.map(voice => {
          const isSelected = selectedVoice === voice.id;
          const isPlayingSample = playingVoiceId === voice.id;
          const isLoadingThis = loadingVoiceId === voice.id;

          return (
            <div 
              key={voice.id} 
              className={`voice-item ${isSelected ? 'active' : ''}`}
              onClick={() => !voice.isLocked && dispatch(setSelectedVoice(voice.id))}
              style={{ 
                opacity: voice.isLocked ? 0.5 : 1, 
                cursor: voice.isLocked ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{voice.name}</span>
                <span style={{ fontSize: '10px', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {voice.isLocked ? <Lock size={10} style={{ marginRight: '4px' }} /> : null}
                  {voice.badge}
                </span>
              </div>
              
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{voice.desc}</div>

              {/* Nút Nghe Thử Mẫu Giọng Đọc Độc Lập Kèm Loading Spinner */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  className="btn-small"
                  disabled={loadingVoiceId !== null}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!voice.isLocked) handlePlaySample(voice);
                  }}
                  style={{
                    fontSize: '11.5px',
                    padding: '4px 10px',
                    color: isPlayingSample ? '#c084fc' : (isLoadingThis ? '#f59e0b' : '#06b6d4'),
                    background: isPlayingSample ? 'rgba(168, 85, 247, 0.2)' : (isLoadingThis ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.12)'),
                    borderColor: isPlayingSample ? '#a855f7' : (isLoadingThis ? '#f59e0b' : 'rgba(6, 182, 212, 0.3)'),
                    cursor: loadingVoiceId !== null ? 'wait' : 'pointer'
                  }}
                >
                  {isLoadingThis ? (
                    <>
                      <RefreshCw size={11} className="spin" color="#f59e0b" /> Đang tải...
                    </>
                  ) : isPlayingSample ? (
                    <>
                      <Pause size={11} fill="currentColor" color="#c084fc" /> Dừng thử
                    </>
                  ) : (
                    <>
                      <Volume2 size={11} color="#06b6d4" /> Nghe thử
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
