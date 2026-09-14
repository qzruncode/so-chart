import type { RadarInstance } from '@so-chart/types/radar';
import { curveLinearClosed, lineRadial, pointRadial } from 'd3';

export function drawRadar(chart: RadarInstance) {
  const { offscreenCanvas } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const { height, width } = chart.layout;
    const { datasets, xScaleFunc, xIntervalData, yScaleFunc, animate } = chart;
    const viewboxCenter_x = width / 2;
    const viewboxCenter_y = height / 2;
    const showDatasets = datasets.filter(d => d.show === true);
    showDatasets.forEach(d => {
      const lineRadialInstance = lineRadial<number | undefined>();
      const getAngle = (_d: number | undefined, i: number) => xScaleFunc(xIntervalData[i]) ?? 0;
      const getRadius = (d: number | undefined) => (d != null && !isNaN(d) ? yScaleFunc(d) : 0) * animate.progress;
      lineRadialInstance.angle(getAngle);
      lineRadialInstance.radius(getRadius);
      lineRadialInstance.curve(curveLinearClosed);
      const path = lineRadialInstance(d.data as (number | undefined)[]);

      const { lineWidth, lineColor, backgroundColor } = d;
      if (typeof path === 'string') {
        const path2D = new Path2D(path);
        context.save();
        context.translate(viewboxCenter_x, viewboxCenter_y);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        context.fillStyle = backgroundColor;
        context.stroke(path2D);
        context.fill(path2D);
        context.restore();
      }

      // 绘制拐角点。点仅作为视觉元素，hover 命中使用整个数据区域。
      context.save();
      context.translate(viewboxCenter_x, viewboxCenter_y);
      d.data.forEach((d, i) => {
        context.fillStyle = lineColor;
        context.beginPath();
        const [x, y] = pointRadial(getAngle(d ?? 0, i), getRadius(d ?? 0));
        context.arc(x, y, lineWidth, 0, Math.PI * 2);
        context.fill();
      });
      context.restore();
    });
  }
}
