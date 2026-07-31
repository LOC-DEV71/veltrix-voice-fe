import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ttsReducer from './slices/ttsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tts: ttsReducer
    }
});
