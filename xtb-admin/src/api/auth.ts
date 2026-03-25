import { request } from './request';
import type { AdminUserInfo } from '@/utils/auth';

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user: AdminUserInfo;
}

export function adminLogin(payload: AdminLoginPayload) {
  return request<{ code: number; message: string; data: AdminLoginResponse }>('/admin/login', {
    method: 'POST',
    body: payload,
  });
}
