import { request } from './request';

export function submitLead(data: {
  campaignId: number;
  agentUserId?: number;
  studentUserId?: number;
  name: string;
  mobile: string;
  schoolName?: string;
  majorName?: string;
  gradeName?: string;
  remark?: string;
}) {
  return request<{ code: number; message: string; data: { id: string } }>('/app/lead/submit', {
    method: 'POST',
    data,
  });
}

