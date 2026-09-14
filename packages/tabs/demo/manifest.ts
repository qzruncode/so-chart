import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  packageName: '@so-chart/tabs',
  title: '搜索 Tabs',
  route: 'tabs',
  order: 130,
  sections: [
    {
      id: 'search',
      title: '搜索',
      component: () => import('./examples/Search.tsx'),
      source: () => import('./examples/Search.tsx?raw'),
      handbook: () => import('./docs/Tabs.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
