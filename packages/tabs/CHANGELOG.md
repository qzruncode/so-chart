# @so-chart/tabs

## 2.1.0

### Minor Changes

- 为内置图例新增可选的多选显隐模式，同时保留现有单选行为作为默认值。

### Patch Changes

- Updated dependencies
  - @so-chart/types@2.3.0
  - @so-chart/utils@2.0.9

## 2.0.1

### Patch Changes

- be55d66: Prepare the chart packages for the public open-source distribution.
- Updated dependencies [be55d66]
  - @so-chart/types@2.2.2
  - @so-chart/utils@2.0.9

## 2.0.0

### Major Changes

- 移除 `@so-chart/tabs` 对 React、React DOM 和 Ant Design 的运行时依赖。`@so-chart/tabs` 现在只负责图表内置 Tabs 的绘制与销毁；搜索、分页和详情按钮等业务交互移交调用方实现。

  同时优化内置 Tabs 的横向滚动控制样式与边界状态，并确保关闭标签栏时清理旧控制器。

## 1.0.54

### Patch Changes

- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [dd8bff6]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
  - @so-chart/utils@2.0.8
  - @so-chart/types@2.2.0

## 1.0.53

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/types@2.0.12
  - @so-chart/utils@2.0.7

## 1.0.52

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.6

## 1.0.51

### Patch Changes

- 修改主题色的css变量
- Updated dependencies
  - @so-chart/utils@2.0.5

## 1.0.50

### Patch Changes

- 支持暗黑主题
- Updated dependencies
  - @so-chart/utils@2.0.4

## 1.0.49

### Patch Changes

- radar的tab点击显示当前改成显示other

## 1.0.48

### Patch Changes

- 修复tabs点击后,min和max都是0的情况

## 1.0.47

### Patch Changes

- 修复 search tab

## 1.0.46

### Patch Changes

- 修复 search tab

## 1.0.45

### Patch Changes

- 增加搜索 tab
- Updated dependencies
  - @so-chart/utils@2.0.3

## 1.0.44

### Patch Changes

- 修复 csp bug

## 1.0.43

### Patch Changes

- 优化打包

## 1.0.42

### Patch Changes

- csp
- Updated dependencies
  - @so-chart/utils@2.0.2

## 1.0.41

### Patch Changes

- 支持传 nonce id

## 1.0.40

### Patch Changes

- tabs 添加左右三角

## 1.0.39

### Patch Changes

- 优化饼图 tabs 点击效果

## 1.0.38

### Patch Changes

- 修复 tabs overflow y

## 1.0.37

### Patch Changes

- radar图支持 tabs

## 1.0.36

### Patch Changes

- resize 的时候宽度如果没有变化，不刷新; tabs 需要改成随宽度自适应

## 1.0.35

### Patch Changes

- pie 优化

## 1.0.34

### Patch Changes

- 实现 line mark

## 1.0.33

### Patch Changes

- 解决问题
  1. 解决tick算出来的文本为undefined也绘制在页面上
  2. 解决折线图、散点图 mapping tick坐标轴文字过多重叠问题
  3. 解决折线图 datasets里的label没设置可选

## 1.0.32

### Patch Changes

- 修复 tab y可以滚动、bar图ticks有问题

## 1.0.31

### Patch Changes

- 修复点击tab重置y轴坐标系范围bug

## 1.0.30

### Patch Changes

- 修复tabs横向滚动

## 1.0.29

### Patch Changes

- 修复tabs文字自动换行

## 1.0.28

### Patch Changes

- tabs增加滚动

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

- 修复日历图bug

## 1.0.22

### Patch Changes

- 饼图调整

## 1.0.21

### Patch Changes

- 修改tooltip位置

## 1.0.20

### Patch Changes

- tabs支持修改文字大小

## 1.0.19

### Patch Changes

- tabs中的 React 版本回退到17.0.2以兼容宿主应用

## 1.0.18

### Patch Changes

- 优化打包体积

## 1.0.17

### Patch Changes

- 优化tooltip canvas -> svg

## 1.0.16

### Patch Changes

- 修复bug

## 1.0.15

### Patch Changes

- 柱状图tabs点击效果修改、饼图提示文字定位算法修复

## 1.0.14

### Patch Changes

- 修复bug

## 1.0.13

### Patch Changes

- tooltip调整

## 1.0.12

### Patch Changes

- 修复bug

## 1.0.11

### Patch Changes

- 添加折线面积图

## 1.0.10

### Patch Changes

- bug修复

## 1.0.9

### Patch Changes

- 添加堆叠柱状图

## 1.0.8

### Patch Changes

- 自定义lable(位置，内容)

## 1.0.7

### Patch Changes

- 添加散点图

## 1.0.6

### Patch Changes

- 图例：支持icon、基本图形类型（'circle', 'rect', 'path')

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
