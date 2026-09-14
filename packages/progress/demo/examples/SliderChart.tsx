import getProgressChart from '@so-chart/progress';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { useChartThemeVersion } from '../../../../src/demo/theme';

function SliderChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const chart = getProgressChart({
        container,
        chartType: 'progress',
        layout: {
          height: 20,
        },
      });
      chart.setOption({
        animate: {
          duration: 1000,
        },
        data: {
          value: 80,
          end: 100,
        },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="滑块进度" description="带动画效果的进度条" height={20}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default SliderChart;
