import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/pie',
  title: '饼图',
  route: 'pie',
  order: 30,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/PieChart.tsx'),
      source: () => import('./examples/PieChart.tsx?raw'),
      handbook: () => import('./docs/PieChart.md?raw'),
    },
    {
      id: 'circle',
      title: '环形饼图',
      component: () => import('./examples/CirclePieChart.tsx'),
      source: () => import('./examples/CirclePieChart.tsx?raw'),
    },
    {
      id: 'half',
      title: '半圆饼图',
      component: () => import('./examples/HalfPieChart.tsx'),
      source: () => import('./examples/HalfPieChart.tsx?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
