import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@so-chart/utils': resolve(import.meta.dirname, 'packages/utils/src/index.ts'),
      '@so-chart/types': resolve(import.meta.dirname, 'packages/types/src/index.ts'),
      '@so-chart/types/line': resolve(import.meta.dirname, 'packages/types/src/line.ts'),
      '@so-chart/types/bar': resolve(import.meta.dirname, 'packages/types/src/bar.ts'),
      '@so-chart/types/pie': resolve(import.meta.dirname, 'packages/types/src/pie.ts'),
      '@so-chart/types/radar': resolve(import.meta.dirname, 'packages/types/src/radar.ts'),
      '@so-chart/types/point': resolve(import.meta.dirname, 'packages/types/src/point.ts'),
      '@so-chart/types/common': resolve(import.meta.dirname, 'packages/types/src/common.ts'),
      '@so-chart/tooltip': resolve(import.meta.dirname, 'packages/tooltip/src/index.ts'),
      '@so-chart/tabs': resolve(import.meta.dirname, 'packages/tabs/src/index.ts'),
      '@so-chart/types/calendar': resolve(import.meta.dirname, 'packages/types/src/calendar.ts'),
      '@so-chart/types/progress': resolve(import.meta.dirname, 'packages/types/src/progress.ts'),
      '@so-chart/types/sankey': resolve(import.meta.dirname, 'packages/types/src/sankey.ts'),
      '@so-chart/types/tree': resolve(import.meta.dirname, 'packages/types/src/tree.ts'),
      '@so-chart/types/guage': resolve(import.meta.dirname, 'packages/types/src/guage.ts'),
    },
  },
  test: {
    include: ['packages/**/__tests__/**/*.test.ts'],
    environment: 'jsdom',
    benchmark: {
      include: ['packages/**/__bench__/**/*.bench.ts'],
      outputJson: 'benchmark-results.json',
    },
    globals: true,
  },
});
