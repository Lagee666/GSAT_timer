import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/GSAT_timer' : '/', // 生產環境用 /GSAT_timer，開發環境用 /
    plugins: [react()],
  };
});