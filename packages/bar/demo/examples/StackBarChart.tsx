import getBarChart from '@so-chart/bar';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function StackBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getBarChart({ container, chartType: 'bar', layout: { height: 320 } });
      chart.setOption({
        xAxis: {
          type: 'category',
          data: ['春季', '夏季', '秋季', '冬季'],
          showSplitLine: false,
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
          type: 'rect',
        },
        datasets: [
          { label: 'a', data: [75, 33, 90, 200] },
          { label: 'b', data: [75, 132, null, 253] },
          { label: 'c', data: [98, 107, 25, 75] },
        ],
        stack: true,
        tooltip: {
          formatter: (v: string | number | Date) => `${v}个`,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="堆叠柱状图" description="堆叠柱状图示例，显示多组数据的累积对比" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default StackBarChart;
