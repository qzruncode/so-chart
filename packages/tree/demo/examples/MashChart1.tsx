import getTreeChart from '@so-chart/tree';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { useChartThemeVersion } from '../../../../src/demo/theme';

const nodes = [
  { type: 'rect' as const, label: 'External Datasources', x: 60, y: 80, bgColor: '#086DF4' },
  { type: 'rect' as const, label: '文件系统', x: 60, y: 160, bgColor: '#086DF4' },
  { type: 'rect' as const, label: '外部数据源', x: 60, y: 240, bgColor: '#086DF4' },
  {
    type: 'circularFlow' as const,
    label: '资产化',
    labelColor: 'red',
    x: 320,
    y: 160,
    bgType: 'bg' as const,
    width: 300,
    height: 300,
    circularFlow: {
      innerRadius: 50,
      outerRadius: 120,
      data: [
        { label: '人工校对\n审核', backgroundColor: '#086DF4', tooltipText: '支持人工编辑' },
        { label: '资产\n视图', backgroundColor: '#086DF4', tooltipText: '监听文件变更，用于自动化加工' },
        { label: '自动化\n解析', backgroundColor: '#086DF4', tooltipText: '解析策略可配置' },
        {
          label: '元数据\n纳管',
          backgroundColor: '#086DF4',
          tooltipText: '支持元数据扩展',
        },
      ],
    },
  },
  { type: 'rect' as const, label: '知识库创建', x: 560, y: 50, bgColor: '#05B9C5', tooltipText: '支持分库管理' },
  { type: 'rect' as const, label: '文件加工任务', x: 560, y: 160, bgColor: '#05B9C5', tooltipText: '任务流程灵活配置' },
  { type: 'rect' as const, label: '自动化加工', x: 560, y: 270, bgColor: '#05B9C5', tooltipText: '提升知识库更新效率' },
  { type: 'rect' as const, label: '加工结果审核', x: 730, y: 160, bgColor: '#05B9C5', tooltipText: '对加工结果进行审核' },
  { type: 'rect' as const, label: '知识入库', x: 910, y: 160, bgColor: '#05B9C5', tooltipText: '入库策略可配置' },
  { type: 'rect' as const, label: '发布服务', x: 1090, y: 160, bgColor: '#146fff', tooltipText: '将知识库发布为服务' },
  { type: 'rect' as const, label: '监控告警', x: 1090, y: 270, bgColor: '#146fff', tooltipText: '高效运维管理' },
  { type: 'rect' as const, label: '知识门户', x: 1290, y: 100, bgColor: '#146fff', tooltipText: '检索召回' },
  { type: 'rect' as const, label: '应用问答', x: 1290, y: 220, bgColor: '#146fff', tooltipText: '接入智能体' },
];

const edges = [
  {
    type: 'poly' as const,
    points: [
      [140, 80],
      [190, 160],
    ],
    poly: {
      direction: 'reverse' as const,
    },
  },
  {
    points: [
      [140, 160],
      [190, 160],
    ],
  },
  {
    type: 'poly' as const,
    points: [
      [140, 240],
      [190, 160],
    ],
    poly: {
      direction: 'reverse' as const,
    },
  },
  {
    points: [
      [450, 160],
      [490, 160],
    ],
  },
  {
    points: [
      [560, 85],
      [560, 125],
    ],
  },
  {
    points: [
      [560, 235],
      [560, 195],
    ],
  },
  {
    points: [
      [630, 160],
      [660, 160],
    ],
  },
  {
    points: [
      [800, 160],
      [840, 160],
    ],
  },
  {
    points: [
      [980, 160],
      [1020, 160],
    ],
  },
  {
    points: [
      [1090, 195],
      [1090, 235],
    ],
  },
  {
    type: 'poly' as const,
    points: [
      [1170, 160],
      [1210, 100],
    ],
  },
  {
    type: 'poly' as const,
    points: [
      [1170, 160],
      [1210, 220],
    ],
  },
];

function MashChart1() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const chart = getTreeChart({
        container,
        chartType: 'mash',
        layout: {
          height: 300,
        },
      });
      chart.setOption({
        datasets: { nodes, edges },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="知识资产流程图 (变体)" description="带资产化循环的知识库构建流程" height={300}>
      <div ref={ref} style={{ width: 1400, height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default MashChart1;
