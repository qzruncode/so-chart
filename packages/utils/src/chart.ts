import type { Layout } from '@so-chart/types/common';

export const getUid = () => new Date().getTime() + Math.random().toString(36).substring(2);

export const getCanvas = () => {
  const id = getUid();
  const canvas = document.createElement('canvas');
  const chartId = 'so-chart_canvas' + id;
  canvas.setAttribute('id', chartId);
  return canvas;
};

export const getSvg = () => {
  const id = getUid();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); // 不能直接使用createElement
  const chartId = 'so-chart_svg' + id;
  svg.setAttribute('id', chartId);
  svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
  svg.style.zIndex = '1';
  svg.style.position = 'absolute';
  svg.style.top = '0px';
  svg.style.left = '0px';
  return svg;
};

export const translateBoxPosition = ({
  context,
  layout,
  position,
  callback,
}: {
  context: OffscreenCanvasRenderingContext2D;
  layout: Required<Layout> & { width: number };
  position: {
    x: 'left' | 'center' | 'right';
    y: 'top' | 'center' | 'bottom';
  };
  callback: () => void;
}) => {
  const { viewboxCenter_x, viewboxCenter_y } = getBoxPosition({ layout, position });
  context.save();
  context.translate(viewboxCenter_x, viewboxCenter_y);
  callback();
  context.restore();
};

export function getBoxPosition({
  layout,
  position,
}: {
  layout: Required<Layout> & { width: number };
  position: {
    x: 'left' | 'center' | 'right';
    y: 'top' | 'center' | 'bottom';
  };
}) {
  const { height, width, left, right, top, bottom } = layout;
  let viewboxCenter_x = 0;
  let viewboxCenter_y = 0;
  if (position.x === 'left') {
    viewboxCenter_x = left;
  } else if (position.x === 'right') {
    viewboxCenter_x = width - right;
  } else if (position.x === 'center') {
    viewboxCenter_x = left + (width - left - right) / 2;
  }

  if (position.y === 'top') {
    viewboxCenter_y = top;
  } else if (position.y === 'bottom') {
    viewboxCenter_y = height - bottom;
  } else if (position.y === 'center') {
    viewboxCenter_y = top + (height - top - bottom) / 2;
  }

  return { viewboxCenter_x, viewboxCenter_y };
}
