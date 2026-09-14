import getChart from '@so-chart/guage';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function SingleChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-color');

      const chart = getChart({ container, chartType: 'single', layout: { height: 150 } });
      chart.setOption({
        value: 0.5,
        fontSize: 26,
        fontColor: textColor,
        showText: '1000',
        tooltip: () => '当前值：50%',
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="单值仪表盘" description="显示单一数值，Tooltip 内容缓存并按帧平滑跟随，卸载时释放实例" height={150}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default SingleChart;
