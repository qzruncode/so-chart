import { bench, describe, afterAll } from 'vitest';
import { createContainer } from '../../__bench__/utils';
import { generateBarData } from '../../__bench__/data';
import getBarChart from '../src/index';

describe('BarChart', () => {
  const { container, cleanup } = createContainer();
  const options = generateBarData(50);
  const largeOptions = generateBarData(500);

  bench('create', () => {
    const chart = getBarChart({ container, chartType: 'bar' });
    chart.dispose();
  });

  bench('setOption', () => {
    const chart = getBarChart({ container, chartType: 'bar' });
    chart.setOption(options);
    chart.dispose();
  });

  bench('setOption (large)', () => {
    const chart = getBarChart({ container, chartType: 'bar' });
    chart.setOption(largeOptions);
    chart.dispose();
  });

  // Note: render() requires SVG path methods (getTotalLength) not available in jsdom.
  // Full render benchmarking requires browser environment (playwright).

  afterAll(() => cleanup());
});
