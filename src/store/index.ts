import { proxy } from '@umijs/max';

type State = {
  nodeVisible: boolean;
  nodeVisibleChange: (value: boolean | undefined) => void;
  node: any;
  nodeInfo: any;
  nodeEdit: (value: any) => void;
  nodeChange: (value: any) => void;
};

// 1、定义数据
const state: State = proxy({
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
  //表单中修改节点
  nodeEdit: (value: any) => {
    console.log(value)
    Object.keys(value).forEach((key) => {
      state.nodeInfo[key] = value[key];
    });
  },
  //点击节点
  nodeChange: (value: any) => {
    state.node = JSON.parse(JSON.stringify(value));
    state.nodeInfo = JSON.parse(
      JSON.stringify({
        ...value.businessObject,
        ...value.businessObject.$attrs,
        documentation: value.businessObject.documentation?.[0]?.text,
      }),
    );
  },
});

export default state;
