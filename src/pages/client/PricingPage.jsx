import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientMe } from '../../redux/slices/authSlice';
import { CheckCircle, Sparkles, HelpCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/common/Navbar';
import { clientService } from '../../services/clientService';
import UpgradeMethodModal from '../../components/client/UpgradeMethodModal';
import TiktokPromoModal from '../../components/client/TiktokPromoModal';
import Swal from 'sweetalert2';

export default function PricingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clientUser } = useSelector(state => state.auth);
  const { t, i18n } = useTranslation();
  const lang = i18n.language; // 'vi' | 'en'
  const isEn = lang === 'en';

  const [billingCycle, setBillingCycle] = useState('yearly');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState(null);
  const [showUpgradeMethodModal, setShowUpgradeMethodModal] = useState(false);
  const [showTiktokPromoModal, setShowTiktokPromoModal] = useState(false);

  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    clientService.getPlans()
      .then(res => {
        setPlans(res.data.plans || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy danh sách gói:", err);
        setLoading(false);
      });

    clientService.getPageContent('pricing')
      .then(res => {
        if (res.data?.page) {
          setPageData(res.data.page);
        }
      })
      .catch(err => console.error("Lỗi lấy nội dung trang pricing:", err));
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Helper: lấy tên gói theo ngôn ngữ
  const getPlanName = (plan) => isEn && plan.nameEn ? plan.nameEn : plan.name;
  const getPlanFeatures = (plan) => isEn && plan.featuresEn?.length ? plan.featuresEn : plan.features;

  const currentLang = i18n.language || 'vi';
  const langData = pageData?.translations?.[currentLang] || pageData?.translations?.['vi'] || {};

  const heroTitle = langData.heroTitle || (isEn ? 'Upgrade to do more' : 'Nâng cấp để làm nhiều hơn');
  const heroTitleHl1 = langData.heroTitleHl1 || (isEn ? 'do more' : 'làm nhiều hơn');
  const heroSubtitle = langData.heroSubtitle || (isEn ? 'Choose the right plan to optimize your content production workflow with leading AI technology.' : 'Chọn gói dịch vụ phù hợp để tối ưu hóa quy trình sản xuất nội dung của bạn với công nghệ AI hàng đầu.');
  const cycleMonthly = langData.cycleMonthly || (isEn ? 'Monthly' : 'Theo tháng');
  const cycleYearly = langData.cycleYearly || (isEn ? 'Yearly' : 'Theo năm');
  const discountBadge = langData.discountBadge || (isEn ? 'Save up to 70%' : 'Tiết kiệm đến 70%');
  const faqTitle = langData.faqTitle || (isEn ? 'Frequently Asked Questions' : 'Câu hỏi thường gặp');

  const defaultFaqs = [
    {
      q: isEn ? 'Can I cancel my subscription at any time?' : 'Tôi có thể hủy gói đăng ký bất cứ lúc nào không?',
      a: isEn ? 'Yes, you can cancel your subscription anytime in your account settings. After cancellation, you still have access to Pro features until the end of the current billing cycle.' : 'Có, bạn có thể hủy gói đăng ký bất cứ lúc nào trong phần cài đặt tài khoản. Sau khi hủy, bạn vẫn có quyền truy cập vào các tính năng Pro cho đến hết chu kỳ thanh toán hiện tại.'
    },
    {
      q: isEn ? 'Do unused tokens roll over to the next month?' : 'Phút / Ký tự lượt đọc có được cộng dồn sang tháng sau không?',
      a: isEn ? 'Token quotas for paid plans are refreshed monthly and do not roll over. For the Free plan, the 2,000 character limit is automatically refreshed at 00:00 every day.' : 'Hạn mức Token của các gói trả phí sẽ được làm mới hàng tháng và không cộng dồn. Với gói Miễn Phí, hạn mức 2,000 ký tự sẽ được tự động làm mới vào 00:00 đêm mỗi ngày.'
    },
    {
      q: isEn ? 'What is the refund policy?' : 'Chính sách hoàn tiền của Veltrix Voice như thế nào?',
      a: isEn ? 'We offer a 100% refund within the first 7 days if you are not satisfied with the service quality and have not used more than 10% of your plan token quota.' : 'Chúng tôi hỗ trợ hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với chất lượng dịch vụ và chưa sử dụng quá 10% hạn mức Token của gói.'
    },
    {
      q: isEn ? 'What file formats can I export?' : 'Tôi có thể xuất file dưới định dạng nào?',
      a: isEn ? 'All plans support exporting HD MP3 audio files (up to 320kbps) and ZIP compressed files for long readings.' : 'Tất cả các gói đều hỗ trợ xuất file định dạng âm thanh MP3 chuẩn HD sắc nét (up to 320kbps) và file nén ZIP cho bài đọc dài.'
    }
  ];

  const displayFaqs = langData.faqs && langData.faqs.length > 0 ? langData.faqs : defaultFaqs;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)', paddingBottom: '80px' }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: '40px auto 0', padding: '0 24px' }}>
        
        {/* TITLE HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
            {heroTitle.includes(heroTitleHl1) ? (
              <>
                {heroTitle.split(heroTitleHl1)[0]}
                <span style={{ color: 'var(--primary-purple)' }}>{heroTitleHl1}</span>
                {heroTitle.split(heroTitleHl1)[1]}
              </>
            ) : heroTitle}
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {heroSubtitle}
          </p>

          {/* TOGGLE SWITCH THEO THÁNG / THEO NĂM */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '5px',
            borderRadius: '30px',
            marginTop: '32px'
          }}>
            <button 
              onClick={() => setBillingCycle('monthly')}
              style={{
                background: billingCycle === 'monthly' ? 'var(--gradient-btn)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '24px',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
            >
              {cycleMonthly}
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              style={{
                background: billingCycle === 'yearly' ? 'var(--gradient-btn)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '24px',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.25s'
              }}
            >
              {cycleYearly} <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.25)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>{discountBadge}</span>
            </button>
          </div>
        </div>

        {/* 5 PRICING CARDS GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>{isEn ? 'Loading pricing...' : 'Đang tải bảng giá...'}</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '20px',
            alignItems: 'stretch',
            marginBottom: '80px'
          }}>
            {plans.map((plan) => {
              const isFree = plan.monthlyPrice === 0 && plan.yearlyPrice === 0 && plan.code === 'FREE';
              const isCustom = plan.monthlyPrice === 0 && plan.yearlyPrice === 0 && plan.code === 'CUSTOM';
              const isPopular = plan.isPopular;
              const isPro = plan.code === 'PRO';
              const targetCode = plan.code?.toUpperCase();
              const isCurrentPlan = clientUser && (clientUser.tier?.toUpperCase() === targetCode);
              const isOwned = clientUser?.subscriptionHistory?.some(
                h => h.tier?.toUpperCase() === targetCode
              );
              
              // Pricing strings
              const priceUSD = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
              const priceVND = billingCycle === 'yearly' ? plan.yearlyPriceVND : plan.monthlyPriceVND;
              
              const formatVND = (num) => num ? num.toLocaleString('vi-VN') + 'đ' : '0đ';
              const planName = getPlanName(plan);
              const planFeatures = getPlanFeatures(plan);

              return (
                <div key={plan._id} style={{
                  background: isCurrentPlan 
                    ? 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, var(--bg-card) 100%)' 
                    : isPopular 
                      ? 'linear-gradient(180deg, rgba(168, 85, 247, 0.12) 0%, var(--bg-card) 100%)' 
                      : 'var(--bg-card)',
                  border: isCurrentPlan 
                    ? '2px solid #10b981' 
                    : isPopular 
                      ? '2px solid var(--primary-purple)' 
                      : '1px solid var(--border-color)',
                  borderRadius: '22px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: isCurrentPlan 
                    ? '0 0 35px rgba(16, 185, 129, 0.3)' 
                    : isPopular 
                      ? '0 0 35px rgba(168, 85, 247, 0.25)' 
                      : 'none'
                }}>
                  {isCurrentPlan && (
                    <div style={{
                      position: 'absolute',
                      top: '-13px',
                      right: '16px',
                      background: '#10b981',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                    }}>
                      ✓ {isEn ? 'CURRENT PLAN' : 'ĐANG SỬ DỤNG'}
                    </div>
                  )}

                  {isPopular && !isCurrentPlan && (
                    <div style={{
                      position: 'absolute',
                      top: '-13px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--gradient-btn)',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap'
                    }}>
                      {isEn ? 'MOST POPULAR' : 'PHỔ BIẾN NHẤT'}
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ fontSize: '12px', color: isCurrentPlan ? '#10b981' : isPopular ? '#c084fc' : 'var(--text-secondary)', fontWeight: '800', textTransform: 'uppercase' }}>
                        {plan.code}
                      </div>
                    </div>
                    
                    {isFree ? (
                      <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>{isEn ? 'Free' : 'Miễn phí'}</h3>
                    ) : isCustom ? (
                      <>
                        <h3 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>{isEn ? 'Contact us' : 'Liên hệ'}</h3>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '18px' }}>{isEn ? 'For high volume usage' : 'Dùng số lượng lớn'}</div>
                      </>
                    ) : (
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>
                          {isEn ? `$${priceUSD}` : `${formatVND(priceVND)}`}
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/{billingCycle === 'yearly' ? (isEn ? 'year' : 'năm') : (isEn ? 'month' : 'tháng')}</span>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {isEn ? `${formatVND(priceVND)}/${billingCycle === 'yearly' ? 'năm' : 'tháng'}` : `$${priceUSD}/${billingCycle === 'yearly' ? 'year' : 'month'}`}
                        </div>
                      </div>
                    )}

                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {planFeatures.map((feature, idx) => {
                        const isHighlight = feature.includes('Voice Clone AI') || feature.includes('Số lượng token tùy chỉnh') || feature.includes('Custom token');
                        return (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: idx === 0 || isHighlight ? (isHighlight ? '#c084fc' : '#fff') : 'var(--text-secondary)', fontWeight: isHighlight ? 'bold' : 'normal' }}>
                            <CheckCircle size={15} color={isHighlight ? "#c084fc" : "#10b981"} /> 
                            {idx === 0 ? <b>{feature}</b> : feature}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {isCurrentPlan ? (
                    <button 
                      disabled
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', 
                        gap: '8px',
                        padding: '12px', 
                        width: '100%', 
                        fontSize: '13.5px', 
                        background: 'rgba(16, 185, 129, 0.15)', 
                        border: '1px solid rgba(16, 185, 129, 0.4)', 
                        color: '#10b981', 
                        fontWeight: 'bold', 
                        borderRadius: '14px',
                        cursor: 'default'
                      }}
                    >
                      <CheckCircle size={16} color="#10b981" /> {isEn ? 'Current Plan' : 'Đang sử dụng'}
                    </button>
                  ) : isCustom ? (
                    <button className="btn-cta" onClick={() => Swal.fire({ icon: 'info', title: 'Liên hệ VIP', text: 'Vui lòng liên hệ Email support@veltrix.ai để làm việc chi tiết!', background: '#181824', color: '#fff', confirmButtonColor: '#8b5cf6' })} style={{ justifyContent: 'center', padding: '12px', width: '100%', fontSize: '13px', background: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)', boxShadow: '0 4px 15px rgba(234, 88, 12, 0.4)', cursor: 'pointer' }}>
                      {isEn ? 'Contact now' : 'Liên hệ ngay'} <ArrowRight size={14} />
                    </button>
                  ) : isFree ? (
                    <button 
                      onClick={() => navigate('/studio')}
                      className="btn-small" 
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', width: '100%', fontSize: '13.5px', cursor: 'pointer' }}
                    >
                      {isEn ? 'Use for free' : 'Dùng miễn phí'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        if (!clientUser) {
                          Swal.fire({
                            icon: 'info',
                            title: 'Yêu cầu đăng nhập!',
                            text: 'Vui lòng đăng nhập trước khi chọn gói nâng cấp.',
                            background: '#181824',
                            color: '#fff',
                            confirmButtonColor: '#8b5cf6'
                          }).then(() => navigate('/login'));
                          return;
                        }

                        if (isOwned && clientUser?.tier?.toUpperCase() !== targetCode) {
                          Swal.fire({
                            title: isEn ? `Re-activate ${planName}?` : `Kích hoạt lại gói ${planName}?`,
                            text: isEn 
                              ? `You have previously owned this plan. Would you like to switch to ${planName} right now?` 
                              : `Bạn đã từng sở hữu gói này trong lịch sử. Bạn có muốn chuyển ngay sang gói ${planName} mà không cần làm lại sự kiện không?`,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: isEn ? 'Activate Now' : 'Kích hoạt ngay',
                            cancelButtonText: isEn ? 'Cancel' : 'Hủy',
                            background: '#181824',
                            color: '#fff',
                            confirmButtonColor: '#10b981',
                            cancelButtonColor: '#4b5563'
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              try {
                                const res = await clientService.switchPlan(plan.code);
                                Swal.fire({
                                  icon: 'success',
                                  title: isEn ? 'Success! 🎉' : 'Kích hoạt thành công! 🎉',
                                  text: res.data.message || `Đã chuyển sang gói ${planName}`,
                                  background: '#181824',
                                  color: '#fff',
                                  confirmButtonColor: '#10b981'
                                });
                                dispatch(fetchClientMe());
                              } catch (err) {
                                Swal.fire({
                                  icon: 'error',
                                  title: isEn ? 'Error!' : 'Lỗi kích hoạt!',
                                  text: err.response?.data?.error || err.message,
                                  background: '#181824',
                                  color: '#fff',
                                  confirmButtonColor: '#ef4444'
                                });
                              }
                            }
                          });
                          return;
                        }

                        setSelectedPlanForUpgrade(plan);
                        setShowUpgradeMethodModal(true);
                      }}
                      className={isOwned ? 'btn-cta' : isPopular || isPro ? 'btn-cta' : 'btn-small'} 
                      style={isOwned ? { justifyContent: 'center', padding: '12px', width: '100%', fontSize: '13px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)', cursor: 'pointer' } : isPro ? { justifyContent: 'center', padding: '12px', width: '100%', fontSize: '13px', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)', cursor: 'pointer' } : { justifyContent: 'center', padding: '12px', width: '100%', fontSize: '13.5px', cursor: 'pointer' }}
                    >
                      {isOwned ? (isEn ? `Use ${planName}` : `Sử dụng ${planName}`) : `${isEn ? 'Choose' : 'Chọn'} ${planName}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ ACCORDION SECTION */}
        <section style={{ maxWidth: '840px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '32px' }}>
            {faqTitle}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {displayFaqs.map((faq, i) => (
              <div 
                key={i} 
                onClick={() => toggleFaq(i)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{faq.q}</h4>
                  {openFaqIndex === i ? <ChevronUp size={18} color="#a855f7" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
                </div>

                {openFaqIndex === i && (
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* MODAL 1: CHỌN PHƯƠNG THỨC NÂNG CẤP */}
      {showUpgradeMethodModal && (
        <UpgradeMethodModal 
          selectedPlan={selectedPlanForUpgrade}
          onClose={() => setShowUpgradeMethodModal(false)}
          onSelectPayment={() => {
            Swal.fire({
              icon: 'info',
              title: 'Cổng thanh toán tự động',
              text: 'Hệ thống thanh toán tự động qua VNPay/MoMo hiện đang được nâng cấp. Bạn hãy chọn phương thức "Đăng clip nhận FREE" bên dưới để sở hữu gói cước hoàn toàn miễn phí!',
              background: '#181824',
              color: '#fff',
              confirmButtonColor: '#8b5cf6'
            });
          }}
          onSelectTikTok={() => {
            setShowUpgradeMethodModal(false);
            setShowTiktokPromoModal(true);
          }}
        />
      )}

      {/* MODAL 2: TIKTOK PROMO FORM */}
      {showTiktokPromoModal && (
        <TiktokPromoModal 
          selectedPlan={selectedPlanForUpgrade}
          user={clientUser}
          onClose={() => setShowTiktokPromoModal(false)}
          onSuccess={() => {
            setShowTiktokPromoModal(false);
          }}
        />
      )}
    </div>
  );
}
