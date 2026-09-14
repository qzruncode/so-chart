# @so-chart/tree

## 1.0.55

### Patch Changes

- dd8bff6: 修复 Flow 图长标签沿折线路径排布时跨越拐点导致文字拥挤的问题
- 5539a01: 统一外部 CSP nonce 解析：支持复用宿主资源上的 nonce，保留旧的全局变量兼容，并让显式图表 nonce 优先。
- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- dd8bff6: 修复 Dagre 图触摸和触控板无修饰键缩放手势被拦截的问题
- 5539a01: 支持 Dagre 空白区域拖拽平移和连线文字选择，限制缩放范围、隔离节点拖拽与触摸缩放，并收回未公开的内部 DOM 清理函数导出
- 5539a01: 让 Flow 和 Mash 图的文本、默认颜色与 tooltip 支持宿主 CSS 主题变量，修复单行节点文本忽略 `fontColor` 的问题
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [dd8bff6]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
  - @so-chart/utils@2.0.8
  - @so-chart/types@2.2.0

## 1.0.54

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/types@2.0.12
  - @so-chart/utils@2.0.7

## 1.0.53

### Patch Changes

- 优化cli
- Updated dependencies
  - @so-chart/utils@2.0.6

## 1.0.52

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.5

## 1.0.51

### Patch Changes

- 支持暗黑主题
- Updated dependencies
  - @so-chart/utils@2.0.4

## 1.0.50

### Patch Changes

- mash图增加labelColor配置
  - @so-chart/utils@2.0.3

## 1.0.49

### Patch Changes

- 调整flow图

## 1.0.48

### Patch Changes

- mash图调整
  - @so-chart/utils@2.0.3

## 1.0.47

### Patch Changes

- 修复mash图bug

## 1.0.46

### Patch Changes

- 优化Flow和Mash
  - @so-chart/utils@2.0.3

## 1.0.45

### Patch Changes

- 调整mash图

## 1.0.44

### Patch Changes

- 增加flow和mash图
  - @so-chart/utils@2.0.3

## 1.0.43

### Patch Changes

- 增加搜索 tab
- Updated dependencies
  - @so-chart/utils@2.0.3

## 1.0.42

### Patch Changes

- 优化打包

## 1.0.41

### Patch Changes

- csp
- Updated dependencies
  - @so-chart/utils@2.0.2

## 1.0.40

### Patch Changes

- 设置全局 **CSP_NONCE**
- Updated dependencies
  - @so-chart/utils@2.0.1

## 1.0.39

### Patch Changes

- 支持传 nonce id
  - @so-chart/utils@2.0.0

## 1.0.38

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.0

## 1.0.37

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.43

## 1.0.36

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.42

## 1.0.35

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.41

## 1.0.34

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.40

## 1.0.33

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.39

## 1.0.32

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.38

## 1.0.31

### Patch Changes

- 增加 progress
- Updated dependencies
  - @so-chart/utils@1.0.37

## 1.0.30

### Patch Changes

- 实现 line mark
- Updated dependencies
  - @so-chart/utils@1.0.36

## 1.0.29

### Patch Changes

- 修复传入的container可能未渲染的问题
- Updated dependencies
  - @so-chart/utils@1.0.35

## 1.0.28

### Patch Changes

- 抗锯齿
- Updated dependencies
  - @so-chart/utils@1.0.34

## 1.0.27

### Patch Changes

- resize执行等待时间 50->200
  - @so-chart/utils@1.0.33

## 1.0.26

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.33

## 1.0.25

### Patch Changes

- 优化打包体积

## 1.0.24

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.32

## 1.0.23

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.31

## 1.0.22

### Patch Changes

- 优化包体积

## 1.0.21

### Patch Changes

- d3不作为external

## 1.0.20

### Patch Changes

- 分包&文档
- Updated dependencies
  - @so-chart/utils@1.0.30

## 1.0.19

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.29

## 1.0.18

### Patch Changes

- 添加tree图文档
- Updated dependencies
  - @so-chart/utils@1.0.28

## 1.0.17

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.27

## 1.0.16

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.26

## 1.0.15

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.25

## 1.0.14

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.24

## 1.0.13

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.23

## 1.0.12

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.22

## 1.0.11

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.21

## 1.0.10

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.20

## 1.0.9

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.19

## 1.0.8

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.18

## 1.0.7

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.17

## 1.0.6

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.16

## 1.0.5

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.15

## 1.0.4

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.14

## 1.0.3

### Patch Changes

- 优化编译产物
- Updated dependencies
  - @so-chart/utils@1.0.13

## 1.0.2

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.12

## 1.0.1

### Patch Changes

- 添加dagre图
- Updated dependencies
  - @so-chart/utils@1.0.11
