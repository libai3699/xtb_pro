import { request } from './request';

export interface AppUserInfo {
  id: string;
  role: 'agent' | 'student';
  account?: string;
  nickname?: string;
  mobile?: string;
  avatar?: string;
}

export interface AppRegisterPayload {
  role: 'agent' | 'student';
  account: string;
  password: string;
  nickname: string;
  mobile?: string;
  avatar?: string;
  realName?: string;
  schoolName?: string;
  majorName?: string;
  gradeName?: string;
  inviteCode?: string;
}

export function appRegister(data: AppRegisterPayload) {
  return request<{ code: number; message: string; data: AppUserInfo }>('/app/register', {
    method: 'POST',
    data,
  });
}

export function appLogin(data: { role: 'agent' | 'student'; account: string; password: string }) {
  return request<{ code: number; message: string; data: { token: string; user: AppUserInfo } }>('/app/login/wechat', {
    method: 'POST',
    data,
  });
}
