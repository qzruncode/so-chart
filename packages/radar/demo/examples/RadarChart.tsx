import getRadarChart from '@so-chart/radar';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function RadarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getRadarChart({ container, chartType: 'radar', layout: { height: 320 } });
      chart.setOption({
        xAxis: {
          type: 'category',
          data: ['金', '木', '水', '火', '土'],
          fontColor: textColor,
          lineColor: textColor,
          lineWidth: 0.6,
        },
        radius: 150,
        textPadding: 20,
        hover: {
          opacity: 0.24,
          lineWidth: 3,
        },
        tooltip: {
          show: true,
        },
        yAxis: {
          type: 'value',
          data: { start: 0, end: 600 },
          lineColor: textColor,
          fontColor: textColor,
          lineWidth: 0.6,
        },
        datasets: [
          { data: [200, 200, 200, 200, 200], label: 'aaa' },
          { data: [75, null, 68, 253, 524], label: 'bbb' },
          { data: [75, 132, null, 253, 64], label: 'ccc' },
        ],
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="雷达图" description="雷达图/蜘蛛网图，支持多维度数据对比；区域命中数据复用，Tooltip 按帧跟随并平滑翻转" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default RadarChart;
