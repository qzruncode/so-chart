import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SoChartPie', // UMD模式下的包名
      fileName: 'pie', // 打包后的文件名
    },
    rollupOptions: {
      external: ['d3', '@so-chart/utils', '@so-chart/tabs', '@so-chart/tooltip'],
      output: {
        globals: {
          d3: 'd3',
          '@so-chart/utils': 'SoChartUtils',
          '@so-chart/tabs': 'SoChartTabs',
          '@so-chart/tooltip': 'SoChartTooltip',
        },
      },
    },
  },
});
