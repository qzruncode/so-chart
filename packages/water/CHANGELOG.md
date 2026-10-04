# Changelog

## 0.2.0

### Minor Changes

- Complete public options and lifecycle contracts, loading readiness/cancellation, accessible labels and reduced-motion support; fix independent ids, native animation amplitude and ordered limits. Rewrite package handbooks in the Scatter3D format, expose deployable asset bases, unify ESM/CJS boundaries and include exact asset/license notices in local release artifacts.
- 提供不创建画布的原生动画鱼对象组合 API；水面增加兼容原默认值的折射透射配置，并将反射/折射裁剪代理法线对齐到真实水平水面。水包真实示例复用当前六鱼候选，在水下平滑游动并转向，支持暂停恢复、视角、重新载入和原纯海面切换，处理异步晚到资源及卸载释放。
- Add bounded world-space pointer ripples and smooth nearby-fish avoidance to the Water2 demo. Preserve Orbit controls, touch scrolling and lifecycle cleanup; support continuous per-instance native animation clocks.
- 新增基于 Three.js Water2 与 Sky 的 WebGL 水面图表，包含多尺度 Gerstner 海浪、Fresnel 反射、微表面高光和浪峰白沫。

## 0.1.0

- Add a WebGL water surface based on the Three.js Water2 flow, reflection and refraction technique.
