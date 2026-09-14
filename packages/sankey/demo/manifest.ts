import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/sankey',
  title: '数据流向图',
  route: 'sankey',
  aliases: ['sankey_dataflow'],
  order: 110,
  sections: [
    {
      id: 'basic',
      title: '基础',
      component: () => import('./examples/DataflowChart.tsx'),
      source: () => import('./examples/DataflowChart.tsx?raw'),
      handbook: () => import('./docs/DataflowChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
