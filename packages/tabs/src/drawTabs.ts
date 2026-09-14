import { select } from 'd3';
import type { CommonChart } from '.';
import { createTabs } from './Tabs';
import type { TabsController } from './Tabs';

const tabControllers = new WeakMap<SVGSVGElement, TabsController>();

export function drawTabs(chart: CommonChart) {
  const existingController = tabControllers.get(chart.svg);
  if (existingController) {
    existingController.update(chart);
    return existingController;
  }

  const tabs = select(chart.svg).append('g').attr('class', 'so-chart_tabs');
  const tabsContainer = tabs.append('foreignObject').attr('transform', `scale(${chart.scale})`);
  const content = document.createElement('div');
  tabsContainer.node()?.appendChild(content);

  const controller = createTabs(chart);
  content.appendChild(controller.element);
  tabControllers.set(chart.svg, controller);
  controller.update(chart);
  return controller;
}

export function destroyTabs(svg: SVGSVGElement) {
  const controller = tabControllers.get(svg);
  controller?.destroy();
  tabControllers.delete(svg);
  select(svg).select<SVGGElement>('g.so-chart_tabs').remove();
}
