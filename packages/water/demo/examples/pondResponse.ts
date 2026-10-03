import { getPondPose, POND_DEPTH, POND_FISHES, POND_WIDTH } from './pondSwim';

type Point = readonly [number, number, number] | null;
type State = { x: number; z: number; vx: number; vz: number; yaw: number; speed: number; clock: number };
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/** Bounded, damped avoidance; native clocks advance continuously with each fish's response. */
export class PondFishResponse {
  readonly states: State[] = POND_FISHES.map((_, i) => ({ x: 0, z: 0, vx: 0, vz: 0, yaw: getPondPose(i, 0).yaw, speed: 1, clock: 0 }));
  readonly times: Record<string, number> = Object.fromEntries(POND_FISHES.map((_, i) => ['pond-' + i, 0]));

  stopReaction(): void {
    this.states.forEach(state => {
      state.vx = 0;
      state.vz = 0;
      state.speed = 1;
    });
  }

  step(index: number, seconds: number, delta: number, point: Point) {
    const dt = Number.isFinite(delta) ? clamp(delta, 0, 0.05) : 0;
    const base = getPondPose(index, seconds);
    const state = this.states[index];
    let targetX = 0;
    let targetZ = 0;
    let influence = 0;
    if (point && point.every(Number.isFinite)) {
      const dx = base.x + state.x - point[0];
      const dz = base.z + state.z - point[2];
      const distance = Math.hypot(dx, dz);
      influence = Math.max(0, 1 - distance / 2);
      const fallback = index * 2.399 + 0.5;
      const ux = distance > 0.02 ? dx / distance : Math.cos(fallback);
      const uz = distance > 0.02 ? dz / distance : Math.sin(fallback);
      targetX = ux * influence * 0.95;
      targetZ = uz * influence * 0.95;
    }
    state.vx += ((targetX - state.x) * 7 - state.vx * 5.2) * dt;
    state.vz += ((targetZ - state.z) * 7 - state.vz * 5.2) * dt;
    const velocity = Math.hypot(state.vx, state.vz);
    if (velocity > 0.85) {
      state.vx *= 0.85 / velocity;
      state.vz *= 0.85 / velocity;
    }
    state.x += state.vx * dt;
    state.z += state.vz * dt;
    const offset = Math.hypot(state.x, state.z);
    if (offset > 0.95) {
      state.x *= 0.95 / offset;
      state.z *= 0.95 / offset;
    }
    const x = clamp(base.x + state.x, -POND_WIDTH / 2 + 1.3, POND_WIDTH / 2 - 1.3);
    const z = clamp(base.z + state.z, -POND_DEPTH / 2 + 1.3, POND_DEPTH / 2 - 1.3);
    if (x !== base.x + state.x) {
      state.x = x - base.x;
      state.vx = 0;
    }
    if (z !== base.z + state.z) {
      state.z = z - base.z;
      state.vz = 0;
    }
    const desired = Math.atan2(-(base.dz + state.vz), base.dx + state.vx);
    const angle = Math.atan2(Math.sin(desired - state.yaw), Math.cos(desired - state.yaw));
    state.yaw += clamp(angle, -2 * dt, 2 * dt);
    state.speed += (1 + influence * 0.55 - state.speed) * (1 - Math.exp(-dt * 3));
    state.speed = clamp(state.speed, 1, 1.55);
    state.clock += dt * state.speed;
    this.times['pond-' + index] = state.clock;
    return { x, y: base.y, z, yaw: state.yaw };
  }
}
