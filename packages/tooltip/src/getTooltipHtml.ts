import styleClass from './tooltip.module.less';
import type { CommonChart, CommonExposedData } from './drawTooltip';
import type { EventName } from '@so-chart/types/common';
import { getStyle, StyleParams } from '@so-chart/utils';
import { escapeTooltipHtml } from './escapeHtml';

type Params = {
  chart: CommonChart;
  eventData: {
    position: number[];
    eventName?: EventName;
  };
  tooltipData: CommonExposedData[];
  xData?: string;
};

const getColor = (chartType: CommonChart['chartType'], dataset: CommonExposedData['data']) => {
  switch (chartType) {
    case 'line':
    case 'radar':
      return (dataset as { lineColor: string }).lineColor;
    case 'bar':
    case 'pie':
    case 'circleStackBar':
      return (dataset as { backgroundColor: string }).backgroundColor;
    case 'trend':
    case 'point':
    case 'scatter3d':
      return (dataset as { dotColor: string }).dotColor;
    default:
      break;
  }
};

export function getTooltipHtml(params: Params) {
  const { tooltipData, xData, chart } = params;
  const { tooltip } = chart;
  const extra = tooltip?.extra;

  const formateValue = (data: number | (number | null | undefined)[] | null | undefined, index: number) => {
    const value = Array.isArray(data) ? data[index] : data;
    if (chart.chartType === 'radar' && (value === null || value === undefined)) {
      return '—';
    }
    return value != undefined && tooltip ? tooltip.formatter(value) : value;
  };

  const tooltipItemClass = escapeTooltipHtml(styleClass.tooltipItem);
  const tooltipLabelClass = escapeTooltipHtml(styleClass.tooltipLabel);
  const tooltipExtraClass = escapeTooltipHtml(styleClass.tooltipExtra);
  const tooltipRootClass = escapeTooltipHtml(`tooltip ${styleClass.tooltip} ${styleClass.tooltip}_mh_${chart.chartId}`);

  const items = tooltipData.reduce((html, d, i) => {
    const value = formateValue(d.data.data, d?.index ?? 0);
    const tooltipDotClass = escapeTooltipHtml(`${styleClass.tooltipDot} ${styleClass.tooltipDot}_bg_${i}_${chart.chartId}`);
    const item = `<div class="${tooltipItemClass}">
      <span>
        <span class="${tooltipDotClass}" ></span>
        <span class="${tooltipLabelClass}"> <span>${escapeTooltipHtml(d.data.label)}</span>：<span>${escapeTooltipHtml(value)}</span></span>
      </span>
      ${extra?.text ? `<span index="${escapeTooltipHtml(i)}" class="${tooltipExtraClass}">${escapeTooltipHtml(extra.text)}</span>` : ''}
    </div>`;
    return html + item;
  }, '');
  return `
    <div class="${tooltipRootClass}">
      ${xData ? `<div class="${styleClass.tooltipTitle}">${escapeTooltipHtml(xData)}</div>` : ''}
      ${items}
    </div>
  `;
}

export function getDynamicStyleText(chart: CommonChart, tooltipData: CommonExposedData[]) {
  const { chartType, layout, scale } = chart;
  const params = [] as StyleParams;
  params.push({
    className: `${styleClass.tooltip}_mh_${chart.chartId}`,
    style: {
      'max-height': `${layout.height / scale}px`,
    },
  });

  tooltipData.forEach((d, i) => {
    const color = getColor(chartType, d.data);
    params.push({
      className: `${styleClass.tooltipDot}_bg_${i}_${chart.chartId}`,
      style: {
        'background-color': color,
      },
    });
  });

  return getStyle(params);
}
