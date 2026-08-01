import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientService } from '../../services/clientService';

export const fetchVoices = createAsyncThunk('tts/fetchVoices', async (_, { rejectWithValue }) => {
    try {
        const response = await clientService.getVoices();
        return response.data.voices;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Lỗi tải danh sách giọng');
    }
});

export const fetchAudioHistory = createAsyncThunk('tts/fetchAudioHistory', async (_, { rejectWithValue }) => {
    try {
        const response = await clientService.getAudioHistory();
        return response.data.history.map(item => ({
            id: item._id,
            text: item.text,
            title: item.title || '',
            folder: item.folder || 'Mặc định',
            voiceId: item.voiceId,
            audioUrl: item.audioUrl,
            time: new Date(item.createdAt).toLocaleTimeString('vi-VN')
        }));
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Lỗi tải lịch sử');
    }
});

export const deleteAudioItem = createAsyncThunk('tts/deleteAudioItem', async (id, { rejectWithValue }) => {
    try {
        await clientService.deleteAudioHistory(id);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.error || 'Lỗi xóa bài đọc');
    }
});

const ttsSlice = createSlice({
    name: 'tts',
    initialState: {
        voices: [],
        selectedVoice: 'vi-VN-HoaiMyNeural',
        text: 'Xin chào! Đây là ứng dụng tạo giọng nói trí tuệ nhân tạo được xây dựng với chuẩn kiến trúc Redux Toolkit và MVC.',
        history: [],
        rate: 1, // Tốc độ đọc
        pitch: 0, // Độ cao giọng (Hz)
        loading: false,
        error: null
    },
    reducers: {
        setSelectedVoice: (state, action) => {
            state.selectedVoice = action.payload;
        },
        setText: (state, action) => {
            state.text = action.payload;
        },
        addHistoryItem: (state, action) => {
            state.history.unshift(action.payload);
        },
        replaceHistoryItem: (state, action) => {
            const { tempId, realItem } = action.payload;
            const index = state.history.findIndex(item => item.id === tempId);
            if (index !== -1) {
                state.history[index] = realItem;
            } else {
                state.history.unshift(realItem);
            }
        },
        removeHistoryItem: (state, action) => {
            const idToRemove = action.payload;
            state.history = state.history.filter(item => item.id !== idToRemove);
        },
        setRate: (state, action) => {
            state.rate = action.payload;
        },
        setPitch: (state, action) => {
            state.pitch = action.payload;
        },
        updateItemFolder: (state, action) => {
            const { id, folder } = action.payload;
            const item = state.history.find(i => i.id === id);
            if (item) {
                item.folder = folder;
            }
        },
        updateItemTitle: (state, action) => {
            const { id, title } = action.payload;
            const item = state.history.find(i => i.id === id);
            if (item) {
                item.title = title;
            }
        },
        reorderHistory: (state, action) => {
            const { dragIndex, hoverIndex } = action.payload;
            const draggedItem = state.history[dragIndex];
            if (draggedItem) {
                state.history.splice(dragIndex, 1);
                state.history.splice(hoverIndex, 0, draggedItem);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVoices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVoices.fulfilled, (state, action) => {
                state.loading = false;
                state.voices = action.payload;
            })
            .addCase(fetchVoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAudioHistory.fulfilled, (state, action) => {
                state.history = action.payload;
            })
            .addCase(deleteAudioItem.fulfilled, (state, action) => {
                state.history = state.history.filter(item => item.id !== action.payload);
            });
    }
});

export const { setSelectedVoice, setText, addHistoryItem, replaceHistoryItem, removeHistoryItem, setRate, setPitch, updateItemFolder, updateItemTitle, reorderHistory } = ttsSlice.actions;
export default ttsSlice.reducer;
