import { pointRadial } from 'd3';
import type { RadarInstance, RadarRegion } from '@so-chart/types/radar';

export function computeRadarRegions(chart: RadarInstance): RadarRegion[] {
  const { datasets, layout, xIntervalData, xScaleFunc, yScaleFunc } = chart;
  const centerX = layout.width / 2;
  const centerY = layout.height / 2;
  const regions: RadarRegion[] = [];

  datasets.forEach((dataset, datasetIndex) => {
    if (!dataset.show) {
      return;
    }

    const polygon = xIntervalData.map((axisLabel, index) => {
      const angle = xScaleFunc(axisLabel) ?? 0;
      const value = dataset.data[index];
      const radius = typeof value === 'number' && Number.isFinite(value) ? yScaleFunc(value) : 0;
      const [relativeX, relativeY] = pointRadial(angle, radius);
      return [centerX + relativeX, centerY + relativeY] as [number, number];
    });

    if (polygon.length >= 3) {
      regions.push({ datasetIndex, polygon, data: dataset });
    }
  });

  return regions;
}
