import getBarChart from '@so-chart/bar';
import { useEffect, useRef } from 'react';
import data from '../data/trendBar.json';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { useChartThemeVersion } from '../../../../src/demo/theme';

function TrendBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const chart = getBarChart({ container, chartType: 'trend', layout: { height: 320, left: 60 } });
      chart.setOption({
        bar: { maxBarWidth: 25, barGap: 4 },
        datasets: { label: '趋势', data },
        animate: {
          ease: 'bounceOut',
          duration: 1000,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="趋势柱状图" description="柱宽会根据数据量自适应，hover 使用最近柱位命中" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default TrendBarChart;
