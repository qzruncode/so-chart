import { describe, expect, it } from 'vitest';
import { AnimationMixer, Euler, Group, Vector3 } from 'three';
import { updateFishScene } from '../../fish/src/scene';
describe('independent native fish clocks', () => {
  it('samples per-id cumulative clocks and falls back without changing other fish', () => {
    const actors = ['a', 'b'].map(id => {
      const root = new Group();
      root.userData.fishId = id;
      return {
        root,
        modelRoot: root,
        mixer: new AnimationMixer(root),
        clipDuration: 100,
        anchor: new Vector3(),
        baseRotation: new Euler(),
        speed: 1,
        amplitude: 1,
        phase: 0,
      };
    });
    updateFishScene(actors, 10, 1, { a: 3 });
    expect(actors[0].mixer.time).toBe(3);
    expect(actors[1].mixer.time).toBe(10);
    updateFishScene(actors, 11, 1, { a: 3.02, b: NaN });
    expect(actors[0].mixer.time).toBeCloseTo(3.02);
    expect(actors[1].mixer.time).toBe(11);
  });
});
