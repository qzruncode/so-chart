import type { LineOptions } from '@so-chart/types/line';
import type { BarOptions } from '@so-chart/types/bar';
import type { PieOptions } from '@so-chart/types/pie';
import type { RadarOptions } from '@so-chart/types/radar';
import type { PointOptions } from '@so-chart/types/point';
import type { CalendarHeatmapOptions } from '@so-chart/types/calendar';
import type { SliderOptions, ProgressOptions } from '@so-chart/types/progress';
import type { DataflowOptions } from '@so-chart/types/sankey';
import type { DagreTreeOptions, DagreTreeDataset, FlowOptions } from '@so-chart/types/tree';
import type { GuageOptions, SingleGuageOptions } from '@so-chart/types/guage';

/**
 * 伪随机数生成器，保证结果可复现
 */
function createSeededRandom(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * 生成折线图测试数据
 */
export function generateLineData(count = 100): LineOptions {
  const rand = createSeededRandom();
  return {
    xAxis: {
      type: 'value',
      data: Array.from({ length: count }, (_, i) => i),
    },
    yAxis: {
      type: 'value',
      data: { start: 0, end: 1000 },
    },
    datasets: [
      {
        label: 'Series A',
        data: Array.from({ length: count }, () => rand() * 1000),
      },
      {
        label: 'Series B',
        data: Array.from({ length: count }, () => rand() * 1000),
      },
    ],
    animate: { switch: 'off' },
  };
}

/**
 * 生成柱状图测试数据
 */
export function generateBarData(count = 50): BarOptions {
  const rand = createSeededRandom(100);
  return {
    xAxis: {
      type: 'category',
      data: Array.from({ length: count }, (_, i) => `Item ${i}`),
    },
    yAxis: {
      type: 'value',
      data: { start: 0, end: 1000 },
    },
    datasets: [
      {
        label: 'Category A',
        data: Array.from({ length: count }, () => rand() * 1000),
      },
      {
        label: 'Category B',
        data: Array.from({ length: count }, () => rand() * 1000),
      },
    ],
    animate: { switch: 'off' },
  };
}

/**
 * 生成饼图测试数据
 */
export function generatePieData(count = 10): PieOptions {
  const rand = createSeededRandom(200);
  return {
    datasets: Array.from({ length: count }, (_, i) => ({
      label: `Slice ${i}`,
      data: rand() * 100,
    })),
    animate: { switch: 'off' },
  };
}

/**
 * 生成雷达图测试数据
 */
export function generateRadarData(dimension = 6): RadarOptions {
  const rand = createSeededRandom(300);
  const labels = Array.from({ length: dimension }, (_, i) => `Dim ${i}`);
  return {
    xAxis: {
      type: 'category',
      data: labels,
    },
    yAxis: {
      type: 'value',
      data: { start: 0, end: 100 },
    },
    radius: 150,
    datasets: [
      {
        label: 'Team A',
        data: Array.from({ length: dimension }, () => rand() * 100),
      },
      {
        label: 'Team B',
        data: Array.from({ length: dimension }, () => rand() * 100),
      },
    ],
    animate: { switch: 'off' },
  };
}

/**
 * 生成散点图测试数据
 */
export function generatePointData(count = 500): PointOptions {
  const rand = createSeededRandom(400);
  return {
    xAxis: {
      type: 'value',
      data: { start: 0, end: 100 },
    },
    yAxis: {
      type: 'value',
      data: { start: 0, end: 100 },
    },
    datasets: [
      {
        label: 'Points',
        data: Array.from({ length: count }, () => rand() * 100),
      },
    ],
    animate: { switch: 'off' },
  };
}

/**
 * 生成日历热力图测试数据
 */
export function generateCalendarData(months = 3): CalendarHeatmapOptions {
  const rand = createSeededRandom(500);
  const datasets: CalendarHeatmapOptions['datasets'] = [];
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, months, 0);
  const current = new Date(startDate);
  while (current <= endDate) {
    datasets.push({
      date: new Date(current),
      data: Math.floor(rand() * 100),
    });
    current.setDate(current.getDate() + 1);
  }
  return {
    rangeData: { start: startDate, end: endDate },
    datasets,
  };
}

/**
 * 生成进度条测试数据
 */
export function generateSliderData(): SliderOptions {
  return {
    data: {
      start: 0,
      value: 60,
      end: 100,
    },
    animate: { switch: 'off' },
  };
}

/**
 * 生成环形进度条测试数据
 */
export function generateProgressData(): ProgressOptions {
  return {
    data: {
      start: 0,
      value: 75,
      end: 100,
    },
    animate: { switch: 'off' },
  };
}

/**
 * 生成桑基图测试数据
 */
export function generateSankeyData(nodeCount = 10, linkCount = 15): DataflowOptions {
  const rand = createSeededRandom(600);
  return {
    style: { nodeWidth: 20, nodePadding: 20 },
    datasets: {
      nodes: Array.from({ length: nodeCount }, (_, i) => ({
        name: `Node ${i}`,
        color: `#${Math.floor(rand() * 16777215)
          .toString(16)
          .padStart(6, '0')}`,
      })),
      links: Array.from({ length: linkCount }, (_, i) => ({
        source: i % nodeCount,
        target: (i + 1) % nodeCount,
        value: Math.floor(rand() * 100),
      })),
    },
    animate: { switch: 'off' },
  };
}

/**
 * 生成 Dagre 树形图测试数据
 */
export function generateDagreData(nodeCount = 10): DagreTreeOptions {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    html: `Node ${i}`,
    width: 100,
    height: 40,
  }));
  const edges: DagreTreeDataset['edges'] = [];
  for (let i = 1; i < nodeCount; i++) {
    const parentIndex = Math.floor((i - 1) / 2);
    edges.push({ source: `node-${parentIndex}`, target: `node-${i}` });
  }
  return {
    datasets: { nodes, edges },
  };
}

/**
 * 生成 Flow 流程图测试数据
 */
export function generateFlowData(nodeCount = 8): FlowOptions {
  return {
    nodeWidth: 160,
    nodeHeight: 50,
    datasets: {
      nodes: Array.from({ length: nodeCount }, (_, i) => ({
        label: `Step ${i}`,
        x: 50 + (i % 4) * 200,
        y: 50 + Math.floor(i / 4) * 100,
        fontColor: '#333',
        bgColor: '#f0f0f0',
        strokeColor: '#1976d2',
      })),
      edges: Array.from({ length: nodeCount - 1 }, (_, i) => ({
        type: 'straight' as const,
        endType: 'arrow' as const,
        points: [
          [50 + (i % 4) * 200 + 160, 50 + Math.floor(i / 4) * 100 + 25],
          [50 + ((i + 1) % 4) * 200, 50 + Math.floor((i + 1) / 4) * 100 + 25],
        ],
      })),
    },
  };
}

/**
 * 生成仪表盘测试数据
 */
export function generateGuageData(): GuageOptions {
  return {
    value: 72,
    datasets: [
      { data: 30, backgroundColor: '#5470c6' },
      { data: 30, backgroundColor: '#91cc75' },
    ],
    outerRadius: [50, 100],
    innerRadius: [110, 160],
    animate: { switch: 'off' },
  };
}

/**
 * 生成单仪表盘测试数据
 */
export function generateSingleGuageData(): SingleGuageOptions {
  return {
    value: 65,
    radius: [80, 120],
    animate: { switch: 'off' },
  };
}
