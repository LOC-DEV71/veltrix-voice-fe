import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';
import { Trash2, Edit, PlusCircle, CheckCircle, Search } from 'lucide-react';

export default function PlanManagement() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameEn: '',
    monthlyPrice: 0,
    monthlyPriceVND: 0,
    yearlyPrice: 0,
    yearlyPriceVND: 0,
    tokenText: '',
    tokenTextEn: '',
    tokensPerMonth: 0,
    featuresText: '',
    featuresTextEn: ''
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPlans();
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error("Lỗi tải bảng giá:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setCurrentPlan(plan);
      setFormData({
        code: plan.code,
        name: plan.name,
        nameEn: plan.nameEn || '',
        monthlyPrice: plan.monthlyPrice,
        monthlyPriceVND: plan.monthlyPriceVND,
        yearlyPrice: plan.yearlyPrice || 0,
        yearlyPriceVND: plan.yearlyPriceVND || 0,
        tokenText: plan.tokenText,
        tokenTextEn: plan.tokenTextEn || '',
        tokensPerMonth: plan.tokensPerMonth,
        featuresText: plan.features.join('\n'),
        featuresTextEn: plan.featuresEn ? plan.featuresEn.join('\n') : ''
      });
    } else {
      setCurrentPlan(null);
      setFormData({
        code: '',
        name: '',
        nameEn: '',
        monthlyPrice: 0,
        monthlyPriceVND: 0,
        yearlyPrice: 0,
        yearlyPriceVND: 0,
        tokenText: '',
        tokenTextEn: '',
        tokensPerMonth: 0,
        featuresText: '',
        featuresTextEn: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.featuresText.split('\n').filter(f => f.trim() !== ''),
        featuresEn: formData.featuresTextEn.split('\n').filter(f => f.trim() !== '')
      };
      
      if (currentPlan) {
        await adminService.updatePlan(currentPlan._id, payload);
        Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Cập nhật thông tin gói dịch vụ thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      } else {
        await adminService.createPlan(payload);
        Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Thêm gói dịch vụ mới thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      }
      setShowModal(false);
      loadPlans();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
    }
  };

  const handleDelete = async (id, name) => {
    const res = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa gói cước [${name}] không?`,
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
        await adminService.deletePlan(id);
        Swal.fire({ icon: 'success', title: 'Đã xóa!', text: 'Xóa gói dịch vụ thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
        loadPlans();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi xóa!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
      }
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Quản lý Bảng Giá (Plans)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Tùy chỉnh các gói dịch vụ hiển thị trên Landing Page</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-purple)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          <PlusCircle size={18} /> Thêm Gói mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</div>
        ) : plans.map(plan => (
          <div key={plan._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '8px' }}>
              <button onClick={() => handleOpenModal(plan)} style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer' }}><Edit size={16} /></button>
              <button onClick={() => handleDelete(plan._id, plan.name)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary-purple)', marginBottom: '8px' }}>{plan.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '16px' }}>Code: {plan.code}</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)' }}>${plan.monthlyPrice}</span>
              <span style={{ color: 'var(--text-secondary)' }}>/ tháng</span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>VNĐ: {(plan.monthlyPriceVND || 0).toLocaleString()}đ / tháng</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>${plan.yearlyPrice || 0}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>/ năm</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>VNĐ: {(plan.yearlyPriceVND || 0).toLocaleString()}đ / năm</div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-primary)' }}>Tính năng:</div>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={16} color="var(--primary-purple)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal form */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{currentPlan ? 'Cập nhật Gói' : 'Thêm Gói mới'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Mã gói (PRO, VIP...)</label><input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Số Token/tháng</label><input required type="number" value={formData.tokensPerMonth} onChange={e => setFormData({...formData, tokensPerMonth: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Tên gói (VI)</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Tên gói (EN)</label><input value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Giá USD / tháng</label><input required type="number" step="0.01" value={formData.monthlyPrice} onChange={e => setFormData({...formData, monthlyPrice: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Giá VNĐ / tháng</label><input required type="number" value={formData.monthlyPriceVND} onChange={e => setFormData({...formData, monthlyPriceVND: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Giá USD / năm</label><input required type="number" step="0.01" value={formData.yearlyPrice} onChange={e => setFormData({...formData, yearlyPrice: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Giá VNĐ / năm</label><input required type="number" value={formData.yearlyPriceVND} onChange={e => setFormData({...formData, yearlyPriceVND: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Mô tả Token (VI)</label><input required value={formData.tokenText} onChange={e => setFormData({...formData, tokenText: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
                <div><label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Mô tả Token (EN)</label><input value={formData.tokenTextEn} onChange={e => setFormData({...formData, tokenTextEn: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} /></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Các tính năng (VI) - Mỗi tính năng 1 dòng</label>
                  <textarea required rows={5} value={formData.featuresText} onChange={e => setFormData({...formData, featuresText: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px' }}>Các tính năng (EN) - Mỗi tính năng 1 dòng</label>
                  <textarea rows={5} value={formData.featuresTextEn} onChange={e => setFormData({...formData, featuresTextEn: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--primary-purple)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
