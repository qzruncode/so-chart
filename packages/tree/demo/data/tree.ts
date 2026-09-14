export const treeData = {
  nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }, { id: 'f' }, { id: 'g' }],
  edges: [
    { source: 'a', target: 'b' },
    { source: 'a', target: 'c' },
    { source: 'a', target: 'd' },
    { source: 'b', target: 'c' },
    { source: 'b', target: 'd' },
    { source: 'b', target: 'e' },
    { source: 'e', target: 'f' },
    { source: 'e', target: 'g' },
  ],
};
