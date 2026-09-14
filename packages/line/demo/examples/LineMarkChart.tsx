import getLineChart from '@so-chart/line';
import { type ReactNode, useEffect, useRef } from 'react';
import data from '../../../demo-fixtures/line.json';
import { createRoot, type Root } from 'react-dom/client';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function LineMarkChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const crosslineColor = getThemeColor(container, '--chart-crossline-color', 0.3);
      const textColor = getThemeColor(container, '--text-secondary-color');

      const chart = getLineChart({ container, chartType: 'line', layout: { height: 320 } });
      chart.setOption({
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
          { label: 'a', data: data[0], missing: 'straight', lineWidth: 1.5 },
          { label: 'b', data: data[1], lineWidth: 1.5 },
          { label: 'c', data: data[2], lineWidth: 1.5, missing: 'zero' },
        ],
        cross: {
          showXLine: false,
          showYLine: true,
          showHint: false,
          lineColor: crosslineColor,
        },
        mark: [
          {
            type: 'line',
            x: new Date(1677658595500),
            lineWidth: 5,
            click: () => {
              console.log('click');
            },
          },
          {
            type: 'line',
            y: 111,
            message: (container: HTMLDivElement) => {
              renderMessage(container, <Message time="2022-04-09 10:20:30" msg="222" />);
            },
          },
          {
            type: 'point',
            x: new Date(1677658598000),
            y: 121,
            dotSize: 5,
            message: (container: HTMLDivElement) => {
              renderMessage(container, <Message time="2022-04-09 10:20:30" msg="333" />);
            },
          },
        ],
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="标记线/点" description="支持添加标记线、标记点，可绑定点击事件" height={320}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

const messageRoots = new WeakMap<HTMLDivElement, Root>();

function renderMessage(container: HTMLDivElement, message: ReactNode) {
  let root = messageRoots.get(container);
  if (!root) {
    root = createRoot(container);
    messageRoots.set(container, root);
  }
  root.render(message);
}

export default LineMarkChart;

function Message(props: { time: string; msg: string }) {
  const { time, msg } = props;
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-attack)',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '12px',
        lineHeight: '1.5',
      }}
    >
      <div>{time}</div>
      <div>{msg}</div>
    </div>
  );
}
