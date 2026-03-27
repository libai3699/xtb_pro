import { request } from './request';

export interface AppProfileData {
  id: string;
  role: 'agent' | 'student';
  account?: string;
  nickname?: string;
  mobile?: string;
  avatar?: string;
  agentProfile?: {
    realName?: string;
    schoolName?: string;
    majorName?: string;
    gradeName?: string;
    inviteCode?: string;
  } | null;
}

export function getAppProfile(id: string | number) {
  return request<{ code: number; message: string; data: AppProfileData }>(`/app/user/profile/${id}`);
}

export function updateAppProfile(data: {
  userId: number;
  nickname?: string;
  mobile?: string;
  avatar?: string;
  realName?: string;
  schoolName?: string;
  majorName?: string;
  gradeName?: string;
  inviteCode?: string;
}) {
  return request<{ code: number; message: string; data: AppProfileData }>('/app/user/profile/update', {
    method: 'POST',
    data,
  });
}

export function updateAppPassword(data: { userId: number; oldPassword: string; newPassword: string }) {
  return request<{ code: number; message: string }>('/app/user/password/update', {
    method: 'POST',
    data,
  });
}
