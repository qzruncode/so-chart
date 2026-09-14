import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SoChartSankey', // UMD模式下的包名
      fileName: 'sankey', // 打包后的文件名
    },
    rollupOptions: {
      external: ['d3', 'd3-sankey', '@so-chart/utils'],
      output: {
        globals: {
          d3: 'd3',
          'd3-sankey': 'd3Sankey',
          '@so-chart/utils': 'SoChartUtils',
        },
      },
    },
  },
});
