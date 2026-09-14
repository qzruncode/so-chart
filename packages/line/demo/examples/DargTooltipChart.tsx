import getLineChart from '@so-chart/line';
import { useEffect, useRef } from 'react';
import data from '../../../demo-fixtures/line.json';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function DargTooltipChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const crosslineColor = getThemeColor(container, '--chart-crossline-color', 0.3);
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getLineChart({ container, chartType: 'line', layout: { height: 320 } });
      chart.setOption({
        smooth: true,
        xAxis: {
          type: 'date',
          data: {
            start: new Date(1677658585000),
            end: new Date(1677658614000),
          },
          showSplitLine: false,
          fontColor: textColor,
          lineColor: textColor,
        },
        yAxis: {
          type: 'value',
          data: { start: 0, end: 300 },
          showAixsText: true,
          title: {
            text: 'Value',
          },
          fontColor: textColor,
          lineColor: textColor,
        },
        datasets: [
          { label: 'a', data: data[0], missing: 'straight', lineWidth: 1.5 },
          { label: 'b', data: data[1], lineWidth: 1.5 },
          { label: 'c', data: data[2], lineWidth: 1.5, missing: 'zero' },
        ],
        cross: {
          lineColor: crosslineColor,
        },
        tooltip: {
          fixed: true,
          drag: true,
          extra: {
            text: '详情',
            func: (index: number) => {
              console.log('详情', index);
            },
          },
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="拖拽 Tooltip" description="支持拖拽的固定 Tooltip，拖动后仍可查看数据详情" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default DargTooltipChart;
