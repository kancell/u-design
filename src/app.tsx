import { RunTimeLayoutConfig } from '@umijs/max';
import { useKeepOutlets } from '@umijs/max';

import './styles.css'

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    childrenRender: (_, props) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const element = useKeepOutlets();
      return (
        <>
          {element}
        </>
      );
    },
  };
};
