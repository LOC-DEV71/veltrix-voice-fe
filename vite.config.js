import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // <--- Giúp chỉ đích danh file .jsx bị lỗi trên Console F12
  },
});