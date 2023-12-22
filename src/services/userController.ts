import { IResponseData, User } from '@/type/typings';
import { request } from '@umijs/max';

export async function queryUserList(
  params: {
    keyword?: string;
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<IResponseData<User.UserInfo[]>>('/system/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addUser(
  body?: User.UserInfo,
  options?: { [key: string]: any },
) {
  return request<IResponseData>('/api/v1/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getUserDetail(
  params: {
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<IResponseData<User.UserInfo>>(`/api/v1/user/${param0}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function modifyUser(
  params: {
    userId?: string;
  },
  body?: User.UserInfo,
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<IResponseData<User.UserInfo>>(`/api/v1/user/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function deleteUser(
  params: {
    userId?: string;
  },
  options?: { [key: string]: any },
) {
  const { userId: param0 } = params;
  return request<IResponseData>(`/api/v1/user/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
