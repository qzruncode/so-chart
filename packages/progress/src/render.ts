import type { ProgressInstance, SliderInstance, SliderOptions } from '@so-chart/types/progress';
import { applyProgressChart, applySliderChart } from './normal';
import { drawProgress, drawSlider } from './draw';
import { setWidth } from './size';
import { applyAnimate } from '@so-chart/utils';

export function renderSlider(chart: SliderInstance, options: SliderOptions) {
  const { animate } = options;
  applySliderChart(chart, options);
  chart.animate = applyAnimate(animate);
  chart.resize = () => {
    setWidth.call(chart);
    chart.render();
  };
  chart.animate.draw = () => {
    drawSlider(chart);
  };
}

export function renderProgress(chart: ProgressInstance, options: SliderOptions) {
  const { animate } = options;
  applyProgressChart(chart, options);
  chart.animate = applyAnimate(animate);
  chart.resize = () => {
    setWidth.call(chart);
    if (chart.layout.width > 0) {
      chart.render();
    }
  };
  chart.animate.draw = () => {
    drawProgress(chart);
  };
}
