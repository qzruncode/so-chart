# @so-chart/types

`@so-chart/types` 是 So Chart 的声明式共享类型包，只输出 TypeScript 类型，不包含图表运行时代码。图表包内部和需要跨包复用类型的场景，可以按图表类型使用子路径导入：

```ts
import type { LineOptions } from '@so-chart/types/line';
import type { Layout } from '@so-chart/types/common';
```

各图表包的入口也会重新导出自身的公开类型，业务代码通常优先从实际使用的图表包导入：

```ts
import getLineChart, { type LineOptions } from '@so-chart/line';
```

`bar`、`line`、`point`、`radar` 的实例类型会引用 D3 scale 或 quadtree 类型，`tree` 的 Dagre 类型会引用 `@dagrejs/dagre`。类型包只声明依赖实际公开声明用到的 `@types/d3-scale` 和 `@types/d3-quadtree`，不会把整个 `@types/d3` 聚合包带入消费方；这些依赖属于声明文件的类型依赖，不会被类型包作为运行时代码导出。

Calendar 和 Sankey 实例同样提供统一的 `dispose()` 生命周期方法；组件卸载或重新创建图表前应调用 `dispose()`。
