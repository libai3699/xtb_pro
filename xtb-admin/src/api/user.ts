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
    inviteCode?: string;
    status: number;
  };
}

export interface AppUserFormData {
  role: 'agent' | 'student';
  nickname: string;
  mobile: string;
  avatar?: string;
  status: 0 | 1;
  realName?: string;
  schoolName?: string;
  majorName?: string;
  gradeName?: string;
  inviteCode?: string;
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

export function createAppUser(body: AppUserFormData) {
  return request<{ code: number; message: string; data: AppUserItem }>('/admin/user/create', {
    method: 'POST',
    body,
  });
}

export function updateAppUser(id: string, body: Partial<AppUserFormData>) {
  return request<{ code: number; message: string; data: AppUserItem }>(`/admin/user/update/${id}`, {
    method: 'POST',
    body,
  });
}

export function deleteAppUser(id: string) {
  return request<{ code: number; message: string }>(`/admin/user/delete/${id}`, {
    method: 'POST',
  });
}

export function getAdminManagerList() {
  return request<{ code: number; message: string; data: AdminManagerItem[] }>('/admin/admin-user/list');
}
