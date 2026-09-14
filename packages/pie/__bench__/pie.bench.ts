import { bench, describe, afterAll } from 'vitest';
import { createContainer } from '../../__bench__/utils';
import { generatePieData } from '../../__bench__/data';
import getPieChart from '../src/index';

describe('PieChart', () => {
  const { container, cleanup } = createContainer();
  const options = generatePieData(10);
  const largeOptions = generatePieData(50);

  bench('create', () => {
    const chart = getPieChart({ container, chartType: 'pie' });
    chart.dispose();
  });

  bench('setOption', () => {
    const chart = getPieChart({ container, chartType: 'pie' });
    chart.setOption(options);
    chart.dispose();
  });

  bench('setOption (large)', () => {
    const chart = getPieChart({ container, chartType: 'pie' });
    chart.setOption(largeOptions);
    chart.dispose();
  });

  // Note: render() requires SVG path methods (getTotalLength) not available in jsdom.

  afterAll(() => cleanup());
});
