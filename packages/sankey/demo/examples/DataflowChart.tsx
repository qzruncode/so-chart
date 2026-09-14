import { useEffect, useRef } from 'react';
import getSankeyChart from '@so-chart/sankey';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

const nodes = [
  { name: 'Brazil' },
  { name: 'Portugal' },
  { name: 'France' },
  { name: 'Spain' },
  { name: 'England' },
  { name: 'Canada' },
  { name: 'Mexico' },
  { name: 'USA' },
  { name: 'Angola' },
  { name: 'Senegal' },
  { name: 'Morocco' },
  { name: 'South Africa' },
  { name: 'China' },
  { name: 'India' },
  { name: 'Japan' },
  { name: 'Mali' },
];

const links = [
  { source: 0, target: 1, value: 5 },
  { source: 0, target: 2, value: 1.0 },
  { source: 0, target: 3, value: 1 },
  { source: 0, target: 4, value: 1 },
  { source: 5, target: 1, value: 1 },
  { source: 5, target: 2, value: 5 },
  { source: 5, target: 4, value: 1 },
  { source: 6, target: 1, value: 1 },
  { source: 6, target: 2, value: 1 },
  { source: 6, target: 3, value: 5 },
  { source: 6, target: 4, value: 1 },
  { source: 7, target: 1, value: 1 },
  { source: 7, target: 2, value: 1 },
  { source: 7, target: 3, value: 1 },
  { source: 7, target: 4, value: 5 },
  { source: 1, target: 8, value: 2 },
  { source: 1, target: 9, value: 1 },
  { source: 1, target: 10, value: 1 },
  { source: 1, target: 11, value: 3 },
  { source: 2, target: 8, value: 1 },
  { source: 2, target: 9, value: 3 },
  { source: 2, target: 15, value: 3 },
  { source: 2, target: 10, value: 3 },
  { source: 2, target: 11, value: 1 },
  { source: 3, target: 9, value: 1 },
  { source: 3, target: 10, value: 3 },
  { source: 3, target: 11, value: 1 },
  { source: 4, target: 8, value: 1 },
  { source: 4, target: 9, value: 1 },
  { source: 4, target: 10, value: 2 },
  { source: 4, target: 11, value: 7 },
  { source: 11, target: 12, value: 5 },
  { source: 11, target: 13, value: 1 },
  { source: 11, target: 14, value: 3 },
  { source: 8, target: 12, value: 5 },
  { source: 8, target: 13, value: 1 },
  { source: 8, target: 14, value: 3 },
  { source: 9, target: 12, value: 5 },
  { source: 9, target: 13, value: 1 },
  { source: 9, target: 14, value: 3 },
  { source: 15, target: 12, value: 5 },
  { source: 15, target: 13, value: 1 },
  { source: 15, target: 14, value: 3 },
  { source: 10, target: 12, value: 5 },
  { source: 10, target: 13, value: 1 },
  { source: 10, target: 14, value: 3 },
];

function DataflowChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-color');
      const linkBackground = getThemeColor(container, '--chart-flow-link-background', 0.1);

      const chart = getSankeyChart({
        container,
        chartType: 'dataflow',
        layout: {
          right: 80,
        },
      });
      chart.setOption({
        animate: {
          ease: 'cubicOut',
        },
        datasets: {
          nodes: nodes,
          links: links.map(d => ({ ...d, color: linkBackground })),
        },
        style: {
          fontColor: textColor,
          linkHoverColor: getThemeColor(container, '--primary-color'),
          linkHoverOpacity: 0.35,
          linkHoverWidth: 2.5,
          linkHoverHitWidth: 14,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="数据流图" description="Sankey 数据流可视化" height={400}>
      <div ref={ref} style={{ width: 1200, height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default DataflowChart;
