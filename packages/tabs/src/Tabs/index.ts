import type { LabelsOptions } from '@so-chart/types/common';
import { getStyle } from '@so-chart/utils';
import type { CommonChart } from '..';
import styleClass from './tabs.module.less';
import styleText from './tabs.module.less?inline';
import { getTipsColor, handleTabClick } from './utils';
import type { LabelData } from './utils';

type TabsLabelData = LabelData & {
  data: string;
};

const SCROLL_BUTTON_WIDTH = 20;
const SCROLL_EPSILON = 1;

export type TabsController = {
  element: HTMLDivElement;
  update: (chart: CommonChart) => void;
  destroy: () => void;
};

export function createTabs(chart: CommonChart): TabsController {
  const root = document.createElement('div');
  root.className = styleClass.scrollWrapper;

  const staticStyle = appendStyle(root, styleText, chart.nonce);
  const dynamicStyle = appendStyle(root, '', chart.nonce);
  const leftButton = createScrollButton('left');
  const tabs = document.createElement('div');
  tabs.className = styleClass.tabs;
  const rightButton = createScrollButton('right');
  root.append(leftButton, tabs, rightButton);

  let currentChart = chart;
  let currentLabels = chart.labels;
  let labelData = createLabelData(chart.labels.data);
  let chooseIndex: number | undefined;
  let range = chart.yAxis?.data;
  let destroyed = false;

  const updateScrollButtons = () => {
    if (destroyed) return;

    const clientWidth = tabs.clientWidth;
    const maxScrollLeft = Math.max(0, tabs.scrollWidth - clientWidth);
    const scrollLeft = Math.min(Math.max(tabs.scrollLeft, 0), maxScrollLeft);
    const canScroll = clientWidth > 0 && maxScrollLeft > SCROLL_EPSILON;

    setScrollButtonHidden(leftButton, !canScroll || scrollLeft <= SCROLL_EPSILON);
    setScrollButtonHidden(rightButton, !canScroll || scrollLeft >= maxScrollLeft - SCROLL_EPSILON);
  };

  const resizeLabels = () => {
    if (!destroyed) {
      handleStyle(currentChart, tabs, currentChart.labels);
      updateScrollButtons();
    }
  };

  const handleFootClick = (index: number) => {
    const result = handleTabClick({
      labelData,
      chart: currentChart,
      currentIndex: index,
      chooseIndex,
      range,
    });
    labelData = result.labelData;
    chooseIndex = result.chooseIndex;
    renderItems();
  };

  const renderItems = () => {
    const scrollLeft = tabs.scrollLeft;
    tabs.replaceChildren();
    labelData.forEach((label, index) => {
      if (label.data === '') return;

      const item = document.createElement('div');
      item.className = `${styleClass.footItem} ${label.show ? styleClass.choosed : styleClass.noChoose}`;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-pressed', String(label.show));
      item.addEventListener('click', () => handleFootClick(index));
      item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleFootClick(index);
        }
      });
      appendLabelContent(item, label.data, index, currentChart);
      tabs.appendChild(item);
    });
    resizeLabels();
    tabs.scrollLeft = Math.min(scrollLeft, Math.max(0, tabs.scrollWidth - tabs.clientWidth));
    updateScrollButtons();
  };

  const scrollBy = (amount: number) => {
    tabs.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateScrollButtons);
  observer?.observe(tabs);
  tabs.addEventListener('scroll', updateScrollButtons, { passive: true });
  window.addEventListener('resize', updateScrollButtons);
  leftButton.addEventListener('click', () => scrollBy(-300));
  rightButton.addEventListener('click', () => scrollBy(300));

  const update = (nextChart: CommonChart) => {
    if (destroyed) return;

    const labelsChanged = currentChart !== nextChart || currentLabels !== nextChart.labels;
    if (currentLabels.resize === resizeLabels) {
      currentLabels.resize = undefined;
    }
    currentChart = nextChart;
    currentLabels = nextChart.labels;
    currentLabels.resize = resizeLabels;
    if (labelsChanged) {
      labelData = createLabelData(nextChart.labels.data);
      chooseIndex = undefined;
      range = nextChart.yAxis?.data;
    }
    staticStyle.setAttribute('nonce', nextChart.nonce ?? '');
    dynamicStyle.setAttribute('nonce', nextChart.nonce ?? '');
    dynamicStyle.textContent = createDynamicStyleText(currentChart, labelData);
    renderItems();
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    observer?.disconnect();
    tabs.removeEventListener('scroll', updateScrollButtons);
    window.removeEventListener('resize', updateScrollButtons);
    if (currentLabels.resize === resizeLabels) {
      currentLabels.resize = undefined;
    }
    root.replaceChildren();
  };

  currentLabels.resize = resizeLabels;
  dynamicStyle.textContent = createDynamicStyleText(currentChart, labelData);
  renderItems();

  return { element: root, update, destroy };
}

function createLabelData(data: string[]): TabsLabelData[] {
  return data.map(label => ({ data: label, show: true }));
}

function appendLabelContent(item: HTMLDivElement, data: string, index: number, chart: CommonChart) {
  const labels = chart.labels;
  const dot = createDot(labels, index, chart);
  const label = document.createElement('span');
  label.className = `${styleClass.footLabel} ${styleClass.footLabel}_fc_${chart.chartId}`;
  label.textContent = data;

  if (labels.extraTextType === 'vertical') {
    const primary = document.createElement('div');
    primary.append(dot, label);
    const extra = document.createElement('div');
    extra.className = `${styleClass.labelsMap}_${chart.chartId}`;
    const extraText = document.createElement('span');
    extraText.textContent = labels.dataMap[data] ?? '';
    extra.appendChild(extraText);
    item.append(primary, extra);
    return;
  }

  item.append(dot, label);
  const extra = document.createElement('span');
  extra.className = `${styleClass.footLabelExtra} ${styleClass.footLabel}_extraText_${chart.chartId}`;
  extra.textContent = labels.dataMap[data] ?? '';
  item.appendChild(extra);
}

