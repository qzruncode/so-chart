import getPointChart from '@so-chart/point';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';
import data from '../../../demo-fixtures/line.json';

function PointChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');
      const crosslineColor = getThemeColor(container, '--chart-crossline-color');

      const chart = getPointChart({ container, chartType: 'point', layout: { height: 320 } });
      chart.setOption({
        xAxis: {
          type: 'date',
          data: {
            start: new Date(1677658584000),
            end: new Date(1677658614000),
          },
          fontColor: textColor,
          lineColor: textColor,
        },
        yAxis: { type: 'value', data: { start: 0, end: 300 }, fontColor: textColor, lineColor: textColor },
        labels: {
          data: ['a', 'b', 'c'],
        },
        datasets: [
          { label: 'a', data: data[0], dotSize: 6 },
          { label: 'b', data: data[1], dotSize: 8 },
          { label: 'c', data: data[2], dotSize: 10 },
        ],
        tooltip: {
          formatter: (v: string | number | Date) => `${Number(v).toFixed(1)}%`,
        },
        cross: {
          lineColor: crosslineColor,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="点图" description="多系列散点图示例，高频 hover 事件按浏览器帧合并处理，Tooltip 平滑跟随" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default PointChart;
