import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/point',
  title: '散点图',
  route: 'point',
  order: 60,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/PointChart.tsx'),
      source: () => import('./examples/PointChart.tsx?raw'),
      handbook: () => import('./docs/PointChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
