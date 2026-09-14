import { lazy, useMemo } from 'react';
import ChartPage from '../components/ChartPage';
import type { DemoPackageManifest, DemoPageSection } from './types';

interface DemoPageProps {
  manifest: DemoPackageManifest;
  initialSectionId?: string;
}

export default function DemoPage({ manifest, initialSectionId }: DemoPageProps) {
  const sections = useMemo<DemoPageSection[]>(
    () => manifest.sections.map(section => ({ ...section, component: lazy(section.component) })),
    [manifest]
  );

  return <ChartPage key={manifest.route} title={manifest.title} sections={sections} initialSectionId={initialSectionId} />;
}
