import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '3d-entity',
  packageName: '@so-chart/table3d',
  title: '仿真 3D 桌子',
  menuTitle: '桌子',
  route: 'table3d',
  order: 67,
  sections: [
    {
      id: 'realistic',
      title: 'PBR 仿真木桌',
      component: () => import('./examples/Table3DChart.tsx'),
      source: () => import('./examples/Table3DChart.tsx?raw'),
      handbook: () => import('./docs/Table3DChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
