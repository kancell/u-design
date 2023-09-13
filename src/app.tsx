import { RunTimeLayoutConfig, useKeepOutlets } from '@umijs/max';

import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import './styles.css';

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = ({}) => {
  return {
    childrenRender: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const element = useKeepOutlets();
      return <>{element}</>;
    },
  };
};
