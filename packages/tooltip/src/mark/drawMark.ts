import { ScaleBand, scaleTime, select } from 'd3';
import { CommonChart } from './hoverMark';

export function drawMark(chart: CommonChart) {
  const { mark, yScaleFunc, layout } = chart;
  const { width, height, bottom, top, left, right } = layout;

  const xScaleFunc = getLinearXScaleFunc(chart) as Exclude<ReturnType<typeof getLinearXScaleFunc>, ScaleBand<string>>;

  if (mark.length > 0) {
    const svg = select(chart.svg);

    let markGroup = svg.select<SVGGElement>('g.so-chart_mark');
    let xMarkGroup = svg.select<SVGGElement>('g.so-chart_mark_x');
    let yMarkGroup = svg.select<SVGGElement>('g.so-chart_mark_y');
    let pointMarkGroup = svg.select<SVGGElement>('g.so-chart_mark_point');
    if (markGroup.empty()) {
      markGroup = svg.insert('g', 'g.so-chart_tooltip').attr('class', 'so-chart_mark');
      xMarkGroup = markGroup.append('g').attr('class', 'so-chart_mark_x');
      yMarkGroup = markGroup.append('g').attr('class', 'so-chart_mark_y');
      pointMarkGroup = markGroup.append('g').attr('class', 'so-chart_mark_point');
      const tooltipMarkGroup = markGroup.append('g').attr('class', 'so-chart_mark_tooltip');
      tooltipMarkGroup.append('foreignObject');
    }

    xMarkGroup.selectAll('line').remove();
    yMarkGroup.selectAll('line').remove();
    pointMarkGroup.selectAll('circle').remove();
    mark.forEach((d, i) => {
      if (d.type === 'line') {
        if ('x' in d) {
          const xLine = xMarkGroup.append('line').attr('class', `so-chart_mark_x_line_${i}`);
          const x = xScaleFunc(d.x);
          xLine
            .attr('stroke', d.lineColor)
            .attr('stroke-width', d.lineWidth)
            .attr('stroke-dasharray', d.lineDash.join(','))
            .attr('x1', x)
            .attr('y1', top)
            .attr('x2', x)
            .attr('y2', height - bottom);
          if (d.click) {
            xLine.on('click', d.click).style('cursor', 'pointer');
          }
        } else if ('y' in d) {
          const yLine = yMarkGroup.append('line').attr('class', `so-chart_mark_y_line_${i}`);
          const y = yScaleFunc(d.y);
          yLine
            .attr('stroke', d.lineColor)
            .attr('stroke-width', d.lineWidth)
            .attr('stroke-dasharray', d.lineDash.join(','))
            .attr('x1', left)
            .attr('y1', y)
            .attr('x2', width - right)
            .attr('y2', y);
          if (d.click) {
            yLine.on('click', d.click).style('cursor', 'pointer');
          }
        }
      } else if (d.type === 'point') {
        const point = pointMarkGroup.append('circle').attr('class', `so-chart_mark_point_dot_${i}`);
        point.attr('cx', xScaleFunc(d.x)).attr('cy', yScaleFunc(d.y)).attr('r', d.dotSize);
        if (d.click) {
          point.on('click', d.click).style('cursor', 'pointer');
        }
        if (d.dotType === 'fill') {
          point.attr('fill', d.dotColor);
        } else {
          point.attr('stoke', d.dotColor);
        }
      }
    });
  }
}

function isValidDate(value: string) {
  const date = new Date(value);
  return date.toString() !== 'Invalid Date';
}

export function getLinearXScaleFunc(chart: CommonChart) {
  const { xAxis } = chart;
  const range = chart.xScaleFunc.range() as [number, number];
  if (xAxis.type === 'mapping' || xAxis.type === 'category') {
    const xData = xAxis.data as string[];
    const start = xData[0];
    const end = xData[xData.length - 1];
    if (isValidDate(start) && isValidDate(end)) {
      const scaleFunc = scaleTime();
      scaleFunc.domain([new Date(start), new Date(end)]);
      scaleFunc.range(range);
      scaleFunc.nice();
      return scaleFunc;
    }
  }
  return chart.xScaleFunc;
}
