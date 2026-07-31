import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import Swal from 'sweetalert2';
import { Trash2, Edit, PlusCircle, Search } from 'lucide-react';

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resRoles, resPerms] = await Promise.all([
        adminService.getRoles(),
        adminService.getPermissionGroups()
      ]);
      setRoles(resRoles.data.roles || []);
      setPermissionGroups(resPerms.data.groups || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu nhóm quyền:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setCurrentRole(role);
      setFormData({
        title: role.title,
        slug: role.slug,
        description: role.description || '',
        permissions: role.permissions || []
      });
    } else {
      setCurrentRole(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        permissions: []
      });
    }
    setShowModal(true);
  };

  const handleTogglePermission = (value) => {
    setFormData(prev => {
      const perms = prev.permissions;
      if (perms.includes(value)) {
        return { ...prev, permissions: perms.filter(p => p !== value) };
      } else {
        return { ...prev, permissions: [...perms, value] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRole) {
        await adminService.updateRole(currentRole._id, formData);
        Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Cập nhật nhóm quyền thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      } else {
        await adminService.createRole(formData);
        Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Thêm nhóm quyền mới thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
    }
  };

  const handleDelete = async (id, title) => {
    const res = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa nhóm quyền [${title}] không?`,
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
        await adminService.deleteRole(id);
        Swal.fire({ icon: 'success', title: 'Đã xóa!', text: 'Xóa nhóm quyền thành công!', background: '#181824', color: '#fff', confirmButtonColor: '#10b981' });
        loadData();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Lỗi xóa!', text: err.response?.data?.error || err.message, background: '#181824', color: '#fff', confirmButtonColor: '#ef4444' });
      }
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>Quản lý Nhóm quyền</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Tạo và phân quyền cho các nhóm tài khoản quản trị</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-purple)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          <PlusCircle size={18} /> Thêm Nhóm quyền
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Tên nhóm (Slug)</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Mô tả</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px' }}>Số quyền</th>
              <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Đang tải dữ liệu...</td></tr>
            ) : roles.map((role) => (
              <tr key={role._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{role.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{role.slug}</div>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{role.description}</td>
                <td style={{ padding: '16px', fontSize: '13px' }}>
                  <span style={{ padding: '6px 12px', background: 'rgba(168,85,247,0.1)', color: 'var(--primary-purple)', borderRadius: '20px', fontWeight: '600', fontSize: '12px' }}>
                    {role.permissions.length} quyền
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(role)} style={{ background: '#3b82f6', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', color: '#fff' }}><Edit size={16} /></button>
                  {role.slug !== 'super-admin' && (
                    <button onClick={() => handleDelete(role._id, role.title)} style={{ background: '#ef4444', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', color: '#fff' }}><Trash2 size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{currentRole ? 'Cập nhật Nhóm quyền' : 'Thêm Nhóm quyền mới'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Tên nhóm</label><input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} /></div>
                <div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Slug (Mã)</label><input required disabled={currentRole?.slug === 'super-admin'} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} /></div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--text-primary)' }}>Phân quyền chức năng</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {permissionGroups.map(group => (
                    <div key={group.key} style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary-purple)' }}>{group.title}</div>
                      {group.permissions.map(p => (
                        <label key={p.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                          <input 
                            type="checkbox" 
                            checked={formData.permissions.includes(p.value)}
                            onChange={() => handleTogglePermission(p.value)}
                            disabled={currentRole?.slug === 'super-admin'} // Không cho sửa quyền của super-admin ở giao diện
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
