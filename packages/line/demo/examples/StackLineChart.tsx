import getChart from '@so-chart/line';
import { useEffect, useRef } from 'react';
import data from '../../../demo-fixtures/line.json';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function StackLineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const crosslineColor = getThemeColor(container, '--chart-crossline-color', 0.3);
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getChart({ container, chartType: 'line', layout: { height: 320 } });
      chart.setOption({
        smooth: true,
        stack: true,
        xAxis: {
          type: 'date',
          data: {
            start: new Date(1677658584000),
            end: new Date(1677658614000),
          },
          fontColor: textColor,
          lineColor: textColor,
        },
        yAxis: {
          type: 'value',
          data: { start: 0, end: 300 },
          fontColor: textColor,
          lineColor: textColor,
        },
        labels: {
          data: ['a', 'b', 'c'],
        },
        datasets: [
          { label: 'a', data: data[0], missing: 'straight', lineWidth: 1.5 },
          { label: 'b', data: data[1], lineWidth: 1.5 },
          { label: 'c', data: data[2], lineWidth: 1.5, missing: 'zero' },
        ],
        cross: {
          lineColor: crosslineColor,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="堆叠图" description="堆叠折线图示例，显示多组数据的累积趋势" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default StackLineChart;
