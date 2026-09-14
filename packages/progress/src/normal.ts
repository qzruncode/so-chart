import { D, getColor } from '@so-chart/utils';
import type { ProgressInstance, ProgressOptions, SliderInstance, SliderOptions } from '@so-chart/types/progress';

export function applySliderChart(chart: SliderInstance, options: SliderOptions) {
  const { backgroudColor, linearGradient, data, rx, ry, slider } = options;
  const { cs } = chart;
  D<SliderInstance, 'backgroundColor'>(chart, 'backgroundColor', backgroudColor ?? getColor({ i: 0, cs }));
  D<SliderInstance, 'linearGradient'>(chart, 'linearGradient', linearGradient);
  D<SliderInstance, 'rx'>(chart, 'rx', rx ?? 5);
  D<SliderInstance, 'ry'>(chart, 'ry', ry ?? 5);

  chart.data = applyData(data);
  chart.slider = applySlider(slider);
}

export function applyProgressChart(chart: ProgressInstance, options: ProgressOptions) {
  const { backgroudColor, data, rx, ry } = options;
  const { cs } = chart;
  D<ProgressInstance, 'backgroundColor'>(chart, 'backgroundColor', backgroudColor ?? getColor({ i: 0, cs }));
  D<ProgressInstance, 'rx'>(chart, 'rx', rx ?? 5);
  D<ProgressInstance, 'ry'>(chart, 'ry', ry ?? 5);

  chart.data = applyData(data);
}

function applyData(data: SliderOptions['data']) {
  const nd = Object.assign({}, data) as Required<SliderOptions['data']>;
  D<Required<SliderOptions['data']>, 'value'>(nd, 'value', 0);
  D<Required<SliderOptions['data']>, 'start'>(nd, 'start', 0);
  D<Required<SliderOptions['data']>, 'end'>(nd, 'end', 100);
  return nd;
}

function applySlider(data: SliderOptions['slider']) {
  type Slider = NonNullable<Required<SliderOptions['slider']>>;
  const nd = Object.assign({}, data) as Slider;
  D<Slider, 'rx'>(nd, 'rx', 3);
  D<Slider, 'ry'>(nd, 'ry', 3);
  D<Slider, 'width'>(nd, 'width', 10);
  return nd;
}
