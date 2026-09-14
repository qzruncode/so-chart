import type { ProgressInstance, SliderInstance } from '@so-chart/types/progress';
import { scaleLinear, select } from 'd3';

export function drawSlider(chart: SliderInstance) {
  const { layout, linearGradient, backgroundColor, rx, ry, data, slider, animate } = chart;
  const { width, height, left, right } = layout;
  const svg = select(chart.svg);
  let progress = svg.select<SVGGElement>('g.so-chart_progress');
  let progressRect = progress.select<SVGRectElement>('rect.progress_rect');
  let progressSlider = progress.select<SVGRectElement>('rect.progress_slider');
  const linear = scaleLinear([data.start, data.end], [left, width - right]);

  if (progress.empty()) {
    progress = svg.append('g').attr('class', 'so-chart_progress');
    progressRect = progress
      .append('rect')
      .attr('class', 'progress_rect')
      .attr('x', 0)
      .attr('y', 5)
      .attr('width', width)
      .attr('height', height - 10)
      .attr('rx', rx)
      .attr('ry', ry);
    progressSlider = progress
      .append('rect')
      .attr('class', 'progress_slider')
      .attr('stroke', '#B3B8C7')
      .attr('stroke-width', 1)
      .attr('fill', '#FFFFFF')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', slider.width)
      .attr('height', height)
      .attr('rx', slider.rx)
      .attr('ry', slider.ry);
    if (linearGradient) {
      const linearEle = progress.append('defs').append('linearGradient').attr('id', 'gradient');
      linearGradient.forEach(gradient => {
        linearEle.append('stop').attr('stop-color', gradient.stopColor).attr('stop-opacity', gradient.stopOpacity).attr('offset', gradient.offset);
      });
    }
  }

  if (!linearGradient) {
    progressRect.attr('fill', backgroundColor);
  } else {
    progressRect.attr('fill', 'url(#gradient)');
  }

  progressSlider.attr('x', linear(data.value) * animate.progress);
}

export function drawProgress(chart: ProgressInstance) {
  const { layout, backgroundColor, rx, ry, data, animate } = chart;
  const { width, height, left, right } = layout;
  const svg = select(chart.svg);
  let progress = svg.select<SVGGElement>('g.so-chart_progress');
  let progressValue = progress.select<SVGRectElement>('rect.progress_value');
  const linear = scaleLinear([data.start, data.end], [left, width - right]);

  if (progress.empty()) {
    progress = svg.append('g').attr('class', 'so-chart_progress');
    progress
      .append('rect')
      .attr('class', 'progress_rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('rx', rx)
      .attr('ry', ry);
    progressValue = progress
      .append('rect')
      .attr('class', 'progress_value')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', height)
      .attr('rx', rx)
      .attr('ry', ry);
  }

  progressValue.attr('fill', backgroundColor).attr('width', linear(data.value) * animate.progress);
}
