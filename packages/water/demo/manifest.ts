import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '3d-entity',
  packageName: '@so-chart/water',
  title: 'WebGL 水面',
  menuTitle: '水面',
  route: 'water',
  order: 68,
  sections: [
    {
      id: 'water2',
      title: 'Water2 水面与六鱼游动',
      component: () => import('./examples/WaterChart.tsx'),
      source: () => import('./examples/WaterChart.tsx?raw'),
      handbook: () => import('./docs/WaterChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
