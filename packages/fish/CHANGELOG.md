# @so-chart/fish

## 0.2.0

### Minor Changes

- Add the fish package with six local Blender GLB models, camera controls, animation and resource disposal. Register its real package demo and handbook through the existing manifest registry, and connect it to the main workspace preview and standalone demo. The demo exposes species and multi-angle inspection controls with real-photo source links. Rebuild all six Blender assets with connected mouths, sculpted gill covers, embedded eyes, curved fins and separate PBR channels; keep source meshes and exported GLBs on the same revision. These are authored models with estimated hidden anatomy, not photogrammetry or a claim of photographic realism.

  Rebuild common carp and ordinary Carassius auratus using explicit total/standard-length definitions and cited morphometric population data. Correct torso/head proportions, dorsal-fin placement, caudal-fin share and crucian peduncle depth. Measure native anatomical vertex groups against the documented limits before export and include the resulting ratios in model metadata.

- Complete public options and lifecycle contracts, loading readiness/cancellation, accessible labels and reduced-motion support; fix independent ids, native animation amplitude and ordered limits. Rewrite package handbooks in the Scatter3D format, expose deployable asset bases, unify ESM/CJS boundaries and include exact asset/license notices in local release artifacts.
- 提供不创建画布的原生动画鱼对象组合 API；水面增加兼容原默认值的折射透射配置，并将反射/折射裁剪代理法线对齐到真实水平水面。水包真实示例复用当前六鱼候选，在水下平滑游动并转向，支持暂停恢复、视角、重新载入和原纯海面切换，处理异步晚到资源及卸载释放。
- Add bounded world-space pointer ripples and smooth nearby-fish avoidance to the Water2 demo. Preserve Orbit controls, touch scrolling and lifecycle cleanup; support continuous per-instance native animation clocks.

### Patch Changes

- 展示当前持久保存的六鱼未验收候选：青鱼收颊下颌与渐降额顶的native-v7彩色候选、草鱼原生鳞片、连续头身皮肤和独立角膜的v13彩色候选、鲢连续上翘口弧、原生腹棱与宽软尾缘的native-v7彩色候选、鳙侧展宽口下颌、后段腹棱与分区灰黑斑的native-v7彩色候选、鲤鱼短圆厚唇、渐细曲须与后降长背鳍的native-v7彩色候选及普通鲫鱼C.auratus短圆小口、无须、深体后降背鳍与29列大鳞native-v7彩色候选。保留旧资产，默认显示全部，标明实际材质状态，并同步示例、Handbook与源文件校验清单。
