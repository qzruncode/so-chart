import getTreeChart from '@so-chart/tree';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { useChartThemeVersion } from '../../../../src/demo/theme';

const nodes = [
  { type: 'rect' as const, label: '本地上传', x: 100, y: 50, bgColor: '#44d0e3' },
  { type: 'rect' as const, label: '文件系统', x: 100, y: 120, bgColor: '#44d0e3' },
  { type: 'rect' as const, label: '外部数据源', x: 100, y: 190, bgColor: '#44d0e3' },
  {
    type: 'circularFlow' as const,
    label: '资产化',
    x: 340,
    y: 120,
    bgType: 'bg' as const,
    width: 300,
    height: 300,
    circularFlow: {
      innerRadius: 50,
      outerRadius: 100,
      data: [
        {
          label: '元数据\n纳管',
          backgroundColor: '#146fff',
        },
        { label: '人工校对\n审核', backgroundColor: '#44d0e3' },
        { label: '资产\n视图', backgroundColor: '#44d1e2' },
        { label: '自动化\n解析', backgroundColor: '#36b2f9' },
      ],
    },
  },
  { type: 'rect' as const, label: '知识库创建', x: 100, y: 320, bgColor: '#146fff' },
  { type: 'rect' as const, label: '文件加工任务', x: 340, y: 320, bgColor: '#146fff' },
  { type: 'rect' as const, label: '中间结果审核', x: 480, y: 390, bgColor: '#146fff' },
  { type: 'rect' as const, label: '知识入库', x: 610, y: 460, bgColor: '#146fff' },
  { type: 'rect' as const, label: '发布部署', x: 740, y: 390, bgColor: '#146fff' },
  { type: 'rect' as const, label: '知识召回', x: 940, y: 340, bgColor: '#146fff' },
  { type: 'rect' as const, label: '接口调用', x: 940, y: 440, bgColor: '#146fff' },
  {
    type: 'circularFlow' as const,
    x: 1120,
    y: 390,
    bgType: 'bg' as const,
    width: 300,
    height: 300,
    circularFlow: {
      innerRadius: 50,
      outerRadius: 100,
      arrowHeight: 35,
      data: [
        {
          label: '监控',
          backgroundColor: '#146fff',
        },
        { label: '告警', backgroundColor: '#44d0e3' },
        { label: '记录', backgroundColor: '#44d1e2' },
      ],
    },
  },
];

const edges = [
  {
    type: 'poly' as const,
    points: [
      [180, 60],
      [230, 120],
    ],
    arrow: {
      color: '#146fff',
    },
    poly: {
      direction: 'reverse' as const,
    },
  },
  {
    points: [
      [180, 120],
      [230, 120],
    ],
    arrow: {
      color: '#146fff',
    },
  },
  {
    type: 'poly' as const,
    points: [
      [180, 180],
      [230, 120],
    ],
    arrow: {
      color: '#146fff',
    },
    poly: {
      direction: 'reverse' as const,
    },
  },
  {
    points: [
      [180, 320],
      [260, 320],
    ],
    arrow: {
      color: '#146fff',
    },
  },
  {
    points: [
      [340, 240],
      [340, 280],
    ],
    arrow: {
      color: '#146fff',
    },
  },
  {
    type: 'round' as const,
    points: [
      [340, 370],
      [400, 390],
    ],
    arrow: {
      color: '#146fff',
    },
  },
  {
    type: 'round' as const,
    points: [
      [480, 440],
      [540, 460],
    ],
    arrow: {
      color: '#146fff',
    },
  },
  {
    type: 'round' as const,
    points: [
      [680, 460],
      [740, 430],
    ],
    arrow: {
      color: '#146fff',
    },
  },
  {
    type: 'poly' as const,
    points: [
      [820, 390],
      [870, 340],
    ],
    arrow: {
      color: '#146fff',
    },
  },
  {
    type: 'poly' as const,
    points: [
      [820, 390],
      [870, 440],
    ],
    arrow: {
      color: '#146fff',
    },
  },
];

function MashChart() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const chart = getTreeChart({
        container,
        chartType: 'mash',
        layout: {
          height: 500,
        },
      });
      chart.setOption({
        datasets: { nodes, edges },
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="知识资产流程图" description="从数据源到知识入库的完整流程" height={500}>
      <div ref={ref} style={{ width: 1400, height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default MashChart;
