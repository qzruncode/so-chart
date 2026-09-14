import type { BarChartType, BarDataset, BaseBarChartInstance, Listeners } from '@so-chart/types/bar';
import type { ClickEventName, EventName, MouseEventName } from '@so-chart/types/common';
import { pointer, select } from 'd3';
import { hoverTooltip } from './tooltip/hoverTooltip';
import { hoverBarMark } from './tooltip/hoverBarMark';
import { createFrameCoalescer, createMessageChannel } from '@so-chart/utils';

export type MessageData = {
  event: MouseEvent | PointerEvent;
  position: [number, number];
  eventName: EventName;
};

export type ExposedData = {
  x: number;
  y: number;
  index: number;
  data: BarDataset;
};

export function bindListener(chart: BaseBarChartInstance & { chartType: BarChartType }) {
  const { svg } = chart;
  if (chart.eventChannel) return;

  const channel = createMessageChannel();
  const moveCoalescer = createFrameCoalescer<Pick<MessageData, 'position' | 'eventName'>>(message => channel.port2.postMessage(message));
  const cleanupChannel = channel.cleanup;
  channel.cleanup = () => {
    moveCoalescer.cleanup();
    cleanupChannel();
  };
  chart.eventChannel = channel;
  channel.port1.onmessage = (evt: { data: MessageData }) => {
    // 处理mark
    hoverBarMark(chart, evt.data);
    // 处理tooltip
    hoverTooltip(chart, evt.data);
  };
  if ('ontouchstart' in document) {
    select(svg).on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    select(svg).on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
  }

  //鼠标移动
  function moved(event: MouseEvent) {
    if ('ontouchstart' in document) {
      moveCoalescer.schedule({
        position: pointer(event),
        eventName: 'touchmove',
      });
    } else {
      moveCoalescer.schedule({
        position: pointer(event),
        eventName: 'mousemove',
      });
    }
  }

  //鼠标进入
  function entered(event: MouseEvent) {
    if ('ontouchstart' in document) {
      channel.port2.postMessage({
        position: pointer(event),
        eventName: 'touchend',
      });
    } else {
      channel.port2.postMessage({
        position: pointer(event),
        eventName: 'mouseenter',
      });
    }
  }

  //鼠标离开
  function leaved(event: MouseEvent) {
    if ('ontouchstart' in document) {
      channel.port2.postMessage({
        position: pointer(event),
        eventName: 'touchstart',
      });
    } else {
      channel.port2.postMessage({
        position: pointer(event),
        eventName: 'mouseleave',
      });
    }
  }
}

// 事件卸载
export function unBindListener(bindDom: HTMLCanvasElement | SVGElement) {
  select(bindDom).on('.');
}

export function registerEvent(this: BaseBarChartInstance, eventName: MouseEventName | ClickEventName, event: (exposedDatas: ExposedData[]) => void) {
  this.listeners = this.listeners ?? ({} as Listeners);
  if (this.listeners[eventName] == undefined) {
    this.listeners[eventName] = [];
  }
  const events = this.listeners[eventName];
  const existEvent = (events as NonNullable<typeof events>).find(ev => ev === event);

  if (!existEvent) {
    (events as NonNullable<typeof events>).push(event as () => void);
  }
}
