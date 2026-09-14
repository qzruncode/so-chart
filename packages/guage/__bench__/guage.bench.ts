import { bench, describe, afterAll } from 'vitest';
import { createContainer } from '../../__bench__/utils';
import type { SingleGuageOptions } from '@so-chart/types/guage';
import { generateGuageData, generateSingleGuageData } from '../../__bench__/data';
import getGuageChart from '../src/index';

describe('GuageChart', () => {
  const { container, cleanup } = createContainer();
  const options = generateGuageData();

  bench('create', () => {
    const chart = getGuageChart({ container, chartType: 'guage' });
    chart.dispose();
  });

  bench('setOption', () => {
    const chart = getGuageChart({ container, chartType: 'guage' });
    chart.setOption(options);
    chart.dispose();
  });

  afterAll(() => cleanup());
});

describe('SingleGuageChart', () => {
  const { container, cleanup } = createContainer();
  const options = generateSingleGuageData();
  const largeOptions: SingleGuageOptions = {
    value: 90,
    radius: [100, 180],
    animate: { switch: 'off' },
  };

  bench('create', () => {
    const chart = getGuageChart({ container, chartType: 'single' });
    chart.dispose();
  });

  bench('setOption', () => {
    const chart = getGuageChart({ container, chartType: 'single' });
    chart.setOption(options);
    chart.dispose();
  });

  bench('setOption (large)', () => {
    const chart = getGuageChart({ container, chartType: 'single' });
    chart.setOption(largeOptions);
    chart.dispose();
  });

  afterAll(() => cleanup());
});
