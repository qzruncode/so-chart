import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

const plugins = [react(), ...(process.env.ANALYZE === 'true' ? [visualizer({ open: false, gzipSize: true, brotliSize: true })] : [])];

export default defineConfig({
  plugins,
  mode: 'production',
  base: './',
  build: {
    assetsDir: 'js',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react-router/') || id.includes('/node_modules/react-router-dom/') || id.includes('/node_modules/@remix-run/router/')) {
            return 'react-router';
          }
          if (id.includes('/node_modules/@ant-design/icons/')) {
            return 'ant-design';
          }
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) {
            return 'react';
          }
        },
      },
    },
  },
});
