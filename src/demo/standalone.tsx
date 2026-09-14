import { createRoot } from 'react-dom/client';
import ConfigProvider from 'antd/es/config-provider';
import DemoPage from './DemoPage';
import type { DemoPackageManifest } from './types';
import '../styles/global.less';

export function renderStandaloneDemo(manifest: DemoPackageManifest) {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Missing #root element');

  createRoot(rootElement).render(
    <ConfigProvider>
      <main style={{ minHeight: '100vh', padding: 24, background: '#f5f5f5' }}>
        <DemoPage manifest={manifest} />
      </main>
    </ConfigProvider>
  );
}
