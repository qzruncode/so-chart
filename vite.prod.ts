import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

const plugins = [react(), ...(process.env.ANALYZE === 'true' ? [visualizer({ open: false, gzipSize: true, brotliSize: true })] : [])];
const publicBase = process.env.VITE_BASE_PATH || './';

export default defineConfig({
  plugins,
  mode: 'production',
  base: publicBase,
  build: {
    assetsDir: 'js',
    // Three.js is intentionally isolated as the 3D demo's vendor runtime.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) {
            return 'three';
          }
          if (
            id.includes('/node_modules/react-router/') ||
            id.includes('/node_modules/react-router-dom/') ||
            id.includes('/node_modules/@remix-run/router/')
          ) {
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
