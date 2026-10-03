import { Mesh, type Material, type Object3D, type Texture } from 'three';

function isTexture(value: unknown): value is Texture {
  return Boolean(value && typeof value === 'object' && (value as Texture).isTexture);
}

function disposeMaterial(material: Material): void {
  const textures = new Set<Texture>();
  const record = material as unknown as Record<string, unknown>;

  Object.values(record).forEach(value => {
    if (isTexture(value)) {
      textures.add(value);
    }
  });

  const uniforms = record.uniforms;
  if (uniforms && typeof uniforms === 'object') {
    Object.values(uniforms as Record<string, { value?: unknown }>).forEach(uniform => {
      if (uniform && isTexture(uniform.value)) {
        textures.add(uniform.value);
      }
    });
  }

  textures.forEach(texture => texture.dispose());
  material.dispose();
}

/**
 * Disposes an application-owned Object3D subtree.
 *
 * Call this for objects that the application added to `chart.scene`. Shared
 * geometry, material and texture instances are deduplicated during cleanup.
 */
export function disposeObject3D(object: Object3D): void {
  const geometries = new Set<{ dispose(): void }>();
  const materials = new Set<Material>();

  object.traverse(child => {
    if (!(child instanceof Mesh)) {
      return;
    }

    geometries.add(child.geometry);
    const material = child.material;
    if (Array.isArray(material)) {
      material.forEach(item => materials.add(item));
    } else {
      materials.add(material);
    }
  });

  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => disposeMaterial(material));
}
