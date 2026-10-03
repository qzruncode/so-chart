import { describe, expect, it } from 'vitest';
import { normalizeOptions } from '../src/normal';

describe('water transmission compatibility', () => {
  it('retains the previous deep-water contribution by default', () => {
    expect(normalizeOptions().water.transmission).toBe(0.12);
  });
  it('accepts shallow-water transmission and rejects invalid ranges', () => {
    expect(normalizeOptions({ water: { transmission: 0.9 } }).water.transmission).toBe(0.9);
    expect(normalizeOptions({ water: { transmission: -1 } }).water.transmission).toBe(0);
    expect(normalizeOptions({ water: { transmission: 2 } }).water.transmission).toBe(1);
    expect(normalizeOptions({ water: { transmission: NaN } }).water.transmission).toBe(0.12);
  });
});
