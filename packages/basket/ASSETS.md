# 3D asset attribution

The chart includes two CC0 1.0 Universal basket models from Poly Haven:

| Option          | Model                                        | Creator and source                                                            | Runtime asset                               |
| --------------- | -------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- |
| `open-wicker`   | Wide, shallow open rectangular wicker basket | Kuutti Siitonen, [Wicker Basket 01](https://polyhaven.com/a/wicker_basket_01) | `src/assets/optimized/wicker-basket.glb`    |
| `lidded-wicker` | Lidded wicker storage basket with short feet | Kuutti Siitonen, [Wicker Basket 02](https://polyhaven.com/a/wicker_basket_02) | `src/assets/optimized/wicker-basket-02.glb` |

The original glTF scenes, geometry buffers, and 2K JPEG textures are retained under `src/assets/baskets/`. The models are normalized at runtime so their horizontal long edge fits the chart camera.

The studio reflection environment is [Studio Small 08](https://polyhaven.com/a/studio_small_08) by Sergej Majboroda, also distributed under CC0 1.0. Its 1K RGBE HDRI is bundled at `src/assets/optimized/studio-small-08-1k.hdr`; Three.js `HDRLoader` converts it to a renderer-local PMREM at runtime. If it cannot load, the chart falls back to Three.js `RoomEnvironment`.

The runtime GLB files were optimized with [glTF Transform](https://github.com/donmccurdy/glTF-Transform) 4.5.0. Texture resizing and WebP encoding preserve the model geometry without compression or simplification:

```bash
pnpm dlx @gltf-transform/cli@4.5.0 optimize <source.gltf-or-glb> <output.glb> \
  --compress false --flatten false --instance false --join false \
  --simplify false --weld false --texture-compress webp --texture-size 2048
```
