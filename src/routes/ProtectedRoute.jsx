import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminMe } from '../redux/slices/authSlice';

export default function ProtectedRoute({ children, isAdmin = false }) {
  const dispatch = useDispatch();
  const { adminAccount } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAdmin && !adminAccount) {
      dispatch(fetchAdminMe()).finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [isAdmin, adminAccount, dispatch]);

  if (checking) {
    return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Đang xác thực quyền Admin...</div>;
  }

  if (isAdmin && !adminAccount) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
