import getChart from '@so-chart/pie';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function CirclePieChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getChart({ container, chartType: 'pie', layout: { height: 320, top: 120 } });
      chart.setOption({
        position: { x: 'center', y: 'top' },
        hoverText: {
          type: 'center',
          unit: '',
          totalText: '总量',
          labelColor: textColor,
        },
        labels: {
          data: ['Search Engine: 1048', 'Email: 580', 'Direct: 735', 'Union Ads: 484', 'Video Ads: 300'],
          position: 'bottom',
          orient: 'flex',
        },
        innerRadius: 80,
        radius: 100,
        datasets: [
          { data: 1048, label: 'Search Engine' },
          { data: 735, label: 'Direct' },
          { data: 580, label: 'Email' },
          { data: 484, label: 'Union Ads' },
          { data: 300, label: 'Video Ads' },
        ],
        tooltip: {
          show: false,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="环形饼图" description="环形饼图示例，显示各部分占总量比例" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default CirclePieChart;
