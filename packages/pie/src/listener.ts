import type { ClickEventName, EventName, MouseEventName } from '@so-chart/types/common';
import { pointer, select } from 'd3';
import getExposedDataAndDraw from './getExposedDataAndDraw';
import type { BasePieChartInstance, Listeners, PieDataset } from '@so-chart/types/pie';
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
  data: PieDataset;
};

export function bindListener(chart: BasePieChartInstance) {
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
    const { listeners } = chart;
    const { eventName } = evt.data;
    const exposedDatas = getExposedDataAndDraw(chart, evt.data);
    if (listeners) {
      listeners[eventName]?.forEach(listener => {
        (listener as (exposedDatas?: ExposedData[]) => void)(exposedDatas);
      });
    }
  };
  if ('ontouchstart' in document) {
    select(svg)
      .on('touchstart', (event: MouseEvent) => entered(event, channel))
      .on('touchmove', (event: MouseEvent) => moved(event, moveCoalescer))
      .on('touchend', (event: MouseEvent) => leaved(event, channel));
  } else {
    select(svg)
      .on('mouseenter', (event: MouseEvent) => entered(event, channel))
      .on('mousemove', (event: MouseEvent) => moved(event, moveCoalescer))
      .on('mouseleave', (event: MouseEvent) => leaved(event, channel));
  }
}

//鼠标移动
function moved(event: MouseEvent, moveCoalescer: { schedule: (message: Pick<MessageData, 'position' | 'eventName'>) => void }) {
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
function entered(event: MouseEvent, channel: MessageChannel) {
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
function leaved(event: MouseEvent, channel: MessageChannel) {
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

// 事件卸载
export function unBindListener(bindDom: HTMLCanvasElement | SVGElement) {
  select(bindDom).on('.');
}

export function registerEvent(this: BasePieChartInstance, eventName: MouseEventName | ClickEventName, event: (exposedDatas: ExposedData[]) => void) {
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
