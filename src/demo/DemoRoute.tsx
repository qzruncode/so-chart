import { Navigate, useParams } from 'react-router-dom';
import DemoPage from './DemoPage';
import { getFirstDemoPath, resolveDemoPackage } from './registry';

export default function DemoRoute() {
  const { packageRoute, sectionId } = useParams<{ packageRoute?: string; sectionId?: string }>();
  const manifest = resolveDemoPackage(packageRoute);

  if (!manifest) return <Navigate to={`/${getFirstDemoPath()}`} replace />;

  if (packageRoute !== manifest.route) {
    const legacySectionId = manifest.sections.some(section => section.id === packageRoute) ? packageRoute : undefined;
    const target = `/chart/${manifest.route}${legacySectionId ? `/${legacySectionId}` : ''}`;
    return <Navigate to={target} replace />;
  }

  if (sectionId && !manifest.sections.some(section => section.id === sectionId)) {
    return <Navigate to={`/chart/${manifest.route}`} replace />;
  }

  return <DemoPage manifest={manifest} initialSectionId={sectionId} />;
}
