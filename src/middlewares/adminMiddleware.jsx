import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminMe } from '../redux/slices/authSlice';

/**
 * Middleware Frontend bọc phân vùng Admin Routes
 * Tự động kiểm tra Token & Permission của Admin Account
 * Nếu chưa đăng nhập Admin -> Tự động chuyển hướng về /admin/login
 */
export default function AdminMiddleware({ children, requiredPermission = null }) {
  const dispatch = useDispatch();
  const { adminAccount } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminAccount) {
      dispatch(fetchAdminMe()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [adminAccount, dispatch]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Đang xác thực phiên làm việc Quản trị viên...</div>;
  }

  // Nếu chưa đăng nhập Admin -> Chuyển về trang đăng nhập Admin
  if (!adminAccount) {
    return <Navigate to="/admin/login" replace />;
  }

  // Kiểm tra Granular Permission ở Frontend (nếu Route có yêu cầu permission cụ thể)
  if (requiredPermission && adminAccount.role) {
    const permissions = adminAccount.role.permissions || [];
    const isSuperAdmin = adminAccount.role.slug === 'super-admin';
    
    if (!isSuperAdmin && !permissions.includes(requiredPermission)) {
      return (
        <div style={{ color: '#ef4444', padding: '40px', textAlign: 'center' }}>
          <h2>Bị từ chối truy cập! (403 Forbidden)</h2>
          <p>Tài khoản Admin của bạn thiếu quyền: <b>[{requiredPermission}]</b></p>
        </div>
      );
    }
  }

  return children;
}
