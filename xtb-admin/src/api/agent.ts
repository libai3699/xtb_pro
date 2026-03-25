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
    nickname?: string;
    mobile?: string;
    status: number;
  };
}

export function getAgentList() {
  return request<{ code: number; message: string; data: AgentItem[] }>('/admin/agent/list');
}

export function auditAgent(id: string) {
  return request<{ code: number; message: string; data: AgentItem }>(`/admin/agent/audit/${id}`, {
    method: 'POST',
  });
}

