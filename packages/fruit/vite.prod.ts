import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SoChartFruit',
      fileName: 'fruit',
    },
    rollupOptions: {
      external: ['three', '@so-chart/types', '@so-chart/utils'],
      output: {
        exports: 'named',
        globals: {
          three: 'THREE',
          '@so-chart/types': 'SoChartTypes',
          '@so-chart/utils': 'SoChartUtils',
        },
      },
    },
  },
});
