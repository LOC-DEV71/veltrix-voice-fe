import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';
import { Trash2, Edit, PlusCircle, Search } from 'lucide-react';

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resAcc, resRoles] = await Promise.all([
        adminService.getAccounts(),
        adminService.getRoles()
      ]);
      setAccounts(resAcc.data.accounts || []);
      setRoles(resRoles.data.roles || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setCurrentAccount(account);
      setFormData({
        name: account.name,
        email: account.email,
        password: '', // Leave blank when editing unless changing
        role: account.role?._id || '',
        status: account.status
      });
    } else {
      setCurrentAccount(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: roles.length > 0 ? roles[0]._id : '',
        status: 'ACTIVE'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (currentAccount && !payload.password) {
        delete payload.password; // don't update password if blank
      }

      if (currentAccount) {
        await adminService.updateAccount(currentAccount._id, payload);
        Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Cập nhật tài khoản Admin thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      } else {
        await adminService.createAccount(payload);
        Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Tạo tài khoản Admin mới thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
    }
  };

  const handleDelete = async (id, email) => {
    const res = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa tài khoản [${email}] không?`,
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
        await adminService.deleteAccount(id);
        Swal.fire({ icon: 'success', title: 'Đã xóa!', text: 'Xóa tài khoản thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
        loadData();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi xóa!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
      }
    }
  };

  const filteredAccounts = accounts.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Tài khoản Quản trị (Admins)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Quản lý các tài khoản admin truy cập hệ thống</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-purple)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          <PlusCircle size={18} /> Thêm Tài khoản
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Tên hiển thị</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Email</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Nhóm quyền</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Trạng thái</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</td></tr>
            ) : filteredAccounts.map((acc) => (
              <tr key={acc._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{acc.name}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{acc.email}</td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--primary-purple)', fontWeight: '600' }}>{acc.role?.title || 'N/A'}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    background: acc.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                    color: acc.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                  }}>
                    {acc.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(acc)} style={{ background: '#3b82f6', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', color: '#fff' }}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(acc._id, acc.email)} style={{ background: '#ef4444', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', color: '#fff' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{currentAccount ? 'Cập nhật Tài khoản' : 'Thêm Tài khoản mới'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Tên hiển thị</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} /></div>
              <div><label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email</label><input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} /></div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Mật khẩu {currentAccount && '(Bỏ trống nếu không đổi)'}</label>
                <input required={!currentAccount} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Nhóm quyền (Role)</label>
                  <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Trạng thái</label>
                  <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Khóa</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
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
