import api from './api';

export const clientService = {
    // Auth & IP Consent APIs
    consentIp: () => api.post('/client/auth/consent-ip'),
    register: (data) => api.post('/client/auth/register', data),
    login: (data) => api.post('/client/auth/login', data),
    loginGoogle: (idToken) => api.post('/client/auth/google', { idToken }),
    logout: () => api.post('/client/auth/logout'),
    getMe: () => api.get('/client/auth/me'),

    // Voice & TTS APIs
    getVoices: () => api.get('/client/voices'),
    previewTTS: (data) => api.post('/client/tts/preview', data, { responseType: 'blob' }),
    generateTTS: (data) => api.post('/client/tts/generate', data, { responseType: 'blob' }),
    getAudioHistory: () => api.get('/client/tts/history'),
    updateAudioFolder: (id, folder) => api.patch(`/client/tts/history/${id}/folder`, { folder }),
    updateAudioTitle: (id, title) => api.patch(`/client/tts/history/${id}/title`, { title }),
    deleteAudioHistory: (id) => api.delete(`/client/tts/history/${id}`),

    // Folders API
    getFolders: () => api.get('/client/tts/folders'),
    createFolder: (data) => api.post('/client/tts/folders', data),
    deleteFolder: (id) => api.delete(`/client/tts/folders/${id}`),

    getLanguages: () => api.get('/client/languages'),

    // Plans
    getPlans: () => api.get('/client/plans'),
    switchPlan: (planCode) => api.post('/client/plans/switch', { planCode }),

    // TikTok Promotion APIs
    getPromoConfig: () => api.get('/client/promo/config'),
    submitTikTokPromo: (data) => api.post('/client/promo/submit', data),
    getMyPromoRequests: () => api.get('/client/promo/my-requests'),

    // Public Settings & Dynamic Pages
    getPublicSettings: () => api.get('/client/settings/public'),
    getPageContent: (slug) => api.get(`/client/pages/${slug}`),

    // Developer API Keys
    getApiKeys: () => api.get('/client/apikeys'),
    createApiKey: (data) => api.post('/client/apikeys', data),
    updateApiKey: (id, data) => api.put(`/client/apikeys/${id}`, data),
    deleteApiKey: (id) => api.delete(`/client/apikeys/${id}`)
};
