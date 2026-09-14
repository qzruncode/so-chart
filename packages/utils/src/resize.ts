import type { ResizeChannel } from '@so-chart/types/common';

type ResizeAwareChart = {
  container?: HTMLElement;
  resize: () => void;
};

export const throttleResize = (chart: ResizeAwareChart, time = 100): ResizeChannel => {
  const channel = new MessageChannel();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;

  const newResize = () => {
    if (disposed) return;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (!disposed) {
        channel.port2.postMessage('resize');
      }
    }, time);
  };
  window.addEventListener('resize', newResize);

  const resizeObserver = typeof ResizeObserver !== 'undefined' && chart.container ? new ResizeObserver(() => newResize()) : undefined;
  if (resizeObserver && chart.container) {
    resizeObserver.observe(chart.container);
  }

  let lastWidth = Number.MIN_SAFE_INTEGER;
  let lastHeight = Number.MIN_SAFE_INTEGER;
  channel.port1.onmessage = () => {
    const rect = chart.container?.getBoundingClientRect();
    const currentWidth = rect?.width ?? window.innerWidth;
    const currentHeight = rect?.height ?? window.innerHeight;
    if (currentWidth !== lastWidth || currentHeight !== lastHeight) {
      chart.resize();
    }
    lastWidth = currentWidth;
    lastHeight = currentHeight;
  };

  const initialResize = setTimeout(() => {
    if (!disposed) {
      channel.port2.postMessage('resize');
    }
  });
  const resizeChannel = channel as ResizeChannel;
  resizeChannel.cleanup = () => {
    if (disposed) return;
    disposed = true;
    clearTimeout(timeoutId);
    clearTimeout(initialResize);
    window.removeEventListener('resize', newResize);
    resizeObserver?.disconnect();
    channel.port1.onmessage = null;
    channel.port1.close();
    channel.port2.close();
  };
  return resizeChannel;
};

export function getDomWidth(container: HTMLElement) {
  let domWidth = getComputedStyle(container).width;
  if (domWidth === 'auto' || domWidth === '') {
    // dom未渲染
    console.error('so-chart 传入的container未渲染或已卸载，请检查代码');
    domWidth = '0px';
  }
  const width = Number(domWidth.slice(0, -2));
  return width;
}
