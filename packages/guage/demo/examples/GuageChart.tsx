import getChart from '@so-chart/guage';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function GuageChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-color');

      const chart = getChart({ container, chartType: 'guage', layout: { height: 280 } });
      chart.setOption({
        datasets: [{ data: 0.1 }, { data: 0.6 }, { data: 0.8 }, { data: 1 }],
        value: 0.5,
        outerRadius: [100, 110],
        innerRadius: [70, 90],
        fontSize: 26,
        fontColor: textColor,
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="仪表盘" description="基础仪表盘示例，支持速度表、圆形图表等变体" height={280}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default GuageChart;
