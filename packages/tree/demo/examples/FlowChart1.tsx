import getTreeChart from '@so-chart/tree';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

// 节点的 x，y 默认是从中间点绘制的
const nodeWidth = 122;
const nodeHeight = 62;

const commonNodeStyle = {
  rx: 5,
  ry: 5,
  bgType: 'bg' as const,
  strokeColor: 'none',
};

const nodes = [
  { label: '算力卡切分', x: 100, y: 100, bgColor: '#509863', tooltipText: '按模板或动态切分' },
  { label: 'Cluster/Node Management', x: 100, y: 240, bgColor: '#509863', tooltipText: '将节点、卡资源进行分组管理' },
  { label: '资源规格', x: 400, y: 100, bgColor: '#509863', tooltipText: '组成固定规格便于下游使用' },
  { label: '资源组管理', x: 400, y: 240, bgColor: '#509863', tooltipText: '对节点、卡资源进行分组管理' },
  { label: '租户管理', x: 600, y: 240, bgColor: '#509863', tooltipText: '租户和资源组关联' },
  { label: '工作空间', x: 800, y: 170, bgColor: '#5079c7', tooltipText: '空间和租户关联' },
  { label: '资源使用', x: 1000, y: 170, bgColor: '#5079c7', tooltipText: '运行任务或部署实例' },
].map(d => Object.assign(d, commonNodeStyle));

const edges = [
  {
    points: [
      [100 + nodeWidth / 2, 100],
      [400 - nodeWidth / 2, 100],
    ],
  },
  {
    type: 'poly' as const,
    points: [
      [400 + nodeWidth / 2, 100],
      [800 - nodeWidth / 2, 170],
    ],
    poly: {
      direction: 'reverse' as const,
      intersectionPointX: 700,
    },
  },
  {
    type: 'poly' as const,
    points: [
      [600 + nodeWidth / 2, 240],
      [800 - nodeWidth / 2, 170],
    ],
    poly: {
      direction: 'reverse' as const,
    },
  },
  {
    points: [
      [100, 240 - nodeHeight / 2],
      [100, 100 + nodeHeight / 2],
    ],
  },
  {
    points: [
      [100 + nodeWidth / 2, 240],
      [400 - nodeWidth / 2, 240],
    ],
  },
  {
    points: [
      [400 + nodeWidth / 2, 240],
      [600 - nodeWidth / 2, 240],
    ],
  },
  {
    points: [
      [800 + nodeWidth / 2, 170],
      [1000 - nodeWidth / 2, 170],
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
    <ChartWrapper title="资源管理流程图" description="算力卡切分到资源使用的完整流程" height={350}>
      <div ref={ref} style={{ width: 1200, height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default FlowChart;
