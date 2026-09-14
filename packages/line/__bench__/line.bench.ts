import { bench, describe, afterAll } from 'vitest';
import { createContainer } from '../../__bench__/utils';
import { generateLineData } from '../../__bench__/data';
import getLineChart from '../src/index';

describe('LineChart', () => {
  const { container, cleanup } = createContainer();
  const options = generateLineData(100);
  const largeOptions = generateLineData(1000);

  bench('create', () => {
    const chart = getLineChart({ container, chartType: 'line' });
    chart.dispose();
  });

  bench('setOption', () => {
    const chart = getLineChart({ container, chartType: 'line' });
    chart.setOption(options);
    chart.dispose();
  });

  bench('setOption (large)', () => {
    const chart = getLineChart({ container, chartType: 'line' });
    chart.setOption(largeOptions);
    chart.dispose();
  });

  // Note: render() requires SVG path methods (getTotalLength) not available in jsdom.
  // Full render benchmarking requires browser environment (playwright).
  // These benchmarks measure create + setOption (option parsing, scale setup, data normalization).

  afterAll(() => cleanup());
});
