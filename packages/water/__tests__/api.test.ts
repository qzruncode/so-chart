import { describe, expect, it, vi } from 'vitest';
import { normalizeOptions } from '../src/normal';
import { Texture, TextureLoader } from 'three';
import { loadBundledWaterNormalMaps } from '../src/normal';
import { createWaterObject } from '../src/scene';
describe('public water contract', () => {
  it('preserves defaults and orders related limits', () => {
    const n = normalizeOptions({
      camera: { near: 10, far: 1 },
      fog: { near: 100, far: 2 },
      controls: { minDistance: 100, maxDistance: 1, minPolarAngle: 2, maxPolarAngle: 0.1 },
      animation: { reducedMotion: 'always' },
      sky: { show: false },
    });
    expect(n.camera.far).toBeGreaterThan(n.camera.near);
    expect(n.fog.far).toBeGreaterThan(n.fog.near);
    expect(n.controls.maxDistance).toBe(100);
    expect(n.controls.maxPolarAngle).toBe(2);
    expect(n.animation.reducedMotion).toBe('always');
    expect(n.sky.show).toBe(false);
    expect(normalizeOptions().controls.enableRotate).toBe(true);
    expect(normalizeOptions().controls.touchAction).toBe('pan-y');
  });
  it('releases partial normal-map success on loading failure', async () => {
    const texture = new Texture();
    const dispose = vi.spyOn(texture, 'dispose');
    const load = vi.spyOn(TextureLoader.prototype, 'loadAsync').mockResolvedValueOnce(texture).mockRejectedValueOnce(new Error('missing map'));
    await expect(loadBundledWaterNormalMaps()).rejects.toThrow('missing map');
    expect(dispose).toHaveBeenCalledTimes(1);
    load.mockRestore();
  });
  it('pauses real surface impulses and releases owned resources idempotently', () => {
    const onError = vi.fn();
    const surface = createWaterObject({ animation: { enabled: false }, onError });
    surface.addRipple(1, 1);
    expect(surface.hasActiveRipples()).toBe(false);
    surface.setAnimationEnabled(true);
    surface.addRipple(1, 1);
    expect(surface.hasActiveRipples()).toBe(true);
    const slots = surface.material.uniforms.ripples.value;
    for (let i = 0; i < 100; i++) surface.addRipple(i, i);
    expect(surface.material.uniforms.ripples.value).toBe(slots);
    expect(slots).toHaveLength(8);
    surface.setAnimationEnabled(false);
    expect(surface.hasActiveRipples()).toBe(false);
    surface.dispose();
    surface.dispose();
    expect(surface.isDisposed).toBe(true);
  });
});
