import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/guage',
  title: '仪表盘',
  route: 'guage',
  order: 40,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/GuageChart.tsx'),
      source: () => import('./examples/GuageChart.tsx?raw'),
      handbook: () => import('./docs/GuageChart.md?raw'),
    },
    {
      id: 'single',
      title: '单值',
      component: () => import('./examples/SingleChart.tsx'),
      source: () => import('./examples/SingleChart.tsx?raw'),
      handbook: () => import('./docs/SingleChart.md?raw'),
    },
    {
      id: 'circle',
      title: '圆形',
      component: () => import('./examples/CircleChart.tsx'),
      source: () => import('./examples/CircleChart.tsx?raw'),
      handbook: () => import('./docs/CircleChart.md?raw'),
    },
    {
      id: 'speed',
      title: '速度',
      component: () => import('./examples/SpeedChart.tsx'),
      source: () => import('./examples/SpeedChart.tsx?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
