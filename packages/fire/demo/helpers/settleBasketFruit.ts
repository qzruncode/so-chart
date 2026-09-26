import * as THREE from 'three';

const BASKET_FLOOR_HEIGHT = 0.075;

function createFruitColliderPoints(basketFrame: THREE.Object3D, fruit: THREE.Group) {
  const basketFromWorld = basketFrame.matrixWorld.clone().invert();
  const fruitFromBasket = new THREE.Matrix4().compose(fruit.position.clone(), fruit.quaternion.clone(), new THREE.Vector3(1, 1, 1)).invert();
  const points: number[] = [];
  const vertex = new THREE.Vector3();

  fruit.updateWorldMatrix(true, true);
  fruit.traverseVisible(object => {
    if (!(object instanceof THREE.Mesh)) return;
    const positions = object.geometry.getAttribute('position');
    if (!positions) return;

    const sampleCount = Math.min(positions.count, 384);
    const sampleStep = Math.max((positions.count - 1) / Math.max(sampleCount - 1, 1), 1);
    for (let sample = 0; sample < sampleCount; sample += 1) {
      const index = Math.min(Math.round(sample * sampleStep), positions.count - 1);
      vertex
        .set(positions.getX(index), positions.getY(index), positions.getZ(index))
        .applyMatrix4(object.matrixWorld)
        .applyMatrix4(basketFromWorld)
        .applyMatrix4(fruitFromBasket);
      points.push(vertex.x, vertex.y, vertex.z);
    }
  });

  return new Float32Array(points);
}

function arrangeFruitFallback(fruitGroup: THREE.Group, basketFrame: THREE.Object3D) {
  const items = fruitGroup.children.filter(
    (child): child is THREE.Group => child instanceof THREE.Group && (child.userData.fruitType === 'apple' || child.userData.fruitType === 'pear')
  );
  const positions: ReadonlyArray<readonly [number, number, number]> = [
    [-0.37, BASKET_FLOOR_HEIGHT, -0.04],
    [0.37, BASKET_FLOOR_HEIGHT, -0.04],
    [-0.37, 0.67, 0.1],
    [0.37, 0.67, 0.1],
  ];

  items.forEach((fruit, index) => {
    const [x, y, z] = positions[index] ?? positions[positions.length - 1];
    fruit.position.set(x, y, z);
    fruit.rotation.x = 0;
    fruit.rotation.z = 0;
  });
  basketFrame.updateWorldMatrix(true, true);
}

/** Settles demo fruit once, then writes the rigid-body poses back to the Three.js models. */
export async function settleBasketFruit(basketFrame: THREE.Object3D, fruitGroup: THREE.Group, isCancelled: () => boolean) {
  const fruits = fruitGroup.children.filter(
    (child): child is THREE.Group => child instanceof THREE.Group && (child.userData.fruitType === 'apple' || child.userData.fruitType === 'pear')
  );
  if (fruits.length < 2) return;

  try {
    const rapierModule = await import('@dimforge/rapier3d-compat');
    const RAPIER = rapierModule.default;
    await RAPIER.init();
    if (isCancelled()) return;

    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    world.timestep = 1 / 60;
    world.numSolverIterations = 8;

    try {
      const basketBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
      const floorPoints: number[] = [];
      for (const y of [0.015, BASKET_FLOOR_HEIGHT]) {
        for (let segment = 0; segment < 32; segment += 1) {
          const angle = (segment / 32) * Math.PI * 2;
          floorPoints.push(0.69 * Math.cos(angle), y, 0.49 * Math.sin(angle));
        }
      }
      const floorCollider = RAPIER.ColliderDesc.convexHull(new Float32Array(floorPoints));
      if (!floorCollider) throw new Error('Unable to create the demo basket floor collider.');
      world.createCollider(floorCollider.setFriction(0.92).setRestitution(0.01), basketBody);

      const wallRows = [
        { y: 0.12, radiusX: 0.74, radiusZ: 0.53 },
        { y: 0.31, radiusX: 0.83, radiusZ: 0.61 },
        { y: 0.5, radiusX: 0.92, radiusZ: 0.69 },
      ];
      for (const row of wallRows) {
        for (let segment = 0; segment < 32; segment += 1) {
          const angle = (segment / 32) * Math.PI * 2;
          const tangentHalfLength = ((Math.PI * Math.max(row.radiusX, row.radiusZ)) / 32) * 0.62;
          const wallCollider = RAPIER.ColliderDesc.cuboid(0.035, 0.115, tangentHalfLength)
            .setTranslation(row.radiusX * Math.cos(angle), row.y, row.radiusZ * Math.sin(angle))
            .setRotation({ x: 0, y: Math.sin(-angle / 2), z: 0, w: Math.cos(-angle / 2) })
            .setFriction(0.86)
            .setRestitution(0.01);
          world.createCollider(wallCollider, basketBody);
        }
      }

      const fruitStarts = [
        { x: -0.43, y: 0.87, z: -0.06 },
        { x: -0.1, y: 0.91, z: -0.27 },
        { x: 0.43, y: 0.95, z: -0.06 },
        { x: 0.1, y: 0.99, z: 0.27 },
      ];
      basketFrame.updateWorldMatrix(true, true);
      const bodies = fruits.map((fruit, index) => {
        const start = fruitStarts[index] ?? fruitStarts[fruitStarts.length - 1];
        fruit.position.set(start.x, start.y, start.z);
        fruit.updateWorldMatrix(true, true);
        const points = createFruitColliderPoints(basketFrame, fruit);
        const collider = RAPIER.ColliderDesc.convexHull(points);
        if (!collider) throw new Error(`Unable to create a rigid fruit collider for ${fruit.name}.`);

        const rotation = fruit.quaternion;
        const body = world.createRigidBody(
          RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(start.x, start.y, start.z)
            .setRotation({ x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w })
            .setLinearDamping(0.22)
            .setAngularDamping(0.42)
            .setCanSleep(true)
            .setAdditionalSolverIterations(4)
        );
        world.createCollider(collider.setDensity(0.9).setFriction(0.88).setRestitution(0.01).setContactSkin(0.002), body);
        return { fruit, body };
      });

      let sleepingSteps = 0;
      for (let step = 0; step < 900; step += 1) {
        world.step();
        if (bodies.every(({ body }) => body.isSleeping())) {
          sleepingSteps += 1;
          if (sleepingSteps >= 12) break;
        } else {
          sleepingSteps = 0;
        }
      }

      bodies.forEach(({ fruit, body }) => {
        const position = body.translation();
        const rotation = body.rotation();
        fruit.position.set(position.x, position.y, position.z);
        fruit.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      });
      basketFrame.updateWorldMatrix(true, true);
    } finally {
      world.free();
    }
  } catch (error) {
    console.warn('Rapier could not settle the demo fruit; using a spaced resting layout.', error);
    arrangeFruitFallback(fruitGroup, basketFrame);
  }
}
