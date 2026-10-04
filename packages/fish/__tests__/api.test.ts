import { describe, expect, it, vi } from 'vitest';
import {
  AnimationClip,
  AnimationMixer,
  Bone,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Euler,
  Group,
  Quaternion,
  QuaternionKeyframeTrack,
  Vector3,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { normalizeOptions } from '../src/normal';
import { updateFishScene } from '../src/scene';
import { createFishObject } from '../src/object';
describe('public fish contract', () => {
  it('normalizes new defaults and makes every id unique', () => {
    const n = normalizeOptions({
      fishes: [
        { type: 'grass-carp', id: ' a ' },
        { type: 'grass-carp', id: 'a' },
        { type: 'grass-carp', id: 'a-2' },
      ],
      camera: { near: 10, far: 1 },
      controls: { minDistance: 20, maxDistance: 2 },
      animation: { reducedMotion: 'auto' },
    });
    expect(new Set(n.fishes.map(f => f.id)).size).toBe(3);
    expect(n.camera.far).toBeGreaterThan(n.camera.near);
    expect(n.controls.maxDistance).toBe(20);
    expect(n.animation.reducedMotion).toBe('auto');
    expect(normalizeOptions().lighting.position).toEqual([-2.8, 4.5, 5.5]);
    expect(normalizeOptions().controls.touchAction).toBe('none');
  });
  it('actually scales native quaternion amplitude, including gains above one', () => {
    const root = new Group(),
      bone = new Bone();
    bone.name = 'tail';
    root.add(bone);
    const q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.3);
    const clip = new AnimationClip('swim', 2, [new QuaternionKeyframeTrack('tail.quaternion', [0, 1, 2], [0, 0, 0, 1, ...q.toArray(), 0, 0, 0, 1])]);
    const mixer = new AnimationMixer(root);
    mixer.clipAction(clip).play();
    const actor = {
      root,
      modelRoot: root,
      mixer,
      clipDuration: 2,
      anchor: new Vector3(),
      baseRotation: new Euler(),
      speed: 1,
      amplitude: 2,
      phase: 0,
      restBones: [{ bone, quaternion: new Quaternion() }],
    };
    updateFishScene([actor], 1, 1);
    expect(bone.quaternion.angleTo(new Quaternion())).toBeCloseTo(0.6, 6);
    actor.amplitude = 0;
    updateFishScene([actor], 1, 1);
    expect(bone.quaternion.angleTo(new Quaternion())).toBeCloseTo(0);
  });
  it('releases late-loaded geometry when an inflight request aborts', async () => {
    const root = new Group(),
      geometry = new BoxGeometry();
    const mesh = new Mesh(geometry, new MeshBasicMaterial());
    mesh.name = 'grass-carp-surface';
    root.add(mesh);
    const dispose = vi.spyOn(geometry, 'dispose');
    const clip = new AnimationClip('swim', 2, []);
    let resolve!: (value: Awaited<ReturnType<GLTFLoader['loadAsync']>>) => void;
    const load = vi.spyOn(GLTFLoader.prototype, 'loadAsync').mockImplementation(() => new Promise(r => (resolve = r)));
    const controller = new AbortController(),
      pending = createFishObject({ fishes: [{ type: 'grass-carp' }], signal: controller.signal });
    controller.abort();
    resolve({
      scene: root,
      scenes: [root],
      animations: [clip],
      cameras: [],
      asset: { version: '2.0' },
      parser: null as unknown as Awaited<ReturnType<GLTFLoader['loadAsync']>>['parser'],
      userData: {},
    });
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    expect(dispose).toHaveBeenCalledTimes(1);
    load.mockRestore();
  });
  it('rejects pre-aborted object construction without starting asset loads', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(createFishObject({ signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' });
  });
});