function createDot(labels: Required<LabelsOptions>, index: number, chart: CommonChart) {
  if (labels.type === 'path' && labels.path !== '') {
    const dot = document.createElement('span');
    dot.className = `${styleClass.size} ${styleClass.size}_color_${index}_${chart.chartId}`;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('viewBox', '0 0 10 10');
    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', labels.path);
    svg.appendChild(path);
    dot.appendChild(svg);
    return dot;
  }

  const type = labels.type === 'path' ? 'circle' : labels.type;
  const dot = document.createElement('span');
  dot.className = `${styleClass[type]} ${styleClass[type]}_bg_${index}_${chart.chartId}`;
  return dot;
}

function createDynamicStyleText(chart: CommonChart, labelData: TabsLabelData[]) {
  const labels = chart.labels;
  const params = [
    {
      className: `${styleClass.footLabel}_fc_${chart.chartId}`,
      style: {
        'font-size': `${labels.fontSize}px`,
        color: labels.fontColor,
      },
    },
    {
      className: `${styleClass.footLabel}_extraText_${chart.chartId}`,
      style: {
        'font-size': `${labels.extraTextSize}px`,
        color: labels.extraTextColor,
      },
    },
    {
      className: `${styleClass.labelsMap}_${chart.chartId} > span`,
      style: {
        'font-size': `${labels.extraTextSize}px`,
        color: labels.extraTextColor,
      },
    },
    {
      className: `${styleClass.footLabel}_f_${chart.chartId}`,
      style: {
        'font-size': `${labels.fontSize}px`,
      },
    },
  ] as Parameters<typeof getStyle>[0];

  labelData.forEach((_, index) => {
    const color = getTipsColor(chart, index);
    params.push({
      className: `${styleClass.size}_color_${index}_${chart.chartId}`,
      style: { color },
    });
    if (labels.type !== 'path') {
      params.push({
        className: `${styleClass[labels.type]}_bg_${index}_${chart.chartId}`,
        style: { 'background-color': color },
      });
    }
  });
  return getStyle(params).join('');
}

function createScrollButton(direction: 'left' | 'right') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = styleClass.triangle;
  button.dataset.direction = direction;
  button.setAttribute('aria-label', direction === 'left' ? '向左滚动标签' : '向右滚动标签');
  button.title = direction === 'left' ? '向左滚动标签' : '向右滚动标签';
  setScrollButtonHidden(button, true);
  return button;
}

function setScrollButtonHidden(button: HTMLButtonElement, hidden: boolean) {
  button.dataset.hidden = String(hidden);
  button.setAttribute('aria-hidden', String(hidden));
  button.tabIndex = hidden ? -1 : 0;
}

function appendStyle(parent: HTMLElement, text: string, nonce?: string) {
  const style = document.createElement('style');
  style.textContent = text;
  style.setAttribute('nonce', nonce ?? '');
  parent.appendChild(style);
  return style;
}

function handleStyle(chart: CommonChart, dom: HTMLDivElement, labels: Required<LabelsOptions>) {
  const { svg, layout, scale } = chart;
  const { position, orient, maxHeight } = labels;
  const { width, height } = layout;
  const availableWidth = Math.max(0, width / scale - SCROLL_BUTTON_WIDTH * 2);
  dom.style.maxWidth = `${availableWidth}px`;
  dom.style.maxHeight = `${maxHeight}px`;
  dom.style.flexDirection = orient === 'vertical' ? 'column' : 'row';
  dom.style.width = orient === 'flex' ? `${availableWidth}px` : '';
  dom.style.flexWrap = orient === 'flex' ? 'wrap' : '';
  if (orient === 'flex') {
    dom.querySelectorAll(':scope > div').forEach(item => {
      (item as HTMLElement).style.marginBottom = '8px';
    });
  }

  const domContent = dom.parentElement;
  if (!domContent) return;
  domContent.classList.add(styleClass.tabsContainer);
  const tooltipWidth = domContent.offsetWidth * scale;
  const tooltipHeight = domContent.offsetHeight * scale;
  const tabs = svg.querySelector<SVGGElement>('g.so-chart_tabs');
  const tabsContainer = tabs?.querySelector<SVGForeignObjectElement>('foreignObject');
  if (!tabs || !tabsContainer) return;

  tabsContainer.setAttribute('width', String(domContent.offsetWidth));
  tabsContainer.setAttribute('height', String(domContent.offsetHeight));

  let transform: string;
  switch (position) {
    case 'top':
      transform = `translate(calc(50% - ${tooltipWidth / 2}px), 0)`;
      break;
    case 'left':
      transform = `translate(0, calc(50% - ${tooltipHeight / 2}px))`;
      break;
    case 'right':
      transform = `translate(${width - tooltipWidth}px, calc(50% - ${tooltipHeight / 2}px))`;
      break;
    case 'topLeft':
      transform = 'translate(0, 0)';
      break;
    case 'topRight':
      transform = `translate(${width - tooltipWidth}px, 0)`;
      break;
    case 'bottomLeft':
      transform = `translate(0, ${height - tooltipHeight}px)`;
      break;
    case 'bottomRight':
      transform = `translate(${width - tooltipWidth}px, ${height - tooltipHeight}px)`;
      break;
    case 'bottom':
    default:
      transform = `translate(calc(50% - ${tooltipWidth / 2}px), ${height - tooltipHeight}px)`;
      break;
  }
  tabs.style.transform = transform;
}
