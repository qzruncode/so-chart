import getChart from '@so-chart/guage';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { useChartThemeVersion } from '../../../../src/demo/theme';

function CircleChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const chart = getChart({ container, chartType: 'circle', layout: { height: 170 } });
      chart.setOption({
        value: 0.2,
        startAngle: 0,
        endAngle: Math.PI * 2,
        radius: [40, 60],
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="圆形图表" description="圆形进度图" height={170}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default CircleChart;
