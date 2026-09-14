import getChart from '@so-chart/pie';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function HalfPieChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getChart({ container, chartType: 'pie', layout: { height: 320 } });
      chart.setOption({
        labels: {
          position: 'topRight',
          orient: 'vertical',
        },
        datasets: [
          { label: 'A', data: 10 },
          { label: 'B', data: 20 },
          { label: 'C', data: 30 },
        ],
        innerRadius: 50,
        radius: 100,
        startAngle: -Math.PI / 2,
        endAngle: Math.PI / 2,
        hoverText: {
          labelColor: textColor,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="半圆饼图" description="半圆饼图示例，适用于展示少量数据对比" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default HalfPieChart;
