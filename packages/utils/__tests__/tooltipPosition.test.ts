import { describe, expect, it } from 'vitest';
import { getTooltipPosition } from '../src/tooltipPosition';

describe('getTooltipPosition', () => {
  it('keeps the tooltip separated from the pointer and inside the container', () => {
    expect(
      getTooltipPosition({
        x: 20,
        y: 30,
        width: 80,
        height: 40,
        containerWidth: 300,
        containerHeight: 200,
      })
    ).toEqual({ x: 32, y: 42 });

    expect(
      getTooltipPosition({
        x: 280,
        y: 180,
        width: 80,
        height: 40,
        containerWidth: 300,
        containerHeight: 200,
      })
    ).toEqual({ x: 188, y: 128 });
  });

  it('chooses the side with more available space when neither side fits', () => {
    expect(
      getTooltipPosition({
        x: 150,
        y: 100,
        width: 220,
        height: 160,
        containerWidth: 300,
        containerHeight: 200,
      })
    ).toEqual({ x: 80, y: 40 });
  });
});
