import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchVoices } from '../../redux/slices/ttsSlice';
import { clientService } from '../../services/clientService';
import { playAudioGlobal, registerAudioListener } from '../../utils/audioManager';
import {
  Sparkles, Zap, ShieldCheck, Cpu, Volume2, CheckCircle,
  ArrowRight, Play, Pause, RefreshCw, Star, HelpCircle, Layers, Radio
} from 'lucide-react';
import ClientLayout from '../../layouts/ClientLayout';

export default function LandingPage() {
  const dispatch = useDispatch();
  // ✅ Vá an toàn chống undefined
  const { voices = [] } = useSelector((state) => state.tts || {});
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [loadingVoiceId, setLoadingVoiceId] = useState(null);
  const [featuredPlans, setFeaturedPlans] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!voices || voices.length === 0) {
      dispatch(fetchVoices());
    }

    const unregister = registerAudioListener((activeAudio) => {
      if (audioRef.current && audioRef.current !== activeAudio) {
        audioRef.current.pause();
        setPlayingVoiceId(null);
      }
    });

    return () => {
      unregister();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [dispatch, voices?.length]);

  useEffect(() => {
    clientService.getPlans()
      .then(res => {
        const plans = res.data.plans || [];
        setFeaturedPlans(plans.filter(p => p.isFeatured));
      })
      .catch(err => console.error('Lỗi lấy gói featured:', err));
  }, []);

  const handlePlaySample = async (voice) => {
    if (playingVoiceId === voice.id && audioRef.current) {
      audioRef.current.pause();
      setPlayingVoiceId(null);
      return;
    }

    try {
      let audioUrl;
      if (voice.sampleAudioUrl) {
        audioUrl = voice.sampleAudioUrl;
      } else {
        setLoadingVoiceId(voice.id);
        const sampleText = voice.sampleText || `Xin chào! Tôi là giọng đọc ${voice.name}.`;
        const response = await clientService.previewTTS({
          text: sampleText,
          voice: voice.id
        });
        const blob = response.data;
        audioUrl = URL.createObjectURL(blob);
      }

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

      newAudio.onerror = () => {
        setPlayingVoiceId(null);
      };

      playAudioGlobal(newAudio, () => {
        setPlayingVoiceId(null);
        audioRef.current = null;
      });

      await newAudio.play();
      setPlayingVoiceId(voice.id);
    } catch (err) {
      console.error("Lỗi nghe thử giọng:", err);
      setPlayingVoiceId(null);
    } finally {
      setLoadingVoiceId(null);
    }
  };

  const displayVoices = (voices && voices.length > 0) ? voices.map(v => ({
    ...v,
    name: isEn && v.nameEn ? v.nameEn : v.name,
    desc: isEn && v.descriptionEn ? v.descriptionEn : (v.description || v.desc)
  })) : [
    {
      id: 'vi-VN-HoaiMyNeural',
      name: t('landing.voices.sample1_name'),
      badge: t('landing.voices.sample1_badge'),
      desc: t('landing.voices.sample1_desc'),
      sampleAudioUrl: 'https://res.cloudinary.com/dfzgowb54/video/upload/v1785456157/veltrix_voice_audios/ud0imsgdmsbjamj2xyk6.mp3'
    },
    {
      id: 'vi-VN-NamMinhNeural',
      name: t('landing.voices.sample2_name'),
      badge: t('landing.voices.sample2_badge'),
      desc: t('landing.voices.sample2_desc'),
      sampleAudioUrl: 'https://res.cloudinary.com/dfzgowb54/video/upload/v1785456246/veltrix_voice_audios/ya1nmgdgeqmjxhedwgue.mp3'
    },
    {
      id: 'en-US-AvaNeural',
      name: t('landing.voices.sample3_name'),
      badge: 'PRO Only',
      desc: t('landing.voices.sample3_desc'),
      sampleAudioUrl: 'https://res.cloudinary.com/dfzgowb54/video/upload/v1785442828/veltrix_voice_audios/zyisfki420ourwseulph.mp3'
    },
    {
      id: 'en-US-AndrewNeural',
      name: t('landing.voices.sample4_name'),
      badge: 'PRO Only',
      desc: t('landing.voices.sample4_desc'),
      sampleAudioUrl: 'https://res.cloudinary.com/dfzgowb54/video/upload/v1785456323/veltrix_voice_audios/mpwfpbh7m8ul9mwbfh6b.mp3'
    }
  ];

  return (
    <ClientLayout>
      {/* 1. HERO BANNER SECTION */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={16} /> {t('landing.hero.badge')}
        </div>

        <h1 className="hero-title">
          {t('landing.hero.title')} <span style={{ color: 'var(--primary-purple)' }}>{t('landing.hero.title_hl1')}</span> {t('landing.hero.title_and')} <span style={{ color: '#06b6d4' }}>{t('landing.hero.title_hl2')}</span>
        </h1>

        <p className="hero-subtitle">
          {t('landing.hero.subtitle')}
        </p>

        <div className="hero-btns">
          <Link to="/studio" className="btn-cta" style={{ padding: '14px 32px', fontSize: '15px' }}>
            {t('landing.hero.cta_main')} <ArrowRight size={18} />
          </Link>
          <a href="#voices" className="btn-small" style={{ padding: '14px 24px', fontSize: '14px' }}>
            <Volume2 size={18} color="#8b5cf6" /> {t('landing.hero.cta_secondary')}
          </a>
        </div>
      </section>

      {/* 2. TÍNH NĂNG NỔI BẬT SECTION */}
      <section id="features" className="landing-section">
        <div className="section-tag">{t('landing.features.tag')}</div>
        <h2 className="section-title">{t('landing.features.title')}</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Cpu size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>{t('landing.features.card1_title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              {t('landing.features.card1_desc')}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>{t('landing.features.card2_title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              {t('landing.features.card2_desc')}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '10px' }}>{t('landing.features.card3_title')}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              {t('landing.features.card3_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE GIỌNG ĐỌC AI SECTION */}
      <section id="voices" className="landing-section" style={{ background: 'transparent' }}>
        <h2 className="section-title">{t('landing.voices.title')}</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {displayVoices.slice(0, 4).map((v) => (
            <div key={v.id} className="feature-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{v.name}</h4>
                  {v.badge && (
                    <span style={{ fontSize: '10px', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {v.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{v.desc}</p>
              </div>
              <button
                className="btn-small"
                onClick={() => handlePlaySample(v)}
                disabled={loadingVoiceId !== null}
                style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, justifyContent: 'center', background: playingVoiceId === v.id ? 'rgba(168, 85, 247, 0.2)' : '' }}
              >
                {loadingVoiceId === v.id ? (
                  <RefreshCw size={18} className="spin" color="#f59e0b" />
                ) : playingVoiceId === v.id ? (
                  <Pause size={18} color="#c084fc" />
                ) : (
                  <Volume2 size={18} color="#8b5cf6" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BẢNG GIÁ SECTION */}
      <section id="pricing" className="landing-section">
        <div className="section-tag">{isEn ? 'TRANSPARENT PRICING' : 'BẢNG GIÁ MINH BẠCH'}</div>
        <h2 className="section-title">{isEn ? 'Choose The Right Plan For You' : 'Lựa Chọn Gói Phù Hợp Với Bạn'}</h2>

        <div className="pricing-grid">
          {featuredPlans.map((plan) => {
            const isFree = plan.code === 'FREE';
            const isCustom = plan.code === 'CUSTOM';
            const isPopular = plan.isPopular;
            const isEn = i18n.language === 'en';

            const planName = isEn && plan.nameEn ? plan.nameEn : plan.name;
            const planFeatures = isEn && plan.featuresEn?.length ? plan.featuresEn : plan.features;
            const formatVND = (num) => num ? num.toLocaleString('vi-VN') : '0';

            return (
              <div key={plan._id} className={`pricing-card${isPopular ? ' popular' : ''}`}>
                {isPopular && <div className="popular-badge">{isEn ? 'MOST POPULAR' : 'GÓI PHỔ BIẾN NHẤT'}</div>}

                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: isPopular ? '#c084fc' : '#fff' }}>
                  {planName}
                </h3>

                {isFree ? (
                  <>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>{isEn ? 'For new users to try' : 'Dành cho người mới trải nghiệm'}</p>
                    <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>{isEn ? '$0' : '0 VNĐ'} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/{isEn ? 'month' : 'tháng'}</span></div>
                  </>
                ) : isCustom ? (
                  <>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>{isEn ? 'For Enterprise & Large Teams' : 'Dành cho Doanh nghiệp & Team lớn'}</p>
                    <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px' }}>{isEn ? 'Contact us' : 'Liên hệ'}</div>
                  </>
                ) : (
                  <>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                      {isPopular ? (isEn ? 'For Creators & Marketers' : 'Dành cho Creator & Marketer') : (isEn ? 'For professionals' : 'Dành cho chuyên nghiệp')}
                    </p>
                    <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '24px', color: '#fff' }}>
                      {isEn ? `$${plan.monthlyPrice}` : `${formatVND(plan.monthlyPriceVND)} VNĐ`} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>/{isEn ? 'month' : 'tháng'}</span>
                    </div>
                  </>
                )}

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', fontSize: '14px' }}>
                  {planFeatures.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={16} color="#10b981" /> {idx === 0 ? <b>{feature}</b> : feature}
                    </li>
                  ))}
                </ul>

                {isCustom ? (
                  <Link to="/pricing" className="btn-small" style={{ justifyContent: 'center', padding: '12px', marginTop: 'auto' }}>{isEn ? 'Contact VIP' : 'Liên Hệ VIP'}</Link>
                ) : isPopular ? (
                  <Link to="/pricing" className="btn-cta" style={{ justifyContent: 'center', padding: '12px', marginTop: 'auto' }}>{isEn ? `Upgrade ${planName}` : `Nâng Cấp ${planName}`} 🚀</Link>
                ) : (
                  <Link to="/studio" className="btn-small" style={{ justifyContent: 'center', padding: '12px', marginTop: 'auto' }}>
                    {isFree ? (isEn ? 'Try Now' : 'Dùng Thử Ngay') : `${isEn ? 'Choose' : 'Chọn'} ${planName}`}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CÂU HỎI THƯỜNG GẶP (FAQ) SECTION */}
      <section id="faq" className="landing-section">
        <div className="section-tag">{t('landing.faq.tag')}</div>
        <h2 className="section-title">{t('landing.faq.title')}</h2>

        <div className="faq-list">
          <div className="faq-item">
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} color="#8b5cf6" /> {t('landing.faq.q1')}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              {t('landing.faq.a1')}
            </p>
          </div>

          <div className="faq-item">
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} color="#8b5cf6" /> {t('landing.faq.q2')}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              {t('landing.faq.a2')}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>{t('landing.footer')}</p>
      </footer>
    </ClientLayout>
  );
}