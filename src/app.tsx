import {
  RequestConfig,
  RunTimeLayoutConfig,
  matchRoutes,
  useKeepOutlets as KeepOutlets,
} from '@umijs/max';
import { message, notification } from 'antd';
import './styles.css'
import { IResponseData } from './type/typings';

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
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
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,
    childrenRender: (_, props) => {
      const element = KeepOutlets();
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
        const errorInfo: IResponseData | undefined = error.info;
        if (errorInfo) {
          const { msg, code } = errorInfo;
          switch (code) {
            case 500:
              notification.open({
                description: msg,
                message: code,
              });
              break;
            case 401:
              message.warning(msg);
              break;
            default:
              message.error(msg);
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
    errorThrower: (res: IResponseData) => {
      const { data, code, msg } = res;
      const error: any = new Error(msg);
      error.name = 'BizError';
      error.info = { code, msg, data };
      throw error;
    },
  },
  requestInterceptors: [
    (url, options) => {
     
      let baseUrl = url.includes("http") ? "" : process.env.BASEURL
      console.log(process.env.BASEURL)
      return {
        url:  `${baseUrl}${url}`,
        options: {
          ...options,
          interceptors: true,
          headers: {
            Authorization: 'RunTimeToken',
          },
        },
      }
    },
  ],
  responseInterceptors: [
    (response: any) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      console.log(data, response, 1)
      if (!data.success) {
        message.error('请求失败！');
      }
      return response;
    },
  ],
};
