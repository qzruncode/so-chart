# Changelog

## 0.2.0

### Minor Changes

- 新增基于 Three.js 的 PBR 仿真 3D 桌面场景图表，并导出可组合的桌体 Group 构建与释放函数。

  增加 `tabletopMaterial` 桌面专属覆盖，以及 `map`、`normalMap`、`normalScale` 贴图配置；构建桌体时复制输入贴图，调用方保留原始贴图所有权。

  补充圆桌/方桌的区分类型、`roughnessMap` 材质通道，以及可注入、可旋转的外部环境贴图和背景配置；默认 `RoomEnvironment` 仍作为无外部贴图时的回退方案。

## 0.1.0

- 新增基于 Three.js 的 PBR 仿真 3D 桌子图表。
