import getBarChart from '@so-chart/bar';
import { useEffect, useRef } from 'react';
import data from '../../../demo-fixtures/line.json';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function MarkBarChart() {
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
          data: ['2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08'],
          fontColor: textColor,
          lineColor: textColor,
        },
        yAxis: {
          type: 'value',
          data: { start: 0, end: 300 },
          format: 's',
          unitText: 'B/S',
          fontColor: textColor,
          lineColor: textColor,
        },
        datasets: [
          { label: 'a', data: data[0].slice(0, 6) },
          { label: 'b', data: data[1].slice(0, 6) },
          { label: 'c', data: data[2].slice(0, 6) },
        ],
        animate: {
          ease: 'bounceOut',
          duration: 1000,
        },
        mark: [
          {
            type: 'line',
            x: new Date('2023-05-01'),
            lineWidth: 5,
            click: () => {
              console.log('click');
            },
          },
        ],
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="标记柱状图" description="支持添加标记线、标记点的柱状图" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default MarkBarChart;
