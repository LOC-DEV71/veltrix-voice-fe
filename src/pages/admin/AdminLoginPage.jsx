import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { loginAdminAsync } from '../../redux/slices/authSlice';

import Swal from 'sweetalert2';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdminAsync({ email, password }));
    if (loginAdminAsync.fulfilled.match(result)) {
      const account = result.payload;
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập Admin thành công! 🔐',
        text: `Xin chào [Chức vụ: ${account.role?.title || 'Super Admin'}] ${account.name}`,
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#10b981',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        navigate('/admin/dashboard');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại!',
        text: result.payload || 'Email hoặc mật khẩu không chính xác',
        background: '#181824',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080911' }}>
      <div style={{ background: '#121526', border: '1px solid var(--border-color)', padding: '36px', borderRadius: '20px', width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '800', color: '#f43f5e', marginBottom: '24px', justifyContent: 'center' }}>
          <Shield size={28} /> Admin Portal Login
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>EMAIL ADMIN</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: '#fff' }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>MẬT KHẨU ADMIN</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: '#fff' }}
              required
            />
          </div>
          <button type="submit" className="btn-cta" disabled={loading} style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #e11d48, #be123c)', marginTop: '10px' }}>
            {loading ? 'Đang xác thực...' : 'Truy Cập Admin System 🔒'}
          </button>
        </form>
      </div>
    </div>
  );
}
