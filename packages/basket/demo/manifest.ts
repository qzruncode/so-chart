import type { DemoPackageManifest } from '../../../src/demo/types';

const manifest = {
  category: '3d-entity',
  packageName: '@so-chart/basket',
  title: '真实藤编空篮',
  route: 'basket',
  order: 67,
  sections: [
    {
      id: 'realistic',
      title: '平铺对比两种空篮篮型',
      component: () => import('./examples/BasketChart.tsx'),
      source: () => import('./examples/BasketChart.tsx?raw'),
      handbook: () => import('./docs/BasketChart.md?raw'),
    },
  ],
} satisfies DemoPackageManifest;

export default manifest;
