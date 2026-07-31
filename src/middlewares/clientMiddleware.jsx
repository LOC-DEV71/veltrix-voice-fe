import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientMe } from '../redux/slices/authSlice';

/**
 * Middleware Frontend bọc phân vùng Client Routes
 * Tự động kiểm tra session / cookie của Client User khi vào các trang Client
 */
export default function ClientMiddleware({ children }) {
  const dispatch = useDispatch();
  const { clientUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientUser) {
      dispatch(fetchClientMe()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [clientUser, dispatch]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Đang nạp dữ liệu Khách hàng...</div>;
  }

  return children;
}
