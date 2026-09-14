import { bench, describe, afterAll } from 'vitest';
import { createContainer } from '../../__bench__/utils';
import { generatePointData } from '../../__bench__/data';
import getPointChart from '../src/index';

describe('PointChart', () => {
  const { container, cleanup } = createContainer();
  const options = generatePointData(500);
  const largeOptions = generatePointData(2000);

  bench('create', () => {
    const chart = getPointChart({ container, chartType: 'point' });
    chart.dispose();
  });

  bench('setOption', () => {
    const chart = getPointChart({ container, chartType: 'point' });
    chart.setOption(options);
    chart.dispose();
  });

  bench('setOption (large)', () => {
    const chart = getPointChart({ container, chartType: 'point' });
    chart.setOption(largeOptions);
    chart.dispose();
  });

  // Note: render() requires SVG path methods (getTotalLength) not available in jsdom.

  afterAll(() => cleanup());
});
