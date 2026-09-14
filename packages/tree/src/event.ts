import { pointer, select, Selection } from 'd3';
import type { ClickEventName, EventName, MouseEventName } from '@so-chart/types/common';
import type { BaseTreeInstance, DagreNode, Listeners } from '@so-chart/types/tree';
import { createMessageChannel } from '@so-chart/utils';

export type MessageData = {
  event: MouseEvent | PointerEvent;
  position: [number, number];
  eventName: EventName;
};
export default function bindListener(chart: BaseTreeInstance, ele: Selection<SVGForeignObjectElement, DagreNode, SVGGElement, unknown>) {
  chart.eventChannel?.cleanup();
  const channel = createMessageChannel();
  chart.eventChannel = channel;
  channel.port1.onmessage = (evt: { data: MessageData & { nodeId: string } }) => {
    const { eventName, position, nodeId } = evt.data;
    const { listeners } = chart;
    if (listeners) {
      listeners[eventName]?.forEach(listener => {
        (listener as (position: [number, number], nodeId: string) => void)(position, nodeId);
      });
    }
  };

  //鼠标移动
  function moved(this: SVGElement, event: MouseEvent) {
    const object = select(this);
    const { nodeId } = object.data()[0] as { nodeId: string };
    channel.port2.postMessage({
      position: pointer(event),
      eventName: 'ontouchstart' in document ? 'touchmove' : 'mousemove',
      nodeId,
    });
  }

  //鼠标进入
  function entered(this: SVGElement, event: MouseEvent) {
    const object = select(this);
    const { nodeId } = object.data()[0] as { nodeId: string };
    channel.port2.postMessage({
      position: pointer(event),
      eventName: 'ontouchstart' in document ? 'touchend' : 'mouseenter',
      nodeId,
    });
  }

  //鼠标离开
  function leaved(this: SVGElement, event: MouseEvent) {
    const object = select(this);
    const { nodeId } = object.data()[0] as { nodeId: string };
    channel.port2.postMessage({
      position: pointer(event),
      eventName: 'ontouchstart' in document ? 'touchstart' : 'mouseleave',
      nodeId,
    });
  }

  if ('ontouchstart' in document) {
    ele.on('touchstart', entered).on('touchmove', moved).on('touchend', leaved);
  } else {
    ele.on('mouseenter', entered).on('mousemove', moved).on('mouseleave', leaved);
  }
}

// 事件卸载
export function unBindListener(bindDom: SVGElement) {
  select(bindDom).selectAll('*').on('.');
}

// 注册事件
export function registerEvent(eventName: MouseEventName, event: (position: [number, number], nodeId: string) => void): void;
export function registerEvent(eventName: ClickEventName, event: (position: [number, number], nodeId: string) => void): void;
export function registerEvent(
  this: BaseTreeInstance,
  eventName: MouseEventName | ClickEventName,
  event: (position: [number, number], nodeId: string) => void
) {
  this.listeners = this.listeners ?? ({} as Listeners);
  if (this.listeners[eventName] == undefined) {
    this.listeners[eventName] = [];
  }
  const events = this.listeners[eventName];
  const existEvent = (events as NonNullable<typeof events>).find(e => e === event);

  if (!existEvent) {
    (events as NonNullable<typeof events>).push(event as (position: [number, number], nodeId: string) => void);
  }
}
