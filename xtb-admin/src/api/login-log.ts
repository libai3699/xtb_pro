import { request } from './request';

export interface LoginLogItem {
  id: string;
  loginType: string;
  username?: string;
  role?: string;
  loginStatus: number;
  ip?: string;
  countryName?: string;
  regionName?: string;
  cityName?: string;
  orgName?: string;
  locationText?: string;
  userAgent?: string;
  message?: string;
  loginAt: string;
  adminUser?: {
    id: string;
    username: string;
    name: string;
    role: string;
  };
}

export function getLoginLogList() {
  return request<{ code: number; message: string; data: LoginLogItem[] }>('/admin/login-log/list');
}
