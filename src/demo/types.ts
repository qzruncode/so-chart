import type { ComponentType, ElementType } from 'react';

export type DemoComponentLoader = () => Promise<{ default: ComponentType }>;

export type DemoContentLoader = () => Promise<{ default: string }>;

export const demoCategories = [
  { id: '2d-chart', title: '2D 图表' },
  { id: '3d-chart', title: '3D 图表' },
  { id: '3d-entity', title: '3D 实体' },
] as const;

export type DemoCategory = (typeof demoCategories)[number]['id'];

export interface DemoSectionManifest {
  id: string;
  title: string;
  component: DemoComponentLoader;
  source: DemoContentLoader;
  handbook?: DemoContentLoader;
}

export interface DemoPackageManifest {
  category: DemoCategory;
  packageName: string;
  title: string;
  menuTitle?: string;
  route: string;
  order: number;
  aliases?: readonly string[];
  sections: readonly DemoSectionManifest[];
}

export interface DemoPageSection extends Omit<DemoSectionManifest, 'component'> {
  component: ElementType;
}
