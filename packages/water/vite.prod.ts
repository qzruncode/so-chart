import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SoChartWater',
      fileName: 'water',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^three(?:\/|$)/, /^@so-chart\/types(?:\/|$)/, /^@so-chart\/utils(?:\/|$)/],
      output: {
        exports: 'named',
      },
    },
  },
});
