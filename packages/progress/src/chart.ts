import type { Layout } from '@so-chart/types/common';
import type { ProgressInstance, SliderInstance } from '@so-chart/types/progress';
import { applyChartLayoutWithoutScale, getEase, getSvg, getUid } from '@so-chart/utils';
import { setSize } from './size';
import setOption from './option';

function ProgressChart(this: SliderInstance | ProgressInstance) {
  this.init = (container: HTMLElement, layout?: Layout) => {
    this.chartId = getUid();
    this.svg = getSvg();
    this.container = container;
    this.layout = applyChartLayoutWithoutScale({ layout, commonLayout: { height: 50, top: 0, right: 0, bottom: 0, left: 0, width: 0 } });
    this.setLayout();
    container.appendChild(this.svg);
  };
  this.setLayout = setSize.bind(this);
  this.setOption = setOption.bind(this);
  this.render = () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const chart = this;
    cancelAnimationFrame(chart.rid ?? 0);
    const animateOption = this.animate;
    if (animateOption.switch === 'off') {
      animateOption.draw();
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
    this.resize = () => {};
    this.channel?.cleanup();
    cancelAnimationFrame(this.rid ?? 0);
  };
}

export default ProgressChart as unknown as new () => SliderInstance;
