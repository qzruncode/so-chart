import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/calendar',
  title: '日历热点图',
  route: 'calendar',
  aliases: ['calendar_heatmap'],
  order: 100,
  sections: [
    {
      id: 'multi',
      title: '多行',
      component: () => import('./examples/MultipleLines.tsx'),
      source: () => import('./examples/MultipleLines.tsx?raw'),
      handbook: () => import('./docs/CalendarHeatmap.md?raw'),
    },
    {
      id: 'single',
      title: '单行',
      component: () => import('./examples/OneLine.tsx'),
      source: () => import('./examples/OneLine.tsx?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
