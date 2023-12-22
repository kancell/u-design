import '@umijs/max/typings';

interface IResponseData<T = unknown> {
  code: number
  msg: string
  status: boolean
  data: T;
};

interface Pagination<T = unknown> {
  list: T;
  totalNum: number
  totalPages: number
}

declare namespace User {
  interface UserInfo {
    userId?: string
    deptId?: string
    userName?: string
    nickName?: string
    email?: string
    phonenumber?: string
    sex?: string
    avatar?: string
    password?: string
    status?: string
    loginIp?: string
    loginDate?: string
    dept?: string
    roles?: string
    roleIds?: string
    postIds?: string
    roleId?: string
  }
}