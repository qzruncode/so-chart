import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '3d-entity',
  packageName: '@so-chart/fire',
  title: '蜡烛演示',
  menuTitle: '蜡烛火焰',
  route: 'fire',
  order: 69,
  sections: [
    {
      id: 'volumetric',
      title: '基础蜡烛 / 高阶静物',
      component: () => import('./examples/FireChart.tsx'),
      source: () => import('./examples/FireChart.tsx?raw'),
      handbook: () => import('./docs/FireChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
