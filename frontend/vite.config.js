import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/music': 'http://localhost:3000', // 백엔드 서버 주소로 프록시
    }
  }
});
