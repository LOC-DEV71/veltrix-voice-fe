import axios from 'axios';

// Dynamic API Base URL: Lấy từ VITE_API_URL khi deploy (ví dụ: https://my-backend.onrender.com/api)
// Ngược lại tự động dùng localhost khi phát triển local
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Tự động đính kèm HttpOnly Cookies giữa Vercel & Render
    headers: {
        'Content-Type': 'application/json'
    }
});

// Tự động đính kèm Bearer Token làm phương án dự phòng 100% khi trình duyệt di động chặn 3rd party cookie
api.interceptors.request.use((config) => {
    const clientToken = localStorage.getItem('token');
    const adminToken = localStorage.getItem('admin_token');

    if (config.url && config.url.includes('/admin/')) {
        if (adminToken && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }
    } else {
        if (clientToken && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${clientToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
