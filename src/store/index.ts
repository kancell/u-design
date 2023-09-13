import { proxy } from '@umijs/max';

// 1、定义数据
const state = proxy({
  nodeVisible: false,
  nodeVisibleChange: (value: boolean | undefined) => {
    if (typeof value === 'boolean') {
      state.nodeVisible = value;
    } else {
      state.nodeVisible = !state.nodeVisible;
    }
  },
  node: {},
  nodeInfo: {},
  nodeEdit: (value: any) => {
    Object.keys(value).forEach((key) => {
      state.nodeInfo[key] = value[key];
    });
  },
  nodeChange: (value: any) => {
    state.node = JSON.parse(JSON.stringify(value));
    state.nodeInfo = JSON.parse(JSON.stringify(value.businessObject));
  },
});

export default state;
