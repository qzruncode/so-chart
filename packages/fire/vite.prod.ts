import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SoChartFire',
      fileName: 'fire',
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
