import { pointer, select } from 'd3';
import type { BaseLineChartInstance, ExposedData, Listeners } from '@so-chart/types/line';
import type { EventName } from '@so-chart/types/common';
import { hoverLineMark } from './tooltip/hoverMark';
import { hoverTooltip } from './tooltip/hoverTooltip';
import { createFrameCoalescer, createMessageChannel } from '@so-chart/utils';

export type MessageData = {
  className: string;
  position: [number, number];
  eventName: EventName;
};

export function bindListener(chart: BaseLineChartInstance) {
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
    hoverLineMark(chart, evt.data);
    // 处理自定义事件
    hoverTooltip(chart, evt.data);
  };
  if ('ontouchstart' in document) {
    select(svg).on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    select(svg).on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
  }

  //鼠标移动
  function moved(this: unknown, event: MouseEvent) {
    if (event.target === svg) {
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
  }

  //鼠标进入
  function entered(event: MouseEvent) {
    if (event.target === svg) {
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
  }

  //鼠标离开
  function leaved(event: MouseEvent) {
    if (event.target === svg) {
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
}

// 事件卸载
export function unBindListener(bindDom: HTMLCanvasElement | SVGElement) {
  select(bindDom).on('.');
}

export function registerEvent(this: BaseLineChartInstance, eventName: EventName, event: (exposedDatas: ExposedData[]) => void) {
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
