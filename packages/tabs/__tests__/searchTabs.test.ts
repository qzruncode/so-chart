import { describe, expect, it, vi } from 'vitest';
import { destroyTabs, drawTabs } from '../src';
import type { CommonChart } from '../src';

function createChart(): CommonChart {
  return {
    chartId: 'search-tabs-test',
    scale: 1,
    svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    chartType: 'pie',
    datasets: [
      { show: true, backgroundColor: '#1677ff', data: 1 },
      { show: true, backgroundColor: '#52c41a', data: 2 },
    ],
    labels: {
      show: true,
      data: ['Sales', 'Support'],
      type: 'circle',
      path: '',
      orient: 'horizontal',
      position: 'bottom',
      dataMap: {},
      extraTextType: 'horizontal',
      extraTextColor: '#666',
      extraTextSize: 12,
      fontColor: '#666',
      fontSize: 12,
      maxHeight: 100,
    },
    layout: { width: 640, height: 270, top: 0, right: 0, bottom: 0, left: 0 },
    refreshPie: vi.fn(),
  };
}

describe('drawTabs', () => {
  it('reuses and destroys the native SVG tabs controller', () => {
    const chart = createChart();
    document.body.appendChild(chart.svg);

    const first = drawTabs(chart);
    const second = drawTabs(chart);
    expect(second).toBe(first);
    expect(chart.svg.querySelectorAll('g.so-chart_tabs')).toHaveLength(1);
    expect(chart.labels.resize).toEqual(expect.any(Function));

    destroyTabs(chart.svg);
    expect(chart.svg.querySelector('g.so-chart_tabs')).toBeNull();
    expect(chart.labels.resize).toBeUndefined();
  });

  it('only exposes arrows while horizontal scrolling is possible', () => {
    const chart = createChart();
    document.body.appendChild(chart.svg);

    const controller = drawTabs(chart);
    const tabs = controller.element.querySelector('div[class*="_tabs_"]') as HTMLDivElement;
    const [leftButton, rightButton] = Array.from(controller.element.querySelectorAll('button'));
    let scrollLeft = 0;

    Object.defineProperties(tabs, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 300 },
      scrollLeft: { configurable: true, get: () => scrollLeft },
    });

    const update = () => tabs.dispatchEvent(new Event('scroll'));

    update();
    expect(leftButton.dataset.hidden).toBe('true');
    expect(rightButton.dataset.hidden).toBe('false');

    scrollLeft = 100;
    update();
    expect(leftButton.dataset.hidden).toBe('false');
    expect(rightButton.dataset.hidden).toBe('false');

    scrollLeft = 200;
    update();
    expect(leftButton.dataset.hidden).toBe('false');
    expect(rightButton.dataset.hidden).toBe('true');

    Object.defineProperty(tabs, 'scrollWidth', { configurable: true, value: 100 });
    update();
    expect(leftButton.dataset.hidden).toBe('true');
    expect(rightButton.dataset.hidden).toBe('true');

    destroyTabs(chart.svg);
  });
});
