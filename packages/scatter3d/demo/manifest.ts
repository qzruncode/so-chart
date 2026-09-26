import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '3d-chart',
  packageName: '@so-chart/scatter3d',
  title: '3D 散点图',
  route: 'scatter3d',
  order: 65,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/Scatter3DChart.tsx'),
      source: () => import('./examples/Scatter3DChart.tsx?raw'),
      handbook: () => import('./docs/Scatter3DChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
