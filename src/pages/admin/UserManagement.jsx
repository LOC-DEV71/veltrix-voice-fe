import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';
import { Trash2, ShieldBan, Info, Search, Users, Activity, UserX, RefreshCw } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    tokens: 0,
    tier: 'PRO',
    status: 'ACTIVE'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Lỗi tải danh sách Users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, email) => {
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
        await adminService.deleteUser(userId);
        Swal.fire({ icon: 'success', title: 'Đã xóa!', text: `Đã xóa tài khoản [${email}] thành công!`, background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
        loadUsers();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi xóa!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminService.updateUser(userId, { status: newStatus });
      loadUsers();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
    }
  };

  const handleOpenModal = (user) => {
    setCurrentUser(user);
    setFormData({
      tokens: user.tokens || 0,
      tier: user.tier || 'FREE',
      status: user.status || 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(currentUser._id, formData);
      Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Cập nhật thông tin người dùng thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      setShowModal(false);
      loadUsers();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
    }
  };

  const activeUsersCount = users.filter(u => u.status === 'ACTIVE').length;
  const blockedUsersCount = users.filter(u => u.status === 'INACTIVE').length;

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Quản Lý Người Dùng</h1>
        <button style={{ 
          background: '#facc15', 
          color: '#854d0e', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '8px', 
          fontWeight: '700', 
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(250, 204, 21, 0.2)'
        }}>
          Quản Lý Đặc Quyền Hạng
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-indigo)', fontWeight: '600', marginBottom: '12px' }}>
            <Users size={18} />
            Total Users
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{users.length}</div>
        </div>
        
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '600', marginBottom: '12px' }}>
            <Activity size={18} />
            Active Users
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{activeUsersCount}</div>
        </div>
        
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: '600', marginBottom: '12px' }}>
            <UserX size={18} />
            Blocked Users
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{blockedUsersCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', marginBottom: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Tìm tên hoặc email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 16px 10px 42px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <select style={{ width: '100%', padding: '10px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}>
            <option>Trạng thái: Tất cả</option>
            <option>Hoạt động</option>
            <option>Đã khóa</option>
          </select>
          <select style={{ width: '100%', padding: '10px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}>
            <option>-- Sắp xếp theo --</option>
            <option>Mới nhất</option>
            <option>Cũ nhất</option>
          </select>
          <button style={{ padding: '10px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={16} /> Xóa lọc
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr auto', gap: '16px' }}>
          <select style={{ width: '100%', padding: '10px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}>
            <option>-- Chọn hành động --</option>
            <option>Xóa đã chọn</option>
            <option>Khóa đã chọn</option>
          </select>
          <button style={{ padding: '10px 40px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            Áp dụng
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', width: '40px', textAlign: 'center' }}><input type="checkbox" /></th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Tài khoản</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Số Token</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Hạng</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Ngày tạo</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Trạng thái</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</td></tr>
            ) : users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', textAlign: 'center' }}><input type="checkbox" /></td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-btn)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>{user.tokens?.toLocaleString() || 0}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    background: user.tier === 'PRO' ? '#f59e0b' : user.tier === 'VIP' ? '#8b5cf6' : '#6b7280',
                    color: '#fff'
                  }}>
                    {user.tier || 'FREE'}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{formatDate(user.createdAt)}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    background: user.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: user.status === 'ACTIVE' ? '#10b981' : '#ef4444'
                  }}>
                    {user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenModal(user)} style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDeleteUser(user._id, user.email)} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                    <button onClick={() => handleToggleStatus(user._id, user.status)} style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>{user.status === 'ACTIVE' ? 'Ban' : 'Unban'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '400px', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Chỉnh sửa {currentUser?.name}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Số dư Token</label>
                <input required type="number" value={formData.tokens} onChange={e => setFormData({...formData, tokens: Number(e.target.value)})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Hạng (Tier)</label>
                <select required value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}>
                  <option value="FREE">FREE</option>
                  <option value="PRO">PRO</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Trạng thái</label>
                <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Khóa</option>
                </select>
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
