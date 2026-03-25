import { request } from './request';

export interface AppUserInfo {
  id: string;
  role: 'agent' | 'student';
  nickname?: string;
  mobile?: string;
  avatar?: string;
}

export function appRegister(data: {
  role: 'agent' | 'student';
  nickname: string;
  mobile: string;
  avatar?: string;
}) {
  return request<{ code: number; message: string; data: AppUserInfo }>('/app/register', {
    method: 'POST',
    data,
  });
}

export function appLogin(data: {
  code: string;
  role: 'agent' | 'student';
}) {
  return request<{ code: number; message: string; data: { token: string; user: AppUserInfo } }>('/app/login/wechat', {
    method: 'POST',
    data,
  });
}

