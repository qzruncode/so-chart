import getChart from '@so-chart/line';
import { useEffect, useRef } from 'react';
import data from '../../../demo-fixtures/line.json';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function AreaLineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const crosslineColor = getThemeColor(container, '--chart-crossline-color', 0.3);
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getChart({ container, chartType: 'line', layout: { height: 320 } });
      chart.setOption({
        showPoint: false,
        smooth: true,
        area: true,
        xAxis: {
          type: 'date',
          data: {
            start: new Date(1677658584000),
            end: new Date(1677658614000),
          },
          showSplitLine: false,
          fontColor: textColor,
          lineColor: textColor,
        },
        yAxis: {
          type: 'value',
          data: { start: 0, end: 300 },
          showAixsText: false,
          fontColor: textColor,
          lineColor: textColor,
        },
        labels: {
          data: ['a', 'b', 'c'],
          type: 'path',
          path: 'M3.18,3H0V1H3.18A3,3,0,0,0,3,2,3,3,0,0,0,3.18,3ZM8.82,1A3,3,0,0,1,9,2a3,3,0,0,1-.18,1H12V1ZM6,0A2,2,0,1,0,8,2,2,2,0,0,0,6,0Z',
        },
        datasets: [
          { label: 'a', data: data[0], missing: 'straight', lineWidth: 1.5 },
          { label: 'b', data: data[1], lineWidth: 1.5 },
          { label: 'c', data: data[2], lineWidth: 1.5, missing: 'zero' },
        ],
        cross: {
          showXLine: false,
          showHint: false,
          lineColor: crosslineColor,
        },
        tooltip: {
          formatter: (v: string | number | Date) => `${Number(v).toFixed(1)}%`,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="面积图" description="面积图示例，显示数据随时间变化的趋势" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default AreaLineChart;
