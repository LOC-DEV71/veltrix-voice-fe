import api from './api';

export const adminService = {
    // Admin Auth APIs
    loginAdmin: (data) => api.post('/admin/auth/login', data),
    logoutAdmin: () => api.post('/admin/auth/logout'),
    getAdminMe: () => api.get('/admin/auth/me'),

    // User Management APIs
    getAllUsers: () => api.get('/admin/users'),
    updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

    // System Stats API
    getStats: () => api.get('/admin/stats'),

    // Voice Management APIs
    getVoices: () => api.get('/admin/voices'),
    createVoice: (data) => api.post('/admin/voices', data),
    updateVoice: (id, data) => api.put(`/admin/voices/${id}`, data),
    deleteVoice: (id) => api.delete(`/admin/voices/${id}`),
    generateSampleVoiceAudio: (data) => api.post('/admin/voices/generate-sample', data),

    // Plan Management APIs
    getPlans: () => api.get('/admin/plans'),
    createPlan: (data) => api.post('/admin/plans', data),
    updatePlan: (id, data) => api.put(`/admin/plans/${id}`, data),
    deletePlan: (id) => api.delete(`/admin/plans/${id}`),

    // Role Management APIs
    getPermissionGroups: () => api.get('/admin/roles/permissions'),
    getRoles: () => api.get('/admin/roles'),
    createRole: (data) => api.post('/admin/roles', data),
    updateRole: (id, data) => api.put(`/admin/roles/${id}`, data),
    deleteRole: (id) => api.delete(`/admin/roles/${id}`),

    // Admin Account Management APIs
    getAccounts: () => api.get('/admin/auth'),
    createAccount: (data) => api.post('/admin/auth', data),
    updateAccount: (id, data) => api.put(`/admin/auth/${id}`, data),
    deleteAccount: (id) => api.delete(`/admin/auth/${id}`),

    // TikTok Promo Management APIs
    getPromoRequests: (status) => api.get('/admin/promos/requests', { params: { status } }),
    approvePromoRequest: (id, adminNote) => api.put(`/admin/promos/requests/${id}/approve`, { adminNote }),
    rejectPromoRequest: (id, adminNote) => api.put(`/admin/promos/requests/${id}/reject`, { adminNote }),
    getPromoConfig: () => api.get('/admin/promos/config'),
    updatePromoConfig: (data) => api.put('/admin/promos/config', data),

    // System Settings Management APIs
    getSettings: () => api.get('/admin/settings'),
    updateSettings: (data) => api.put('/admin/settings', data),
    sendTestEmail: (data) => api.post('/admin/settings/test-email', data)
};
