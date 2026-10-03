import { describe, expect, it } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';
import { normalizeOptions } from '../src/normal';
import { projectWaterPointer } from '../src/interaction';
import { PondFishResponse } from '../demo/examples/pondResponse';
import { getPondPose } from '../demo/examples/pondSwim';
describe('pointer interaction', () => {
  it('is opt-in with bounded settings', () => {
    expect(normalizeOptions().interaction.enabled).toBe(false);
    expect(normalizeOptions({ interaction: { strength: 9, radius: -1, decay: 99, sampleInterval: 0 } }).interaction).toEqual({
      enabled: false,
      strength: 0.08,
      radius: 0.3,
      decay: 6,
      sampleInterval: 30,
    });
  });
  it('projects with current camera and offset canvas onto elevated water', () => {
    const camera = new PerspectiveCamera(45, 1.6, 0.1, 100);
    for (const p of [
      [4, 8, 9],
      [-6, 5, 3],
      [2, 12, -8],
    ]) {
      camera.position.fromArray(p);
      camera.lookAt(0, 1, 0);
      camera.updateMatrixWorld(true);
      const q = new Vector3(1, 1, -1).project(camera);
      const hit = projectWaterPointer(camera, { left: 57, top: 123, width: 800, height: 500 }, 57 + (q.x + 1) * 400, 123 + (1 - q.y) * 250, {
        width: 12,
        depth: 9,
        elevation: 1,
      });
      expect(hit?.[0]).toBeCloseTo(1, 8);
      expect(hit?.[1]).toBeCloseTo(1, 8);
      expect(hit?.[2]).toBeCloseTo(-1, 8);
    }
  });
  it('responds nearby, leaves distant fish alone and recovers continuously', () => {
    const r = new PondFishResponse();
    for (let k = 0; k < 120; k++) {
      const b = getPondPose(0, k / 60);
      r.step(0, k / 60, 1 / 60, [b.x + 0.2, 0, b.z]);
      r.step(1, k / 60, 1 / 60, [100, 0, 100]);
    }
    expect(Math.hypot(r.states[0].x, r.states[0].z)).toBeGreaterThan(0.1);
    expect(r.states[1].x).toBe(0);
    expect(r.states[1].speed).toBe(1);
    const clock = r.states[0].clock;
    for (let k = 0; k < 600; k++) r.step(0, 2 + k / 60, 1 / 60, null);
    expect(Math.hypot(r.states[0].x, r.states[0].z)).toBeLessThan(0.001);
    expect(r.states[0].speed).toBeCloseTo(1, 5);
    expect(r.states[0].clock).toBeGreaterThan(clock);
  });
  it('bounds thirty minutes of rapid targets', () => {
    const r = new PondFishResponse();
    let worst = { x: 0, z: 0, turn: 0, speed: 0, offset: 0 };
    for (let k = 0; k < 36000; k++)
      for (let i = 0; i < 6; i++) {
        const yaw = r.states[i].yaw,
          b = getPondPose(i, k * 0.05),
          p = r.step(i, k * 0.05, 0.05, [b.x + Math.sin(k) * 0.3, 0, b.z + Math.cos(k) * 0.3]);
        worst = {
          x: Math.max(worst.x, Math.abs(p.x)),
          z: Math.max(worst.z, Math.abs(p.z)),
          turn: Math.max(worst.turn, Math.abs(p.yaw - yaw)),
          speed: Math.max(worst.speed, r.states[i].speed),
          offset: Math.max(worst.offset, Math.hypot(r.states[i].x, r.states[i].z)),
        };
      }
    expect(worst.x).toBeLessThanOrEqual(4.7);
    expect(worst.z).toBeLessThanOrEqual(3.2);
    expect(worst.turn).toBeLessThanOrEqual(0.100001);
    expect(worst.speed).toBeLessThanOrEqual(1.55);
    expect(worst.offset).toBeLessThanOrEqual(0.950001);
    const clocks = { ...r.times };
    r.stopReaction();
    expect(r.times).toEqual(clocks);
  });
});
