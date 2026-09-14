import getChart from '@so-chart/guage';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function SpeedChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const tickColor = getThemeColor(container, '--chart-tick-color', 0.3);
      const textColor = getThemeColor(container, '--text-color');

      const chart = getChart({ container, chartType: 'single', layout: { height: 250 } });
      chart.setOption({
        value: 0.5,
        fontSize: 26,
        showText: '64.7%',
        startAngle: (-Math.PI * 3) / 4,
        endAngle: (Math.PI * 3) / 4,
        radius: [80, 90],
        tick: {
          show: true,
          lineColor: tickColor,
          lineWidth: 2,
        },
        fontColor: textColor,
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="速度表" description="速度表样式的仪表盘" height={250}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default SpeedChart;
