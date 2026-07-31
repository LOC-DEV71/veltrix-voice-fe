import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { Users, Zap, ShieldCheck, Activity, Mic, TrendingUp, TrendingDown, Clock, ArrowUpRight } from 'lucide-react';
import { formatNumber, formatDate } from '../../utils/formatters';

const StatCard = ({ title, value, icon: Icon, color, bgColor, suffix = '', trend = null }) => (
  <div style={{
    background: '#111322',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    cursor: 'default'
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
        {title}
      </span>
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px',
        background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} color={color} />
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
      <span style={{ fontSize: '30px', fontWeight: '800', color: '#fff' }}>
        {value}
      </span>
      {suffix && <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>{suffix}</span>}
    </div>
    {trend !== null && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
        {trend >= 0 ? (
          <>
            <TrendingUp size={14} color="#10b981" />
            <span style={{ color: '#10b981', fontWeight: '600' }}>+{trend}%</span>
          </>
        ) : (
          <>
            <TrendingDown size={14} color="#ef4444" />
            <span style={{ color: '#ef4444', fontWeight: '600' }}>{trend}%</span>
          </>
        )}
        <span style={{ color: '#6b7280' }}>so với tháng trước</span>
      </div>
    )}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminService.getStats(),
          adminService.getAllUsers()
        ]);
        setStats(statsRes.data.stats);
        setRecentUsers((usersRes.data.users || []).slice(0, 5));
      } catch (err) {
        console.error("Lỗi tải dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6b7280' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spin" style={{ width: '32px', height: '32px', border: '3px solid #1e293b', borderTopColor: '#3b82f6', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            Đang tải dữ liệu thống kê...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: 0 }}>
          Tổng quan hệ thống
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
          Báo cáo hoạt động kinh doanh và tình hình hệ thống Veltrix Voice
        </p>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
          <StatCard
            title="Tổng khách hàng"
            value={formatNumber(stats.totalUsers)}
            icon={Users}
            color="#3b82f6"
            bgColor="rgba(59, 130, 246, 0.12)"
            trend={12}
          />
          <StatCard
            title="Tổng token toàn mạng"
            value={formatNumber(stats.totalTokensAvailable)}
            suffix="ký tự"
            icon={Zap}
            color="#a855f7"
            bgColor="rgba(168, 85, 247, 0.12)"
            trend={8}
          />
          <StatCard
            title="Tài khoản PRO"
            value={formatNumber(stats.totalProUsers)}
            icon={ShieldCheck}
            color="#06b6d4"
            bgColor="rgba(6, 182, 212, 0.12)"
            trend={25}
          />
          <StatCard
            title="Trạng thái Server"
            value={stats.systemStatus || 'Online'}
            icon={Activity}
            color="#10b981"
            bgColor="rgba(16, 185, 129, 0.12)"
          />
        </div>
      )}

      {/* 2 Columns: Recent Users + Quick Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' }}>
        {/* Bảng Người dùng gần đây */}
        <div style={{
          background: '#111322',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#3b82f6" />
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>Người dùng gần đây</span>
            </div>
            <a href="/admin/users" style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              Xem tất cả <ArrowUpRight size={12} />
            </a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <th style={{ padding: '12px 22px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tên</th>
                <th style={{ padding: '12px 22px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                <th style={{ padding: '12px 22px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gói</th>
                <th style={{ padding: '12px 22px', textAlign: 'right', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Token</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '12px', fontWeight: '700'
                      }}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#e5e7eb' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px', fontSize: '13px', color: '#9ca3af' }}>{u.email}</td>
                  <td style={{ padding: '14px 22px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '700',
                      background: u.tier === 'ROLE_PRO' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                      color: u.tier === 'ROLE_PRO' ? '#06b6d4' : '#a78bfa',
                      padding: '3px 8px', borderRadius: '6px'
                    }}>
                      {u.tier === 'ROLE_PRO' ? 'PRO' : 'Free'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 22px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#a78bfa' }}>
                    {formatNumber(u.tokens)}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Chưa có người dùng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Giọng đọc khả dụng */}
          <div style={{
            background: '#111322',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Mic size={16} color="#06b6d4" />
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Giọng đọc</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.08)' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#3b82f6' }}>2</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Tiếng Việt</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.08)' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#a855f7' }}>2</div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Tiếng Anh</div>
              </div>
            </div>
          </div>

          {/* Hoạt động gần đây */}
          <div style={{
            background: '#111322',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '22px',
            flex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Clock size={16} color="#f59e0b" />
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Hoạt động nổi bật</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {recentUsers.slice(0, 3).map((u, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0,
                    background: ['#3b82f6', '#10b981', '#f59e0b'][idx % 3]
                  }} />
                  <div>
                    <div style={{ fontSize: '12.5px', color: '#d1d5db', lineHeight: '1.5' }}>
                      <b style={{ color: '#e5e7eb' }}>{u.name}</b> đã đăng ký tài khoản mới
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                      {formatDate(u.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <div style={{ fontSize: '12.5px', color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>Chưa có hoạt động</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
