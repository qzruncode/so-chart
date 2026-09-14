# @so-chart/guage

## 1.0.42

### Patch Changes

- 5539a01: 统一外部 CSP nonce 解析：支持复用宿主资源上的 nonce，保留旧的全局变量兼容，并让显式图表 nonce 优先。
- 5539a01: 优化基础图表动画帧、Canvas 提交、Tooltip 缓存、指针事件合并和高频命中检测，减少快速 hover 与重复 setOption 的无效工作。
- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- 5539a01: 统一日历图和桑基图的实例生命周期，收回仪表盘与进度图的内部 DOM 清理导出，并转义共享 Tooltip 生成内容中的动态文本。
- 5539a01: 统一独立 Tooltip 实现的屏幕间距、边界避让和跟随动画
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [dd8bff6]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
  - @so-chart/utils@2.0.8
  - @so-chart/types@2.2.0

## 1.0.41

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/types@2.0.12
  - @so-chart/utils@2.0.7

## 1.0.40

### Patch Changes

- 优化cli
- Updated dependencies
  - @so-chart/utils@2.0.6

## 1.0.39

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.5

## 1.0.38

### Patch Changes

- 支持暗黑主题
- Updated dependencies
  - @so-chart/utils@2.0.4

## 1.0.37

### Patch Changes

- 支持速度仪表盘
  - @so-chart/utils@2.0.3

## 1.0.36

### Patch Changes

- circle guage 支持 hollow
  - @so-chart/utils@2.0.3

## 1.0.35

### Patch Changes

- 增加搜索 tab
- Updated dependencies
  - @so-chart/utils@2.0.3

## 1.0.34

### Patch Changes

- 优化打包

## 1.0.33

### Patch Changes

- csp
- Updated dependencies
  - @so-chart/utils@2.0.2

## 1.0.32

### Patch Changes

- 设置全局 **CSP_NONCE**
- Updated dependencies
  - @so-chart/utils@2.0.1

## 1.0.31

### Patch Changes

- 支持传 nonce id
  - @so-chart/utils@2.0.0

## 1.0.30

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.0

## 1.0.29

### Patch Changes

- 修复 single guage tooltip bug

## 1.0.28

### Patch Changes

- guage single 支持 tooltip
  - @so-chart/utils@1.0.43

## 1.0.27

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.43

## 1.0.26

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.42

## 1.0.25

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.41

## 1.0.24

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.40

## 1.0.23

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.39

## 1.0.22

### Patch Changes

- 仪表盘添加环形占比图
  - @so-chart/utils@1.0.38

## 1.0.21

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.38

## 1.0.20

### Patch Changes

- 调整single guage 样式

## 1.0.19

### Patch Changes

- 仪表盘增加类型
  - @so-chart/utils@1.0.37

## 1.0.18

### Patch Changes

- 增加 progress
- Updated dependencies
  - @so-chart/utils@1.0.37

## 1.0.17

### Patch Changes

- 实现 line mark
- Updated dependencies
  - @so-chart/utils@1.0.36

## 1.0.16

### Patch Changes

- 修复传入的container可能未渲染的问题
- Updated dependencies
  - @so-chart/utils@1.0.35

## 1.0.15

### Patch Changes

- 抗锯齿
- Updated dependencies
  - @so-chart/utils@1.0.34

## 1.0.14

### Patch Changes

- resize执行等待时间 50->200
  - @so-chart/utils@1.0.33

## 1.0.13

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.33

## 1.0.12

### Patch Changes

- 优化打包体积

## 1.0.11

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.32

## 1.0.10

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.31

## 1.0.9

### Patch Changes

- 优化包体积

## 1.0.8

### Patch Changes

- d3不作为external

## 1.0.7

### Patch Changes

- 分包&文档
- Updated dependencies
  - @so-chart/utils@1.0.30

## 1.0.6

### Patch Changes

- 添加动画

## 1.0.5

### Patch Changes

- 开启抗锯齿

## 1.0.4

### Patch Changes

- 优化编译产物

## 1.0.3

### Patch Changes

- 添加dagre图

## 1.0.2

### Patch Changes

- 优化打包体积
