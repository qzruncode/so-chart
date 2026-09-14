# @so-chart/utils

## 2.0.8

### Patch Changes

- 5539a01: 统一外部 CSP nonce 解析：支持复用宿主资源上的 nonce，保留旧的全局变量兼容，并让显式图表 nonce 优先。
- 5539a01: 优化基础图表动画帧、Canvas 提交、Tooltip 缓存、指针事件合并和高频命中检测，减少快速 hover 与重复 setOption 的无效工作。
- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- 5539a01: 统一日历图和桑基图的实例生命周期，收回仪表盘与进度图的内部 DOM 清理导出，并转义共享 Tooltip 生成内容中的动态文本。
- 5539a01: 统一独立 Tooltip 实现的屏幕间距、边界避让和跟随动画
- Updated dependencies [dd8bff6]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
  - @so-chart/types@2.2.0

## 2.0.7

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/types@2.0.12

## 2.0.6

### Patch Changes

- 优化cli

## 2.0.5

### Patch Changes

- 修改主题色的css变量

## 2.0.4

### Patch Changes

- 支持暗黑主题

## 2.0.3

### Patch Changes

- 增加搜索 tab

## 2.0.2

### Patch Changes

- csp

## 2.0.1

### Patch Changes

- 设置全局 **CSP_NONCE**

## 2.0.0

### Major Changes

- 环形饼图支持未选中展示总量

## 1.0.43

### Patch Changes

- 修复 tabs overflow y

## 1.0.42

### Patch Changes

- 修复 resize bug

## 1.0.41

### Patch Changes

- bar图添加 mark & 修复一些 bug

## 1.0.40

### Patch Changes

- resize 的时候宽度如果没有变化，不刷新; tabs 需要改成随宽度自适应

## 1.0.39

### Patch Changes

- line tooltip 支持拖拽并且点击详情

## 1.0.38

### Patch Changes

- pie 优化

## 1.0.37

### Patch Changes

- 增加 progress

## 1.0.36

### Patch Changes

- 实现 line mark

## 1.0.35

### Patch Changes

- 修复传入的container可能未渲染的问题

## 1.0.34

### Patch Changes

- 抗锯齿

## 1.0.33

### Patch Changes

- 柱状图检测算法、柱状图阴影边没选中、label支持关闭

## 1.0.32

### Patch Changes

- 优化包体积

## 1.0.31

### Patch Changes

- 优化动画效果

## 1.0.30

### Patch Changes

- 分包&文档

## 1.0.29

### Patch Changes

- radar图提取单独的包，以及radar图文档编写

## 1.0.28

### Patch Changes

- 添加tree图文档

## 1.0.27

### Patch Changes

- 调整日历图参数和文档

## 1.0.26

### Patch Changes

- 日历图支持不同年份一行展示

## 1.0.25

### Patch Changes

- 日历图颜色支持color和opacity

## 1.0.24

### Patch Changes

- 折线图支持 mapping 类型

## 1.0.23

### Patch Changes

- label可选、label data可选

## 1.0.22

### Patch Changes

- 添加动画

## 1.0.21

### Patch Changes

- radar图背景色默认设置透明度

## 1.0.20

### Patch Changes

- 日历图、饼图、柱状图优化 & 添加色系

## 1.0.19

### Patch Changes

- 修复bar bug

## 1.0.18

### Patch Changes

- 优化柱状图展示

## 1.0.17

### Patch Changes

- 日历图添加配置参数

## 1.0.16

### Patch Changes

- bar图axis支持隐藏tick线

## 1.0.15

### Patch Changes

- 饼图调整

## 1.0.14

### Patch Changes

- 添加calendar

## 1.0.13

### Patch Changes

- 优化编译产物

## 1.0.12

### Patch Changes

- tabs支持修改文字大小

## 1.0.11

### Patch Changes

- 添加dagre图

## 1.0.10

### Patch Changes

- 优化tooltip canvas -> svg

## 1.0.9

### Patch Changes

- tooltip -> svg渲染

## 1.0.8

### Patch Changes

- 修复bug

## 1.0.7

### Patch Changes

- tooltip调整

## 1.0.6

### Patch Changes

- 修复bug

## 1.0.5

### Patch Changes

- 添加折线面积图

## 1.0.4

### Patch Changes

- bug修复

## 1.0.3

### Patch Changes

- 添加环形堆叠柱状图

## 1.0.2

### Patch Changes

- 从utils中提取类型到types

## 1.0.1

### Patch Changes

- 8182eb1: 添加bar

## 1.0.1-next.0

### Patch Changes

- 添加bar

## 1.0.0
