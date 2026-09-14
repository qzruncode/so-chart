import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SoChartTooltip', // UMD模式下的包名
      fileName: 'tooltip', // 打包后的文件名
    },
    rollupOptions: {
      external: ['d3', '@so-chart/utils'],
      output: {
        globals: {
          d3: 'd3',
          '@so-chart/utils': 'SoChartUtils',
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
