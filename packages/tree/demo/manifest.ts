import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/tree',
  title: '树图',
  route: 'tree',
  aliases: ['dagre', 'flow', 'mash'],
  order: 70,
  sections: [
    {
      id: 'dagre',
      title: 'Dagre 图',
      component: () => import('./examples/DagreChart.tsx'),
      source: () => import('./examples/DagreChart.tsx?raw'),
      handbook: () => import('./docs/DagreChart.md?raw'),
    },
    {
      id: 'flow',
      title: '流程图',
      component: () => import('./examples/FlowChart.tsx'),
      source: () => import('./examples/FlowChart.tsx?raw'),
      handbook: () => import('./docs/FlowChart.md?raw'),
    },
    {
      id: 'flow1',
      title: '流程图 1',
      component: () => import('./examples/FlowChart1.tsx'),
      source: () => import('./examples/FlowChart1.tsx?raw'),
    },
    {
      id: 'flow2',
      title: '流程图 2',
      component: () => import('./examples/FlowChart2.tsx'),
      source: () => import('./examples/FlowChart2.tsx?raw'),
    },
    {
      id: 'mash',
      title: '混搭流程图',
      component: () => import('./examples/MashChart.tsx'),
      source: () => import('./examples/MashChart.tsx?raw'),
      handbook: () => import('./docs/MashChart.md?raw'),
    },
    {
      id: 'mash1',
      title: '混搭 1',
      component: () => import('./examples/MashChart1.tsx'),
      source: () => import('./examples/MashChart1.tsx?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
