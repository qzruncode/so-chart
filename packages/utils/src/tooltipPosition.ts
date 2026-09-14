export const TOOLTIP_GAP = 12;
export const TOOLTIP_TRANSITION_DURATION = 40;

export function getTooltipPosition({
  x,
  y,
  width,
  height,
  containerWidth,
  containerHeight,
  gap = TOOLTIP_GAP,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
  gap?: number;
}) {
  const maxX = Math.max(containerWidth - width, 0);
  const maxY = Math.max(containerHeight - height, 0);
  const spaceAfterX = containerWidth - x - gap;
  const spaceBeforeX = x - gap;
  const spaceAfterY = containerHeight - y - gap;
  const spaceBeforeY = y - gap;
  const nextX = width <= spaceAfterX || spaceAfterX >= spaceBeforeX ? x + gap : x - width - gap;
  const nextY = height <= spaceAfterY || spaceAfterY >= spaceBeforeY ? y + gap : y - height - gap;

  return {
    x: Math.min(Math.max(nextX, 0), maxX),
    y: Math.min(Math.max(nextY, 0), maxY),
  };
}
