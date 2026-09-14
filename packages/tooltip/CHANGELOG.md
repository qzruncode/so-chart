# @so-chart/tooltip

## 1.0.47

### Patch Changes

- 5539a01: 修复固定 Tooltip 开启 `drag` 后因命中事件被禁用而无法拖动的问题
- 5539a01: 优化基础图表动画帧、Canvas 提交、Tooltip 缓存、指针事件合并和高频命中检测，减少快速 hover 与重复 setOption 的无效工作。
- dd8bff6: 为雷达图增加数据区域 hover 高亮、D3 多边形命中检测和 tooltip 交互
- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- 5539a01: 优化普通 hover Tooltip 的间距、边界避让、方向切换动画和按帧跟随性能
- 5539a01: 统一日历图和桑基图的实例生命周期，收回仪表盘与进度图的内部 DOM 清理导出，并转义共享 Tooltip 生成内容中的动态文本。
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [dd8bff6]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
  - @so-chart/utils@2.0.8
  - @so-chart/types@2.2.0

## 1.0.46

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/types@2.0.12
  - @so-chart/utils@2.0.7

## 1.0.45

### Patch Changes

- 优化cli
- Updated dependencies
  - @so-chart/utils@2.0.6

## 1.0.44

### Patch Changes

- 修改主题色的css变量
- Updated dependencies
  - @so-chart/utils@2.0.5

## 1.0.43

### Patch Changes

- 支持暗黑主题
- Updated dependencies
  - @so-chart/utils@2.0.4

## 1.0.42

### Patch Changes

- 增加搜索 tab
- Updated dependencies
  - @so-chart/utils@2.0.3

## 1.0.41

### Patch Changes

- 修复 csp bug

## 1.0.40

### Patch Changes

- 优化打包

## 1.0.39

### Patch Changes

- csp
- Updated dependencies
  - @so-chart/utils@2.0.2

## 1.0.38

### Patch Changes

- 支持传 nonce id

## 1.0.37

### Patch Changes

- 修复 tooltip过长 算出 left 为负值

## 1.0.36

### Patch Changes

- 趋势柱状图,tooltip 支持配置 dotColor

## 1.0.35

### Patch Changes

- 修复拖拽 tooltip bug

## 1.0.34

### Patch Changes

- 添加趋势柱状图

## 1.0.33

### Patch Changes

- bar图添加 mark & 修复一些 bug

## 1.0.32

### Patch Changes

- line tooltip 支持拖拽并且点击详情

## 1.0.31

### Patch Changes

- 实现 line mark

## 1.0.30

### Patch Changes

- 解决cross层级问题

## 1.0.29

### Patch Changes

- 优化包体积

## 1.0.28

### Patch Changes

- 修复部分已知问题

## 1.0.27

### Patch Changes

- 分包&文档

## 1.0.26

### Patch Changes

- 折线图支持 mapping 类型

## 1.0.25

### Patch Changes

- 添加动画

## 1.0.24

### Patch Changes

- tab渲染到svg中

## 1.0.23

### Patch Changes

- 日历图、饼图、柱状图优化 & 添加色系

## 1.0.22

### Patch Changes

- 优化柱状图、饼图、日历图展示

## 1.0.21

### Patch Changes

- 优化编译产物

## 1.0.20

### Patch Changes

- 选中点样式

## 1.0.19

### Patch Changes

- 添加dagre图

## 1.0.18

### Patch Changes

- 优化打包体积

## 1.0.17

### Patch Changes

- 优化tooltip canvas -> svg

## 1.0.16

### Patch Changes

- 修复tooltip分辨率问题

## 1.0.15

### Patch Changes

- 修复tooltip xData

## 1.0.14

### Patch Changes

- y轴坐标支持

## 1.0.13

### Patch Changes

- tooltip -> svg渲染

## 1.0.12

### Patch Changes

- tooltip 支持固定

## 1.0.11

### Patch Changes

- 修复bug

## 1.0.10

### Patch Changes

- 修复bug

## 1.0.9

### Patch Changes

- tooltip调整

## 1.0.8

### Patch Changes

- 修复bug

## 1.0.7

### Patch Changes

- 添加散点图

## 1.0.6

### Patch Changes

- tooltip：缺少时间，数据格式化

## 1.0.5

### Patch Changes

- 解决折线图刷新问题

## 1.0.4

### Patch Changes

- 添加环形堆叠柱状图

## 1.0.3

### Patch Changes

- 添加pie图

## 1.0.2

### Patch Changes

- 从utils中提取类型到types

## 1.0.1

### Patch Changes

- 8182eb1: 添加bar
- Updated dependencies [8182eb1]
  - @so-chart/utils@1.0.1

## 1.0.1-next.0

### Patch Changes

- 添加bar
- Updated dependencies
  - @so-chart/utils@1.0.1-next.0

## 1.0.0

### Patch Changes

- @so-chart/utils@1.0.0
