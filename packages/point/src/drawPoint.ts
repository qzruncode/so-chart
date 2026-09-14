import type { PointChartInstance } from '@so-chart/types/point';

export function drawPoint(chart: PointChartInstance) {
  const { offscreenCanvas, datasets, xScaleFunc, yScaleFunc, xIntervalData, animate } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const showDatasets = datasets.filter(d => d.show === true);
    showDatasets.forEach(data => {
      data.data.forEach((d, i) => {
        if (d != null && !isNaN(d)) {
          context.beginPath();
          const x = xScaleFunc(xIntervalData[i]);
          const y = yScaleFunc(d);
          context.arc(x, y, data.dotSize * animate.progress, 0, Math.PI * 2);
          if (data.dotType === 'fill') {
            context.fillStyle = data.dotColor;
            context.fill();
          } else if (data.dotType === 'stroke') {
            context.lineWidth = data.lineWidth;
            context.strokeStyle = data.dotColor;
            context.stroke();
          }
        }
      });
    });
    context.restore();
  }
}
