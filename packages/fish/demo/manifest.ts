import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '3d-entity',
  packageName: '@so-chart/fish',
  title: '3D 淡水鱼',
  menuTitle: '淡水鱼',
  route: 'fish',
  order: 69,
  sections: [
    {
      id: 'basic',
      title: '六种常见淡水鱼',
      component: () => import('./examples/FishChart.tsx'),
      source: () => import('./examples/FishChart.tsx?raw'),
      handbook: () => import('./docs/FishChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
