import getBarChart from '@so-chart/bar';
import { useEffect, useRef } from 'react';
import { data, xAxisData } from '../data/circlebar';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function CircleStackBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getBarChart({ container, chartType: 'circleStackBar', layout: { height: 600 } });
      chart.setOption({
        xAxis: {
          type: 'category',
          data: xAxisData,
          fontColor: textColor,
          lineColor: textColor,
          autoSkip: true,
          maxTicks: 12,
        },
        bar: { minWidth: 2, maxWidth: 24, gap: 2 },
        yAxis: { type: 'radial', data: { start: 0, end: 300 } },
        datasets: [
          { label: 'a', data: data[0] },
          { label: 'b', data: data[1] },
          { label: 'c', data: data[2] },
        ],
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="环形柱状图" description="环形柱宽、半径和标签会随容器与数据量自适应" height={600}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default CircleStackBarChart;
