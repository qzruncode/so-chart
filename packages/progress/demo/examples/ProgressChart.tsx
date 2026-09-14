import getProgressChart from '@so-chart/progress';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { useChartThemeVersion } from '../../../../src/demo/theme';

function ProgressChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const chart = getProgressChart({
        container,
        chartType: 'slider',
        layout: {
          height: 20,
        },
      });
      chart.setOption({
        data: {
          value: 80,
          end: 100,
        },
        linearGradient: [
          {
            stopColor: '#EC4D57',
            stopOpacity: 1,
            offset: '0%',
          },
          {
            stopColor: '#F9A21E',
            stopOpacity: 1,
            offset: '50%',
          },
          {
            stopColor: '#35D131',
            stopOpacity: 1,
            offset: '100%',
          },
        ],
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="进度条" description="渐变色彩的进度条，动画 easing 按实例缓存，卸载时释放实例" height={20}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default ProgressChart;
