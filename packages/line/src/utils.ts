export default function getPartIndexs(I: number[], D: boolean[]) {
  // 找到缺失片段的起始点（非缺失点）
  // 先得到非空点集合，遍历此集合，寻找其中空点片段，收集片段开始结束索引
  const nonEmptyDataIndexs = I.filter(i => D[i]);
  const partIndexs: number[][] = [];
  for (let index = 0; index < nonEmptyDataIndexs.length; index++) {
    const i = nonEmptyDataIndexs[index];
    let nextSiblingIndex = i + 1;
    const startIndex = i;
    let flag = false;
    while (nextSiblingIndex < I.length && !D[nextSiblingIndex]) {
      // 为空
      nextSiblingIndex++;
      flag = true;
    }
    if (flag) {
      if (nextSiblingIndex < I.length) {
        partIndexs.push([startIndex, nextSiblingIndex]);
      } else {
        partIndexs.push([startIndex, startIndex]);
      }
    }
  }
  return partIndexs;
}
