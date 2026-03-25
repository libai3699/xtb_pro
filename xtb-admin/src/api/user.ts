import { request } from './request';

export interface AppUserItem {
  id: string;
  role: 'agent' | 'student';
  nickname?: string;
  avatar?: string;
  mobile?: string;
  openid?: string;
  unionid?: string;
  status: number;
  createdAt: string;
  agentProfile?: {
    realName: string;
    schoolName?: string;
    majorName?: string;
    gradeName?: string;
    status: number;
  };
}

export interface AdminManagerItem {
  id: string;
  username: string;
  name: string;
  mobile?: string;
  role: string;
  status: number;
  createdAt: string;
}

export function getAppUserList() {
  return request<{ code: number; message: string; data: AppUserItem[] }>('/admin/user/list');
}

export function getAdminManagerList() {
  return request<{ code: number; message: string; data: AdminManagerItem[] }>('/admin/admin-user/list');
}

