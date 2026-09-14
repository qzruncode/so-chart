import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/radar',
  title: '雷达图',
  route: 'radar',
  order: 50,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/RadarChart.tsx'),
      source: () => import('./examples/RadarChart.tsx?raw'),
      handbook: () => import('./docs/RadarChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
