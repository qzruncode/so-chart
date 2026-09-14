import getTreeChart from '@so-chart/tree';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

// 节点的 x，y 默认是从中间点绘制的
const nodeWidth = 122;
const nodeHeight = 62;

const commonNodeStyle = {
  bgType: 'bg' as const,
  strokeColor: 'none',
};

const nodes = [
  { label: '插件', x: 100, y: 200, bgColor: '#146fff' },
  { label: '自定义算子', x: 100, y: 300, bgColor: '#146fff' },
  { label: '智能助手', x: 420, y: 100, bgColor: '#05B9C5' },
  { label: '应用链', x: 420, y: 200, bgColor: '#05B9C5' },
  { label: '外部应用', x: 420, y: 300, bgColor: '#05B9C5' },
  { label: '容器', x: 420, y: 400, bgColor: '#05B9C5' },
  { label: 'Deployment and Publishing', x: 820, y: 200, bgColor: '#039be6' },
  { label: '应用体验', x: 1120, y: 200, bgColor: '#994bd4' },
].map(d => Object.assign(d, commonNodeStyle));

function FlowChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');

      const edges = [
        {
          points: [
            [100 + nodeWidth / 2, 200],
            [420 - nodeWidth / 2, 200],
          ],
          label: {
            text: '作为工具使用',
            fontColor: textColor,
          },
        },
        {
          type: 'poly' as const,
          points: [
            [100 + nodeWidth / 2, 300],
            [420 - nodeWidth / 2, 200],
          ],
          poly: {
            direction: 'reverse' as const,
            intersectionPointX: 330,
          },
          label: {
            text: 'Use as a Drag-and-drop Operator',
            pos: 'manual' as const,
            startOffset: 120,
            dir: 'parallel' as const,
            fontColor: textColor,
          },
        },
        {
          type: 'round' as const,
          radius: 20,
          points: [
            [100, 200 - nodeHeight / 2],
            [420 - nodeWidth / 2, 100],
          ],
          label: {
            text: '作为工具使用',
            fontColor: textColor,
          },
        },
        {
          points: [
            [420, 100 + nodeHeight / 2],
            [420, 200 - nodeHeight / 2],
          ],
          label: {
            text: '需要复杂编排时转换为',
            pos: 'manual' as const,
            dir: 'horizontal' as const,
            fontColor: textColor,
          },
        },
        {
          points: [
            [420 + nodeWidth / 2, 200],
            [820 - nodeWidth / 2, 200],
          ],
          label: {
            text: '低代码拖拽编排',
            pos: 'manual' as const,
            startOffset: 150,
            fontColor: textColor,
          },
        },
        {
          type: 'round' as const,
          radius: 20,
          points: [
            [420 + nodeWidth / 2, 100],
            [820, 200 - nodeHeight / 2],
          ],
          roundPosition: 'end' as const,
        },
        {
          type: 'round' as const,
          radius: 20,
          points: [
            [420 + nodeWidth / 2, 300],
            [820, 200 + nodeHeight / 2],
          ],
          roundPosition: 'end' as const,
          label: {
            text: '作为完整应用引入',
            pos: 'manual' as const,
            startOffset: 150,
            fontColor: textColor,
          },
        },
        {
          type: 'round' as const,
          radius: 20,
          points: [
            [420 + nodeWidth / 2, 400],
            [820, 200 + nodeHeight / 2],
          ],
          roundPosition: 'end' as const,
          label: {
            text: '作为完整应用引入',
            pos: 'manual' as const,
            startOffset: 150,
            fontColor: textColor,
          },
        },
        {
          points: [
            [820 + nodeWidth / 2, 200],
            [1120 - nodeWidth / 2, 200],
          ],
        },
      ];

      const chart = getTreeChart({
        container,
        chartType: 'flow',
        layout: {
          height: 450,
        },
      });
      chart.setOption({
        datasets: { nodes: nodes.map(node => ({ ...node, fontColor: textColor })), edges },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="应用流程图" description="长文本标签沿折线路径自适应排布" height={450}>
      <div ref={ref} style={{ width: 1200, height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default FlowChart;
