import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '3d-entity',
  packageName: '@so-chart/fruit',
  title: '3D 水果图表',
  menuTitle: '水果',
  route: 'fruit',
  order: 68,
  sections: [
    {
      id: 'basic',
      title: '九种水果展示',
      component: () => import('./examples/FruitChart.tsx'),
      source: () => import('./examples/FruitChart.tsx?raw'),
      handbook: () => import('./docs/FruitChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
