import { bench, describe, afterAll } from 'vitest';
import { createContainer } from '../../__bench__/utils';
import { generateRadarData } from '../../__bench__/data';
import getRadarChart from '../src/index';

describe('RadarChart', () => {
  const { container, cleanup } = createContainer();
  const options = generateRadarData(6);
  const largeOptions = generateRadarData(20);

  bench('create', () => {
    const chart = getRadarChart({ container, chartType: 'radar' });
    chart.dispose();
  });

  bench('setOption', () => {
    const chart = getRadarChart({ container, chartType: 'radar' });
    chart.setOption(options);
    chart.dispose();
  });

  bench('setOption (large)', () => {
    const chart = getRadarChart({ container, chartType: 'radar' });
    chart.setOption(largeOptions);
    chart.dispose();
  });

  // Note: render() requires SVG path methods (getTotalLength) not available in jsdom.

  afterAll(() => cleanup());
});
