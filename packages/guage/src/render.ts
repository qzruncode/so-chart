import type {
  CircleGuageInstance,
  CircleGuageOptions,
  GuageInstance,
  GuageOptions,
  SingleGuageInstance,
  SingleGuageOptions,
} from '@so-chart/types/guage';
import { drawCircleGuage, drawGuage, drawSingleGuage } from './draw';
import { setWidth } from './size';
import { applyAnimate } from '@so-chart/utils';
import { applyCircleGuageChart, applyGuageChart, applySingleGuageChart } from './normal';

export function renderGuage(chart: GuageInstance, options: GuageOptions) {
  applyGuageChart(chart, options);
  chart.animate = applyAnimate(options.animate);

  chart.refreshGuage = () => {
    chart.render();
  };

  chart.resize = () => {
    setWidth.call(chart);
    if (chart.layout.width > 0) {
      chart.render();
    }
  };

  chart.animate.draw = () => {
    drawGuage(chart);
  };
}

export function renderSingleGuage(chart: SingleGuageInstance, options: SingleGuageOptions) {
  applySingleGuageChart(chart, options);
  chart.animate = applyAnimate(options.animate);

  chart.refreshGuage = () => {
    chart.render();
  };

  chart.resize = () => {
    setWidth.call(chart);
    if (chart.layout.width > 0) {
      chart.render();
    }
  };

  chart.animate.draw = () => {
    drawSingleGuage(chart);
  };
}

export function renderCircleGuage(chart: CircleGuageInstance, options: CircleGuageOptions) {
  applyCircleGuageChart(chart, options);
  chart.animate = applyAnimate(options.animate);

  chart.refreshGuage = () => {
    chart.render();
  };

  chart.resize = () => {
    setWidth.call(chart);
    if (chart.layout.width > 0) {
      chart.render();
    }
  };

  chart.animate.draw = () => {
    drawCircleGuage(chart);
  };
}
