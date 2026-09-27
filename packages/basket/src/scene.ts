import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import openWickerBasketModelUrl from './assets/optimized/wicker-basket.glb?url';
import liddedWickerBasketModelUrl from './assets/optimized/wicker-basket-02.glb?url';
import type { BasketModel, NormalizedBasketObjectOptions } from './types';

const BASKET_WIDTH = 2;
const BASKET_TEXTURE_ANISOTROPY = 16;

const BASKET_MODEL_ASSETS: Record<BasketModel, string> = {
  'open-wicker': openWickerBasketModelUrl,
  'lidded-wicker': liddedWickerBasketModelUrl,
};

function configureBasketMaterials(root: THREE.Object3D, options: NormalizedBasketObjectOptions) {
  const tint = new THREE.Color(options.basketMaterial.color);

  root.traverse(child => {
    if (!(child instanceof THREE.Mesh)) return;

    child.castShadow = true;
    child.receiveShadow = true;
    child.userData.basketPart = 'weave';
    child.material = Array.isArray(child.material)
      ? child.material.map(material => createBasketMaterial(material, tint, options))
      : createBasketMaterial(child.material, tint, options);
  });
}

function createBasketMaterial(source: THREE.Material, tint: THREE.Color, options: NormalizedBasketObjectOptions) {
  if (!(source as THREE.MeshStandardMaterial).isMeshStandardMaterial) return source.clone();

  const physicalSource = Object.assign(new THREE.MeshPhysicalMaterial(), source);
  const material = new THREE.MeshPhysicalMaterial().copy(physicalSource);
  physicalSource.dispose();

  const standardMaterial = material as THREE.MeshStandardMaterial;
  [
    standardMaterial.map,
    standardMaterial.normalMap,
    standardMaterial.aoMap,
    standardMaterial.roughnessMap,
    standardMaterial.metalnessMap,
    standardMaterial.emissiveMap,
    standardMaterial.alphaMap,
  ].forEach(texture => {
    if (!texture) return;
    texture.anisotropy = BASKET_TEXTURE_ANISOTROPY;
    texture.needsUpdate = true;
  });

  material.color.multiply(tint);
  material.roughness = options.basketMaterial.roughness;
  material.metalness = options.basketMaterial.metalness;
  material.clearcoat = options.basketMaterial.clearcoat;
  material.clearcoatRoughness = options.basketMaterial.clearcoatRoughness;
  material.envMapIntensity = options.basketMaterial.envMapIntensity;
  source.dispose();
  return material;
}

function normalizeModel(model: THREE.Object3D) {
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = BASKET_WIDTH / Math.max(size.x, size.z);

  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
}

function addFloor(group: THREE.Group, options: NormalizedBasketObjectOptions) {
  if (!options.floor.show) return;

  const floorMaterial = new THREE.MeshPhysicalMaterial({
    color: options.floor.color,
    roughness: options.floor.roughness,
    metalness: options.floor.metalness,
    envMapIntensity: 0.2,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMaterial);
  floor.name = 'basket-floor';
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.012;
  floor.receiveShadow = true;
  floor.userData.basketPart = 'floor';
  group.add(floor);
}

export async function createBasketScene(options: NormalizedBasketObjectOptions) {
  const gltf = await new GLTFLoader().loadAsync(BASKET_MODEL_ASSETS[options.basket.model]);
  const group = new THREE.Group();
  group.name = 'basket-scene';

  const basket = gltf.scene;
  basket.name = 'basket-' + options.basket.model + '-model';
  basket.userData.basketModel = options.basket.model;
  normalizeModel(basket);
  configureBasketMaterials(basket, options);

  const basketObject = new THREE.Group();
  basketObject.name = 'basket-object';
  basketObject.position.set(...options.basket.position);
  basketObject.scale.setScalar(options.basket.scale);
  basketObject.rotation.y = options.basket.rotationY;
  basket.userData.basketPart = 'model';
  basketObject.userData.basketPart = 'basket';
  basketObject.add(basket);
  group.add(basketObject);
  addFloor(group, options);

  return group;
}
