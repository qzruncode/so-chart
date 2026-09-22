import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  resolve: {
    alias: {
      '@so-chart/bar': path.resolve(import.meta.dirname, 'packages/bar/src'),
      '@so-chart/calendar': path.resolve(import.meta.dirname, 'packages/calendar/src'),
      '@so-chart/guage': path.resolve(import.meta.dirname, 'packages/guage/src'),
      '@so-chart/line': path.resolve(import.meta.dirname, 'packages/line/src'),
      '@so-chart/pie': path.resolve(import.meta.dirname, 'packages/pie/src'),
      '@so-chart/point': path.resolve(import.meta.dirname, 'packages/point/src'),
      '@so-chart/progress': path.resolve(import.meta.dirname, 'packages/progress/src'),
      '@so-chart/radar': path.resolve(import.meta.dirname, 'packages/radar/src'),
      '@so-chart/sankey': path.resolve(import.meta.dirname, 'packages/sankey/src'),
      '@so-chart/scatter3d': path.resolve(import.meta.dirname, 'packages/scatter3d/src'),
      '@so-chart/tabs': path.resolve(import.meta.dirname, 'packages/tabs/src'),
      '@so-chart/tooltip': path.resolve(import.meta.dirname, 'packages/tooltip/src'),
      '@so-chart/tree': path.resolve(import.meta.dirname, 'packages/tree/src'),
      '@so-chart/types': path.resolve(import.meta.dirname, 'packages/types/src'),
      '@so-chart/utils': path.resolve(import.meta.dirname, 'packages/utils/src'),
    },
  },
  optimizeDeps: {
    exclude: [
      '@so-chart/bar',
      '@so-chart/calendar',
      '@so-chart/guage',
      '@so-chart/line',
      '@so-chart/pie',
      '@so-chart/point',
      '@so-chart/progress',
      '@so-chart/radar',
      '@so-chart/sankey',
      '@so-chart/scatter3d',
      '@so-chart/tabs',
      '@so-chart/tooltip',
      '@so-chart/tree',
      '@so-chart/types',
      '@so-chart/utils',
    ],
  },
});
