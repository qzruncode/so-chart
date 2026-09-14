import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SoChartTree', // UMD模式下的包名
      fileName: 'tree', // 打包后的文件名
    },
    rollupOptions: {
      external: ['d3', '@dagrejs/dagre', '@so-chart/utils'],
      output: {
        globals: {
          d3: 'd3',
          '@dagrejs/dagre': 'dagre',
          '@so-chart/utils': 'SoChartUtils',
        },
      },
    },
  },
});
