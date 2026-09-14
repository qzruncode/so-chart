import type { BasePointChartInstance } from '@so-chart/types/point';
import { getDomWidth } from '@so-chart/utils';

export function setSize(this: BasePointChartInstance) {
  const { scale, container, layout } = this;

  const width = getDomWidth(container);
  const scaleWidth = width * scale;
  const scaleHeight = layout.height;
  const height = scaleHeight / scale;

  this.canvas.width = scaleWidth;
  this.canvas.height = scaleHeight;
  this.canvas.style.width = width + 'px';
  this.canvas.style.height = height + 'px';

  this.svg.setAttribute('viewBox', `0 0 ${scaleWidth} ${scaleHeight}`);
  this.svg.style.width = width + 'px';
  this.svg.style.height = height + 'px';
  this.svg.setAttribute('width', `${width}`);
  this.svg.setAttribute('height', `${height}`);

  this.container.style.height = height + 'px';

  this.layout.width = scaleWidth;
  this.offscreenCanvas = new OffscreenCanvas(scaleWidth, scaleHeight);
}

export function setWidth(this: BasePointChartInstance) {
  const { container, scale, layout } = this;

  const width = getDomWidth(container);
  const scaleWidth = width * scale;
  const scaleHeight = layout.height;

  this.canvas.width = scaleWidth;
  this.canvas.style.width = width + 'px';

  this.svg.setAttribute('viewBox', `0 0 ${scaleWidth} ${scaleHeight}`);
  this.svg.setAttribute('width', `${width}`);
  this.svg.style.width = width + 'px';

  this.layout.width = scaleWidth;
  this.offscreenCanvas = new OffscreenCanvas(scaleWidth, scaleHeight);
}
