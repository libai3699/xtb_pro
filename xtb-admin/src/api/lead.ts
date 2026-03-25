import { request } from './request';

export interface LeadItem {
  id: string;
  name: string;
  mobile: string;
  schoolName?: string;
  majorName?: string;
  gradeName?: string;
  remark?: string;
  status: number;
  createdAt: string;
  campaign?: {
    id: string;
    title: string;
  };
  agentUser?: {
    id: string;
    nickname?: string;
    mobile?: string;
  };
}

export function getLeadList() {
  return request<{ code: number; message: string; data: LeadItem[] }>('/admin/lead/list');
}

