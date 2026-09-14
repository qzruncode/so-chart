import type { DemoPackageManifest } from './types';

const manifestModules = import.meta.glob('../../packages/*/demo/manifest.ts', {
  eager: true,
  import: 'default',
}) as Record<string, DemoPackageManifest>;

function assertValidManifest(manifest: DemoPackageManifest, filePath: string) {
  if (!manifest.packageName || !manifest.title || !manifest.route || !Number.isFinite(manifest.order)) {
    throw new Error(`Invalid demo manifest metadata: ${filePath}`);
  }

  if (manifest.sections.length === 0) {
    throw new Error(`Demo manifest must contain at least one section: ${filePath}`);
  }

  const sectionIds = new Set<string>();
  for (const section of manifest.sections) {
    if (!section.id || !section.title || !section.component || !section.source) {
      throw new Error(`Invalid demo section in ${filePath}: ${section.id || '<missing id>'}`);
    }
    if (sectionIds.has(section.id)) {
      throw new Error(`Duplicate demo section id in ${filePath}: ${section.id}`);
    }
    sectionIds.add(section.id);
  }
}

export const demoPackages = Object.entries(manifestModules)
  .map(([filePath, manifest]) => {
    assertValidManifest(manifest, filePath);
    return manifest;
  })
  .sort((left, right) => left.order - right.order || left.title.localeCompare(right.title));

const routeToPackage = new Map<string, DemoPackageManifest>();
for (const manifest of demoPackages) {
  const routes = [manifest.route, ...(manifest.aliases ?? [])];
  for (const route of routes) {
    if (routeToPackage.has(route)) {
      throw new Error(`Duplicate demo route: ${route}`);
    }
    routeToPackage.set(route, manifest);
  }
}

export function resolveDemoPackage(route: string | undefined) {
  return route ? routeToPackage.get(route) : undefined;
}

export function getFirstDemoPath() {
  const firstPackage = demoPackages[0];
  if (!firstPackage) throw new Error('No demo package manifest found');
  return `chart/${firstPackage.route}`;
}
