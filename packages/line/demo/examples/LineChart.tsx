import getLineChart, { type LineChartInstance, type LineOptions } from '@so-chart/line';
import { useEffect, useRef } from 'react';
import data from '../../../demo-fixtures/line.json';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function LineChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const crosslineColor = getThemeColor(container, '--chart-crossline-color', 0.3);
      const textColor = getThemeColor(container, '--text-secondary-color');

      // 宿主页面提供 nonce 时由图表包自动复用，示例无需重复传入。
      const chart: LineChartInstance = getLineChart({
        container,
        chartType: 'line',
        layout: { height: 320 },
      });
      const options: LineOptions = {
        smooth: true,
        animate: {
          duration: 1500,
        },
        xAxis: {
          type: 'date',
          data: {
            start: new Date(1677658585000),
            end: new Date(1677658614000),
          },
          showSplitLine: false,
          fontColor: textColor,
          lineColor: textColor,
        },
        yAxis: {
          type: 'value',
          data: { start: 0, end: 300 },
          showAixsText: true,
          title: {
            text: 'Value',
          },
          fontColor: textColor,
          lineColor: textColor,
        },
        datasets: [
          { label: 'a', data: data[0], missing: 'straight', lineWidth: 2 },
          { label: 'b', data: data[1], lineWidth: 2 },
          { label: 'c', data: data[2], lineWidth: 2, missing: 'zero' },
        ],
        cross: {
          showXLine: true,
          showYLine: true,
          showHint: true,
          lineColor: crosslineColor,
        },
        tooltip: {
          formatter: (v: string | number | Date) => `${Number(v).toFixed(1)}%`,
        },
      };
      chart.setOption(options);
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper
      title="折线图"
      description="基础折线图示例，支持平滑曲线、面积图、堆叠图；动画帧复用静态路径，Tooltip 平滑跟随并转义数据文本"
      height={320}
    >
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default LineChart;
