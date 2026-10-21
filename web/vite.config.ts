import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// dev: `cargo run` (LISTEN=0.0.0.0:8080) and `npm run dev` proxies the API to it
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
  server: { proxy: { '/api': 'http://localhost:8080', '/healthz': 'http://localhost:8080' } },
});
