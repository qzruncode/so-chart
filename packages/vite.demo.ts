import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, searchForWorkspaceRoot, type UserConfig } from 'vite';

const packageNames = [
  'bar',
  'calendar',
  'basket',
  'fire',
  'fruit',
  'guage',
  'line',
  'pie',
  'point',
  'progress',
  'radar',
  'sankey',
  'scatter3d',
  'table3d',
  'tabs',
  'tooltip',
  'tree',
  'types',
  'utils',
];

const packageAliases = Object.fromEntries(
  packageNames.map(packageName => [`@so-chart/${packageName}`, path.resolve(import.meta.dirname, packageName, 'src')])
);

export function createPackageDemoConfig(): UserConfig {
  return defineConfig({
    plugins: [react()],
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    resolve: {
      alias: packageAliases,
      dedupe: ['three'],
    },
    optimizeDeps: {
      exclude: packageNames.map(packageName => `@so-chart/${packageName}`),
    },
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
    },
  });
}
