import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SoChartScatter3D',
      fileName: 'scatter3d',
    },
    rollupOptions: {
      external: ['three', '@so-chart/types', '@so-chart/tooltip', '@so-chart/utils'],
      output: {
        exports: 'named',
        globals: {
          three: 'THREE',
          '@so-chart/types': 'SoChartTypes',
          '@so-chart/tooltip': 'SoChartTooltip',
          '@so-chart/utils': 'SoChartUtils',
        },
      },
    },
  },
});
