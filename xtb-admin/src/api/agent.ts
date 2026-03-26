import { request } from './request';

export interface AgentItem {
  id: string;
  userId: string;
  realName: string;
  schoolName?: string;
  majorName?: string;
  gradeName?: string;
  inviteCode?: string;
  status: number;
  createdAt: string;
  user?: {
    id: string;
    account?: string;
    nickname?: string;
    mobile?: string;
    status: number;
  };
}

export interface AgentFormData {
  account: string;
  password?: string;
  nickname: string;
  mobile: string;
  realName: string;
  schoolName?: string;
  majorName?: string;
  gradeName?: string;
  inviteCode?: string;
  status: 0 | 1 | 2;
  avatar?: string;
}

export function getAgentList() {
  return request<{ code: number; message: string; data: AgentItem[] }>('/admin/agent/list');
}

export function createAgent(body: AgentFormData) {
  return request<{ code: number; message: string; data: AgentItem }>('/admin/agent/create', {
    method: 'POST',
    body,
  });
}

export function updateAgent(id: string, body: Partial<AgentFormData>) {
  return request<{ code: number; message: string; data: AgentItem }>(`/admin/agent/update/${id}`, {
    method: 'POST',
    body,
  });
}

export function deleteAgent(id: string) {
  return request<{ code: number; message: string }>(`/admin/agent/delete/${id}`, {
    method: 'POST',
  });
}

export function auditAgent(id: string) {
  return request<{ code: number; message: string; data: AgentItem }>(`/admin/agent/audit/${id}`, {
    method: 'POST',
  });
}
