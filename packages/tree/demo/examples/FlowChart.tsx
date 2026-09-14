import getTreeChart from '@so-chart/tree';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

// 节点的 x，y 默认是从中间点绘制的
const nodeWidth = 122;
const nodeHeight = 62;

const nodes = [
  { label: '节点管理\n节点/算力卡', x: 100, y: 100 },
  { label: '算力切分\n模板/动态', bgType: 'linearGradient' as const, x: 300, y: 100 },
  { label: '资源规格\n新建资源规格', x: 500, y: 100 },
  { label: '资源组管理\n选节点和卡', x: 500, y: 200 },
  { label: '租户管理\n租户绑定资源组', x: 700, y: 200 },
  { label: '空间管理\n新建工作空间', x: 900, y: 200 },
  { label: '资源使用\n新建服务/任务', x: 500, y: 300 },
  { label: '监控中心\n算力/服务', x: 100, y: 300 },
];

const edges = [
  {
    points: [
      [100 + nodeWidth / 2, 100],
      [300 - nodeWidth / 2, 100],
    ],
  },
  {
    type: 'round' as const,
    radius: 20,
    points: [
      [200, 100],
      [500 - nodeWidth / 2, 200],
    ],
  },
  {
    points: [
      [300 + nodeWidth / 2, 100],
      [500 - nodeWidth / 2, 100],
    ],
  },
  {
    endType: 'none' as const,
    points: [
      [500, 100 + nodeHeight / 2],
      [500, 200 - nodeHeight / 2],
    ],
  },
  {
    points: [
      [500, 200 + nodeHeight / 2],
      [500, 300 - nodeHeight / 2],
    ],
  },
  {
    points: [
      [500 - nodeWidth / 2, 300],
      [100 + nodeWidth / 2, 300],
    ],
  },
  {
    points: [
      [100, 100 + nodeHeight / 2],
      [100, 300 - nodeHeight / 2],
    ],
  },
  {
    points: [
      [500 + nodeWidth / 2, 200],
      [700 - nodeWidth / 2, 200],
    ],
  },
  {
    points: [
      [700 + nodeWidth / 2, 200],
      [900 - nodeWidth / 2, 200],
    ],
  },
];

function FlowChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const textColor = getThemeColor(container, '--text-secondary-color');
      const chart = getTreeChart({
        container,
        chartType: 'flow',
        layout: {
          height: 350,
        },
      });
      chart.setOption({
        datasets: { nodes: nodes.map(node => ({ ...node, fontColor: textColor })), edges },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="流程图" description="基础流程图示例" height={350}>
      <div ref={ref} style={{ width: 1200, height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default FlowChart;
