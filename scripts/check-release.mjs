import { readdirSync } from 'node:fs';

const pendingChangesets = readdirSync('.changeset')
  .filter(file => file.endsWith('.md') && file !== 'README.md')
  .sort();

if (pendingChangesets.length > 0) {
  console.error('存在尚未版本化的 changeset，请先执行 pnpm changeset:version 并提交生成的版本号与 CHANGELOG.md：');
  pendingChangesets.forEach(file => console.error(`- .changeset/${file}`));
  process.exit(1);
}

console.log('release check passed: 没有待版本化的 changeset。');
