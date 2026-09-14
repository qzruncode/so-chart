import type { BasePieChartInstance } from '@so-chart/types/pie';
import type { Layout } from '@so-chart/types/common';
import { applyChartLayout, getCanvas, getEase, getSvg, getUid, presentCanvasFrame, releaseCanvasFrame } from '@so-chart/utils';
import { setSize } from './size';
import setOption from './option';
import { registerEvent, unBindListener } from './listener';
import { destroyTabs } from '@so-chart/tabs';

function PieChart(this: BasePieChartInstance) {
  this.scale = Math.max(window.devicePixelRatio ?? 1, 2);

  this.init = (container: HTMLElement, layout?: Layout) => {
    this.chartId = getUid();
    this.canvas = getCanvas();
    this.svg = getSvg();
    this.container = container;
    this.layout = applyChartLayout({ layout });
    this.setLayout();
    container.appendChild(this.canvas);
    container.appendChild(this.svg);
  };

  this.setLayout = setSize.bind(this);
  this.setOption = setOption.bind(this);

  this.render = () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const chart = this;
    cancelAnimationFrame(chart.rid ?? 0);
    const { offscreenCanvas, canvas } = this;
    const animateOption = this.animate;
    if (animateOption.switch === 'off') {
      animateOption.draw();
      presentCanvasFrame(canvas, offscreenCanvas);
      chart.rid = undefined;
    } else {
      chart.rid = requestAnimationFrame(animate);
    }

    const { duration, ease } = animateOption;
    const easing = getEase(ease);
    let start: number;
    function animate(time: number) {
      if (start === undefined) {
        start = time;
      }
      const elapsed = time - start;
      const progress = elapsed / duration; // 计算动画进度
      const newProgress = Math.max(0, Math.min(1, easing(progress)));
      if (newProgress != undefined && newProgress <= 1) {
        animateOption.progress = newProgress;
        animateOption.draw();
        presentCanvasFrame(canvas, offscreenCanvas);
        if (newProgress < 1) {
          chart.rid = requestAnimationFrame(animate);
        } else {
          chart.rid = undefined;
        }
      } else {
        chart.rid = undefined;
      }
    }
  };

  this.dispose = () => {
    destroyTabs(this.svg);
    unBindListener(this.svg);
    this.resize = () => {};
    this.channel?.cleanup();
    this.eventChannel?.cleanup();
    releaseCanvasFrame(this.canvas);
    this.channel = undefined;
    this.eventChannel = undefined;
    this.listeners = undefined;
    cancelAnimationFrame(this.rid ?? 0);
  };

  this.on = registerEvent.bind(this);
}

export default PieChart as unknown as new () => BasePieChartInstance;
