import type { ComponentType, ElementType } from 'react';

export type DemoComponentLoader = () => Promise<{ default: ComponentType }>;

export type DemoContentLoader = () => Promise<{ default: string }>;

export interface DemoSectionManifest {
  id: string;
  title: string;
  component: DemoComponentLoader;
  source: DemoContentLoader;
  handbook?: DemoContentLoader;
}

export interface DemoPackageManifest {
  packageName: string;
  title: string;
  route: string;
  order: number;
  aliases?: readonly string[];
  sections: readonly DemoSectionManifest[];
}

export interface DemoPageSection extends Omit<DemoSectionManifest, 'component'> {
  component: ElementType;
}
