import React, { useEffect, useState } from 'react';
import { Suspense } from 'react';
import Divider from 'antd/es/divider';
import theme from 'antd/es/theme';
import type { DemoPageSection } from '../../demo/types';

const Des = React.lazy(() => import('../../des'));

interface ChartPageProps {
  title: string;
  sections: DemoPageSection[];
  initialSectionId?: string;
}

const ChartPage: React.FC<ChartPageProps> = ({ title, sections, initialSectionId }) => {
  const { token } = theme.useToken();
  const [activeId, setActiveId] = useState(
    initialSectionId && sections.some(section => section.id === initialSectionId) ? initialSectionId : (sections[0]?.id ?? '')
  );

  useEffect(() => {
    if (!initialSectionId || !sections.some(section => section.id === initialSectionId)) return;

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(initialSectionId)?.scrollIntoView({ block: 'start' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [initialSectionId, sections]);

  // IntersectionObserver to highlight active section
  useEffect(() => {
    let frameId: number | null = null;

    const updateActiveSection = () => {
      frameId = null;
      const sectionPositions = sections
        .map(section => {
          const element = document.getElementById(section.id);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { id: section.id, top: rect.top, bottom: rect.bottom };
        })
        .filter((section): section is { id: string; top: number; bottom: number } => section !== null);

      if (sectionPositions.length === 0) return;

      const headerBottom = document.querySelector('.so-chart-header')?.getBoundingClientRect().bottom ?? 72;
      const anchorTop = Math.max(96, headerBottom + 24);
      const passedSections = sectionPositions.filter(section => section.top <= anchorTop && section.bottom > anchorTop);
      const activeSection = passedSections[passedSections.length - 1] ?? sectionPositions[0];

      setActiveId(activeSection.id);
    };

    const scheduleActiveSectionUpdate = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateActiveSection);
    };

    const observer = new IntersectionObserver(scheduleActiveSectionUpdate, { rootMargin: '-80px 0px -60% 0px', threshold: [0, 0.1, 0.5, 1] });
    window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true });

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    scheduleActiveSectionUpdate();

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleActiveSectionUpdate);
      observer.disconnect();
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setActiveId(id);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showToc = sections.length > 1;

  const itemStyle = (active: boolean): React.CSSProperties => ({
    display: 'block',
    padding: '8px 12px',
    margin: '2px 0',
    fontSize: '13px',
    color: active ? token.colorPrimary : token.colorTextSecondary,
    background: active ? token.colorPrimaryBg : 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    borderLeft: active ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
    textDecoration: 'none',
    transition: 'all 0.2s',
  });

  return (
    <div className="chart-page" style={{ display: 'flex', gap: 0, position: 'relative' }}>
      {/* Main content */}
      <div className="chart-page__main" style={{ flex: 1, minWidth: 0, paddingRight: showToc ? 24 : 0 }}>
        <h2
          style={{
            margin: '0 0 24px 0',
            fontSize: '20px',
            fontWeight: 600,
            color: token.colorTextHeading,
          }}
        >
          {title}
        </h2>
        {sections.map(section => (
          <div key={section.id} id={section.id} className="chart-page__section">
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: token.colorText,
              }}
            >
              {section.title}
            </h3>
            <Suspense
              fallback={<div style={{ minHeight: 240, display: 'grid', placeItems: 'center', color: token.colorTextSecondary }}>图表加载中…</div>}
            >
              <section.component />
            </Suspense>
            {section.source && (
              <Suspense fallback={<div style={{ minHeight: 120, color: token.colorTextSecondary }}>示例说明加载中…</div>}>
                <Des source={section.source} handbook={section.handbook} />
              </Suspense>
            )}
            <Divider />
          </div>
        ))}
      </div>

      {/* TOC column */}
      {showToc && (
        <div
          className="chart-page__toc-shell"
          style={{
            width: 200,
            flexShrink: 0,
            position: 'sticky',
            top: 16,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          <div
            id="chart-page-toc"
            className="chart-page__toc"
            style={{
              background: token.colorBgContainer,
              borderRadius: '8px',
              border: `1px solid ${token.colorBorderSecondary}`,
              padding: '16px',
              boxShadow: token.boxShadowSecondary,
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: token.colorTextHeading,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              目录
            </div>
            <div className="chart-page__toc-list">
              {sections.map(section => (
                <a
                  key={section.id}
                  style={itemStyle(activeId === section.id)}
                  onClick={e => {
                    e.preventDefault();
                    scrollTo(section.id);
                  }}
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartPage;
