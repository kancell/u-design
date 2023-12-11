import {
  RequestConfig,
  RunTimeLayoutConfig,
  matchRoutes,
  useKeepOutlets,
} from '@umijs/max';
import { message, notification } from 'antd';

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'U-design' };
}

export function onRouteChange(R: any) {
  let { clientRoutes, location } = R;
  const route = matchRoutes(clientRoutes, location.pathname)?.pop()?.route as {
    name: string;
  };
  if (route) {
    document.title = route.name || '';
  }
}

export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    childrenRender: (_, props) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const element = useKeepOutlets();
      return <>{element}</>;
    },
  };
};

export const request: RequestConfig = {
  timeout: 3000,
  errorConfig: {
    errorHandler(error: any, opts: any) {
      if (opts?.skipErrorHandler) throw error;
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误,请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`服务器错误:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        message.error('服务器未响应，请稍后重试');
      } else {
        // 发送请求时出了点问题
        message.error('网络异常，请稍后重试');
      }
    },
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
  },
  requestInterceptors: [
    (config: { url: string | any[] }) => {
      // 拦截请求配置，进行个性化处理。
      const url = config.url.concat('?token = 123');
      return { ...config, url };
    },
  ],
  responseInterceptors: [
    (response: any) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      if (!data.success) {
        message.error('请求失败！');
      }
      return response;
    },
  ],
};
