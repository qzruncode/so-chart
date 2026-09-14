# @so-chart/types

## 2.2.2

### Patch Changes

- be55d66: Prepare the chart packages for the public open-source distribution.

## 2.2.1

### Patch Changes

- 2c76da9: 按公开声明实际使用的 D3 子模块收敛类型依赖，避免消费方安装完整的 `@types/d3` 聚合类型包。

## 2.2.0

### Minor Changes

- dd8bff6: 为雷达图增加数据区域 hover 高亮、D3 多边形命中检测和 tooltip 交互

### Patch Changes

- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- 5539a01: 统一日历图和桑基图的实例生命周期，收回仪表盘与进度图的内部 DOM 清理导出，并转义共享 Tooltip 生成内容中的动态文本。

## 2.1.0

### Minor Changes

- Support adaptive circle stacked bar layout

## 2.0.12

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。

## 2.0.11

### Patch Changes

- 优化cli

## 2.0.10

### Patch Changes

- 支持暗黑主题

## 2.0.9

### Patch Changes

- mash图增加labelColor配置

## 2.0.8

### Patch Changes

- mash图调整

## 2.0.7

### Patch Changes

- 支持速度仪表盘

## 2.0.6

### Patch Changes

- 优化Flow和Mash

## 2.0.5

### Patch Changes

- 增加flow和mash图

## 2.0.4

### Patch Changes

- circle guage 支持 hollow

## 2.0.3

### Patch Changes

- 支持voronoi

## 2.0.2

### Patch Changes

- 增加搜索 tab

## 2.0.1

### Patch Changes

- 支持传 nonce id

## 2.0.0

### Major Changes

- 环形饼图支持未选中展示总量

## 1.0.68

### Patch Changes

- guage single 支持 tooltip

## 1.0.67

### Patch Changes

- 调整趋势柱状图数据结构

## 1.0.66

### Patch Changes

- 趋势柱状图,tooltip 支持配置 dotColor

## 1.0.65

### Patch Changes

- 修复 tabs overflow y

## 1.0.64

### Patch Changes

- 柱状图支持 yAxis title

## 1.0.63

### Patch Changes

- 添加趋势柱状图

## 1.0.62

### Patch Changes

- bar图添加 mark & 修复一些 bug

## 1.0.61

### Patch Changes

- radar图支持 tabs

## 1.0.60

### Patch Changes

- resize 的时候宽度如果没有变化，不刷新; tabs 需要改成随宽度自适应

## 1.0.59

### Patch Changes

- line tooltip 支持拖拽并且点击详情

## 1.0.58

### Patch Changes

- 仪表盘添加环形占比图

## 1.0.57

### Patch Changes

- pie 优化

## 1.0.56

### Patch Changes

- 仪表盘增加类型

## 1.0.55

### Patch Changes

- 增加 progress

## 1.0.54

### Patch Changes

- 折线图mark支持点击事件

## 1.0.53

### Patch Changes

- 实现 line mark

## 1.0.52

### Patch Changes

- 解决问题
  1. 解决tick算出来的文本为undefined也绘制在页面上
  2. 解决折线图、散点图 mapping tick坐标轴文字过多重叠问题
  3. 解决折线图 datasets里的label没设置可选

## 1.0.51

### Patch Changes

- resize执行等待时间 50->200

## 1.0.50

### Patch Changes

- 柱状图检测算法、柱状图阴影边没选中、label支持关闭

## 1.0.49

### Patch Changes

- bar、line、point y坐标轴范围支持自动计算

## 1.0.48

### Patch Changes

- line图 yaxis 支持 title 配置

## 1.0.47

### Patch Changes

- 日历图增加配置：year.text

## 1.0.46

### Patch Changes

- 分包&文档

## 1.0.45

### Patch Changes

- radar图提取单独的包，以及radar图文档编写

## 1.0.44

### Patch Changes

- 添加tree图文档

## 1.0.43

### Patch Changes

- 调整日历图参数和文档

## 1.0.42

### Patch Changes

- 日历图支持不同年份一行展示

## 1.0.41

### Patch Changes

- 日历图颜色支持color和opacity

## 1.0.40

### Patch Changes

- 折线图支持 mapping 类型

## 1.0.39

### Patch Changes

- label可选、label data可选

## 1.0.38

### Patch Changes

- 添加动画

## 1.0.37

### Patch Changes

- 桑吉图

## 1.0.36

### Patch Changes

- bar line labels可选

## 1.0.35

### Patch Changes

- 日历图、饼图、柱状图优化 & 添加色系

## 1.0.34

### Patch Changes

- 优化柱状图展示

## 1.0.33

### Patch Changes

- 日历图添加配置参数

## 1.0.32

### Patch Changes

- bar图axis支持隐藏tick线

## 1.0.31

### Patch Changes

- 优化柱状图、饼图、日历图展示

## 1.0.30

### Patch Changes

- 饼图调整

## 1.0.29

### Patch Changes

- 添加calendar

## 1.0.28

### Patch Changes

- 优化编译产物

## 1.0.27

### Patch Changes

- tabs支持修改文字大小

## 1.0.26

### Patch Changes

- 添加dagre图

## 1.0.25

### Patch Changes

- 优化打包体积

## 1.0.24

### Patch Changes

- 优化tooltip canvas -> svg

## 1.0.23

### Patch Changes

- y轴坐标支持

## 1.0.22

### Patch Changes

- tooltip -> svg渲染

## 1.0.21

### Patch Changes

- tooltip 支持固定

## 1.0.20

### Patch Changes

- 折线图平滑曲线

## 1.0.19

### Patch Changes

- 柱状图tabs点击效果修改、饼图提示文字定位算法修复

## 1.0.18

### Patch Changes

- pie的提示文本动态定位

## 1.0.17

### Patch Changes

- 修复bug

## 1.0.16

### Patch Changes

- tooltip调整

## 1.0.15

### Patch Changes

- 修复bug

## 1.0.14

### Patch Changes

- 添加折线面积图

## 1.0.13

### Patch Changes

- bug修复

## 1.0.12

### Patch Changes

- 添加堆叠柱状图

## 1.0.11

### Patch Changes

- 自定义lable(位置，内容)

## 1.0.10

### Patch Changes

- 十字坐标隐藏、网格线隐藏、y轴刻度隐藏

## 1.0.9

### Patch Changes

- 添加散点图

## 1.0.8

### Patch Changes

- 图例：支持icon、基本图形类型（'circle', 'rect', 'path')

## 1.0.7

### Patch Changes

- xAixs、yAixs调整

## 1.0.6

### Patch Changes

- tooltip：缺少时间，数据格式化

## 1.0.5

### Patch Changes

- 添加雷达图

## 1.0.4

### Patch Changes

- 添加环形堆叠柱状图

## 1.0.3

### Patch Changes

- 添加堆叠折线图

## 1.0.2

### Patch Changes

- 添加仪表盘

## 1.0.1

### Patch Changes

- 添加半环形图
