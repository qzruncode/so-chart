import getBarChart from '@so-chart/bar';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

const arr1 = [75, 33, 90, 200];
const arr2 = [75, 132, null, 253];
const arr3 = [98, 107, 25, 75];

function BarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getBarChart({ container, chartType: 'bar', layout: { height: 320, left: 60 } });
      chart.setOption({
        cs: 'lightblue',
        xAxis: {
          type: 'category',
          data: ['春季', '夏季', '秋季', '冬季'],
          fontColor: textColor,
          lineColor: textColor,
        },
        yAxis: {
          type: 'value',
          data: { start: 0, end: 300 },
          format: 's',
          unitText: 'B/S',
          title: {
            text: '%',
          },
          fontColor: textColor,
          lineColor: textColor,
        },
        datasets: [
          { label: 'a', data: arr1 },
          { label: 'b', data: arr2 },
          { label: 'c', data: arr3 },
        ],
        animate: {
          ease: 'bounceOut',
          duration: 1000,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="柱状图" description="基础分组柱状图示例，组间空白区域保持最近柱位，动画帧复用绘制资源，Tooltip 平滑跟随鼠标" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default BarChart;
