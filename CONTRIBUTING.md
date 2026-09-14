# Contributing to so-chart

感谢你参与 so-chart。欢迎提交问题、改进建议和 Pull Request。

## 开发环境

项目使用 Node.js `>=20.19 <26`、pnpm 9 和 TypeScript。首次安装依赖：

```bash
pnpm install --frozen-lockfile
```

常用命令：

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm run preview:build
```

## 提交变更

- 图表包源码、公开类型或行为发生变化时，请同步更新对应的 README、可运行示例和 `demo/docs`。
- 新增或修改可发布包时，请使用 Changesets 记录版本变更。
- 不要提交 `dist`、构建缓存、个人配置、凭据或真实业务数据。
- 交互和布局变更需要检查桌面与移动视口。

## Pull Request

请在描述中说明变更目的、影响范围、验证命令和已知限制。GitHub Actions 通过后再请求合并。
