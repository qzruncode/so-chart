import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import { createTableObject, disposeObject3D } from '../src';
import { normalizeOptions } from '../src/normal';

describe('table3d option normalization', () => {
  it('keeps round supports and normalizes rectangular tables to legs', () => {
    expect(normalizeOptions({ table: { shape: 'round', support: 'pedestal' } }).table.support).toBe('pedestal');
    expect(normalizeOptions({ table: { shape: 'rectangular' } }).table.support).toBe('legs');
  });

  it('supports external environments without taking ownership', () => {
    const environmentTexture = new THREE.Texture();
    const normalized = normalizeOptions({
      environment: {
        texture: environmentTexture,
        background: true,
        intensity: 0.85,
        rotation: [0, Math.PI / 4, 0],
      },
    });

    expect(normalized.environment.texture).toBe(environmentTexture);
    expect(normalized.environment.background).toBe(true);
    expect(normalized.environment.rotation).toEqual([0, Math.PI / 4, 0]);
  });

  it('inherits and clears material maps explicitly', () => {
    const diffuse = new THREE.Texture();
    const normal = new THREE.Texture();
    const roughness = new THREE.Texture();
    const normalized = normalizeOptions({
      material: { map: diffuse, normalMap: normal, roughnessMap: roughness },
      tabletopMaterial: { normalMap: null },
    });

    expect(normalized.tabletopMaterial.map).toBe(diffuse);
    expect(normalized.tabletopMaterial.normalMap).toBeUndefined();
    expect(normalized.tabletopMaterial.roughnessMap).toBe(roughness);
  });
});

describe('createTableObject', () => {
  it('clones caller-owned material maps and releases only the internal copies', () => {
    const diffuse = new THREE.Texture();
    const roughness = new THREE.Texture();
    const table = createTableObject({
      table: { shape: 'round', support: 'pedestal' },
      material: { map: diffuse, roughnessMap: roughness },
      floor: { show: false },
    });
    const top = table.getObjectByName('table3d-round-top') as THREE.Mesh;
    const material = top.material as THREE.MeshPhysicalMaterial;
    const internalDiffuse = material.map;
    const internalRoughness = material.roughnessMap;
    const disposeDiffuse = vi.spyOn(internalDiffuse!, 'dispose');
    const disposeRoughness = vi.spyOn(internalRoughness!, 'dispose');
    const disposeCallerDiffuse = vi.spyOn(diffuse, 'dispose');
    const disposeCallerRoughness = vi.spyOn(roughness, 'dispose');

    expect(internalDiffuse).not.toBe(diffuse);
    expect(internalRoughness).not.toBe(roughness);

    disposeObject3D(table);

    expect(disposeDiffuse).toHaveBeenCalledOnce();
    expect(disposeRoughness).toHaveBeenCalledOnce();
    expect(disposeCallerDiffuse).not.toHaveBeenCalled();
    expect(disposeCallerRoughness).not.toHaveBeenCalled();
  });
});
