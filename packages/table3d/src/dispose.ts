import * as THREE from 'three';

type RenderableObject = THREE.Object3D & {
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material | THREE.Material[];
};

function isTexture(value: unknown): value is THREE.Texture {
  return typeof value === 'object' && value !== null && 'isTexture' in value && 'dispose' in value && typeof value.dispose === 'function';
}

function disposeMaterial(material: THREE.Material, textures: Set<THREE.Texture>) {
  for (const value of Object.values(material as unknown as Record<string, unknown>)) {
    if (isTexture(value) && !textures.has(value)) {
      textures.add(value);
      value.dispose();
    }
  }
  material.dispose();
}

export function disposeObject3D(object: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  object.traverse(child => {
    const renderable = child as RenderableObject;
    if (renderable.geometry && !geometries.has(renderable.geometry)) {
      geometries.add(renderable.geometry);
      renderable.geometry.dispose();
    }

    const childMaterials = renderable.material
      ? Array.isArray(renderable.material)
        ? renderable.material
        : [renderable.material]
      : [];
    childMaterials.forEach(material => {
      if (!materials.has(material)) {
        materials.add(material);
        disposeMaterial(material, textures);
      }
    });
  });
}
