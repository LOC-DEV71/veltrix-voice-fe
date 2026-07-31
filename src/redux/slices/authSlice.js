import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientService } from '../../services/clientService';
import { adminService } from '../../services/adminService';

// 1. Client Auth Thunks
export const fetchClientMe = createAsyncThunk('auth/fetchClientMe', async (_, { rejectWithValue }) => {
    try {
        const response = await clientService.getMe();
        return response.data.user;
    } catch (err) {
        return rejectWithValue(null);
    }
});

export const loginClientAsync = createAsyncThunk('auth/loginClientAsync', async (credentials, { rejectWithValue }) => {
    try {
        const response = await clientService.login(credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Lỗi đăng nhập Khách hàng');
    }
});

export const loginGoogleAsync = createAsyncThunk('auth/loginGoogleAsync', async (idToken, { rejectWithValue }) => {
    try {
        const response = await clientService.loginGoogle(idToken);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Lỗi đăng nhập Google');
    }
});

export const logoutClientAsync = createAsyncThunk('auth/logoutClientAsync', async () => {
    try {
        await clientService.logout();
    } catch (e) {
        console.warn('Lỗi logout backend:', e);
    }
    localStorage.removeItem('token');
    return null;
});

// 2. Admin Auth Thunks
export const fetchAdminMe = createAsyncThunk('auth/fetchAdminMe', async (_, { rejectWithValue }) => {
    try {
        const response = await adminService.getAdminMe();
        return response.data.account;
    } catch (err) {
        return rejectWithValue(null);
    }
});

export const loginAdminAsync = createAsyncThunk('auth/loginAdminAsync', async (credentials, { rejectWithValue }) => {
    try {
        const response = await adminService.loginAdmin(credentials);
        if (response.data.token) {
            localStorage.setItem('admin_token', response.data.token);
        }
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Lỗi đăng nhập Admin');
    }
});

export const logoutAdminAsync = createAsyncThunk('auth/logoutAdminAsync', async () => {
    try {
        await adminService.logoutAdmin();
    } catch (e) {
        console.warn('Lỗi logout admin backend:', e);
    }
    localStorage.removeItem('admin_token');
    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        clientUser: null,
        adminAccount: null,
        loading: false,
        error: null
    },
    reducers: {
        updateTokens: (state, action) => {
            if (state.clientUser) {
                state.clientUser.tokens = action.payload;
            }
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Client Fetch & Login & Logout
            .addCase(fetchClientMe.fulfilled, (state, action) => {
                state.clientUser = action.payload;
            })
            .addCase(loginClientAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginClientAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.clientUser = action.payload.user || action.payload;
            })
            .addCase(loginClientAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Google Login
            .addCase(loginGoogleAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginGoogleAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.clientUser = action.payload.user || action.payload;
            })
            .addCase(loginGoogleAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutClientAsync.fulfilled, (state) => {
                state.clientUser = null;
            })
            // Admin Fetch & Login & Logout
            .addCase(fetchAdminMe.fulfilled, (state, action) => {
                state.adminAccount = action.payload;
            })
            .addCase(loginAdminAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdminAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.adminAccount = action.payload.account || action.payload;
            })
            .addCase(loginAdminAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutAdminAsync.fulfilled, (state) => {
                state.adminAccount = null;
            });
    }
});

export const { updateTokens, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
