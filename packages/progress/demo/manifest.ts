import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '2d-chart',
  packageName: '@so-chart/progress',
  title: '进度条',
  route: 'progress',
  order: 120,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/ProgressChart.tsx'),
      source: () => import('./examples/ProgressChart.tsx?raw'),
      handbook: () => import('./docs/ProgressChart.md?raw'),
    },
    {
      id: 'slider',
      title: '滑块',
      component: () => import('./examples/SliderChart.tsx'),
      source: () => import('./examples/SliderChart.tsx?raw'),
      handbook: () => import('./docs/SliderChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
