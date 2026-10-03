import { describe, expect, it } from 'vitest';
import { getPondPose, POND_BOTTOM, POND_DEPTH, POND_FISHES, POND_WAVE_HEIGHT, POND_WIDTH } from '../demo/examples/pondSwim';

describe('six-fish pond paths', () => {
  it('keeps conservative whole-fish bounds inside the banks, wave trough and floor for 30 minutes', () => {
    for (let index = 0; index < POND_FISHES.length; index += 1) {
      for (let seconds = 0; seconds <= 1800; seconds += 3) {
        const pose = getPondPose(index, seconds);
        // Deliberately larger than the current scaled model extents; actual skinned bounds are also checked in-browser.
        expect(Math.abs(pose.x) + 1.2).toBeLessThan(POND_WIDTH / 2);
        expect(Math.abs(pose.z) + 1.2).toBeLessThan(POND_DEPTH / 2);
        expect(pose.y + 0.48).toBeLessThan(-POND_WAVE_HEIGHT);
        expect(pose.y - 0.48).toBeGreaterThan(POND_BOTTOM);
      }
    }
  });
  it('turns along the path tangent continuously, including angle wrapping', () => {
    for (let index = 0; index < POND_FISHES.length; index += 1) {
      for (let seconds = 0; seconds < 120; seconds += 0.5) {
        const a = getPondPose(index, seconds);
        const b = getPondPose(index, seconds + 0.001);
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const length = Math.hypot(dx, dz);
        expect((Math.cos(a.yaw) * dx - Math.sin(a.yaw) * dz) / length).toBeGreaterThan(0.999);
        expect(Math.cos(b.yaw - a.yaw)).toBeGreaterThan(0.999);
      }
    }
  });
});
