import getChart from '@so-chart/pie';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function PieChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getChart({ container, chartType: 'pie', layout: { height: 320 } });
      chart.setOption({
        tooltip: {
          show: true,
        },
        labels: {
          data: ['Search Engine: 1048', 'Email: 580', 'Direct: 735', 'Union Ads: 484', 'Video Ads: 300'],
          position: 'topRight',
          orient: 'vertical',
        },
        datasets: [
          { data: 1048, label: 'Search Engine' },
          { data: 735, label: 'Direct' },
          { data: 580, label: 'Email' },
          { data: 484, label: 'Union Ads' },
          { data: 300, label: 'Video Ads' },
        ],
        hoverText: {
          labelColor: textColor,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="饼图" description="基础饼图示例，仅在命中扇区变化时重绘高亮，Tooltip 会保持间距并平滑跟随鼠标" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default PieChart;
