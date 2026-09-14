import { bench, describe, afterAll } from 'vitest';
import { createContainer } from '../../__bench__/utils';
import { generateSliderData } from '../../__bench__/data';
import getProgressChart from '../src/index';

describe('SliderChart', () => {
  const { container, cleanup } = createContainer();
  const options = generateSliderData();

  bench('create', () => {
    const chart = getProgressChart({ container, chartType: 'slider' });
    chart.dispose();
  });

  bench('setOption', () => {
    const chart = getProgressChart({ container, chartType: 'slider' });
    chart.setOption(options);
    chart.dispose();
  });

  afterAll(() => cleanup());
});
