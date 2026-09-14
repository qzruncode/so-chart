import { bench, describe, afterAll } from 'vitest';
import { createContainer } from '../../__bench__/utils';
import getTreeChart from '../src/index';

describe('FlowChart', () => {
  const { container, cleanup } = createContainer();

  // Note: FlowChart.setOption involves heavy d3 SVG operations
  // (getTotalLength, foreignObject, etc.) not available in jsdom.
  // setOption benchmarking requires a real browser environment.
  bench('create', () => {
    const chart = getTreeChart({ container, chartType: 'flow' });
    chart.dispose();
  });

  afterAll(() => cleanup());
});
