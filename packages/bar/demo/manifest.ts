import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '2d-chart',
  packageName: '@so-chart/bar',
  title: '柱状图',
  route: 'bar',
  order: 20,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/BarChart.tsx'),
      source: () => import('./examples/BarChart.tsx?raw'),
      handbook: () => import('./docs/BarChart.md?raw'),
    },
    {
      id: 'stack',
      title: '堆叠',
      component: () => import('./examples/StackBarChart.tsx'),
      source: () => import('./examples/StackBarChart.tsx?raw'),
    },
    {
      id: 'mark',
      title: '标记',
      component: () => import('./examples/MarkBarChart.tsx'),
      source: () => import('./examples/MarkBarChart.tsx?raw'),
    },
    {
      id: 'trend',
      title: '趋势',
      component: () => import('./examples/TrendBar.tsx'),
      source: () => import('./examples/TrendBar.tsx?raw'),
      handbook: () => import('./docs/TrendBar.md?raw'),
    },
    {
      id: 'circle-stack',
      title: '环形堆叠',
      component: () => import('./examples/CircleStackBarChart.tsx'),
      source: () => import('./examples/CircleStackBarChart.tsx?raw'),
      handbook: () => import('./docs/CircleStackBarChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
