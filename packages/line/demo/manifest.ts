import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/line',
  title: '折线图',
  route: 'line',
  order: 10,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/LineChart.tsx'),
      source: () => import('./examples/LineChart.tsx?raw'),
      handbook: () => import('./docs/LineChart.md?raw'),
    },
    {
      id: 'mark',
      title: '标记',
      component: () => import('./examples/LineMarkChart.tsx'),
      source: () => import('./examples/LineMarkChart.tsx?raw'),
      handbook: () => import('./docs/LineMarkChart.md?raw'),
    },
    {
      id: 'area',
      title: '面积',
      component: () => import('./examples/AreaLineChart.tsx'),
      source: () => import('./examples/AreaLineChart.tsx?raw'),
    },
    {
      id: 'stack',
      title: '堆叠',
      component: () => import('./examples/StackLineChart.tsx'),
      source: () => import('./examples/StackLineChart.tsx?raw'),
    },
    {
      id: 'drag-tooltip',
      title: '拖拽 Tooltip',
      component: () => import('./examples/DargTooltipChart.tsx'),
      source: () => import('./examples/DargTooltipChart.tsx?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
